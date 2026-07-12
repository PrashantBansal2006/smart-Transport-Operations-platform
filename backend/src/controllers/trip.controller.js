import { Trip } from "../model/trip.model.js";
import Vehicle from "../model/vehicle.model.js";
import Driver from "../model/driver.model.js";
import { dispatchTrip, completeTrip, cancelTrip } from "../services/statusEngine.js";

const generateTripCode = async () => {
  const count = await Trip.countDocuments();
  const next = count + 1;
  return `TR${String(next).padStart(3, "0")}`;
};

export const createTrip = async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeightKg, plannedDistanceKm } = req.body;

    if (!source || !destination || !vehicleId || !driverId || cargoWeightKg == null || plannedDistanceKm == null) {
      return res.status(400).json({
        success: false,
        error: "source, destination, vehicleId, driverId, cargoWeightKg and plannedDistanceKm are all required",
      });
    }

    if (cargoWeightKg <= 0 || plannedDistanceKm <= 0) {
      return res.status(400).json({
        success: false,
        error: "cargoWeightKg and plannedDistanceKm must be positive numbers",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: "Vehicle not found" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, error: "Driver not found" });
    }

    if (cargoWeightKg > vehicle.maxLoadCapacity) {
      return res.status(400).json({
        success: false,
        error: `Cargo weight exceeds vehicle max load capacity (${vehicle.maxLoadCapacity}kg)`,
      });
    }

    const tripCode = await generateTripCode();

    const trip = await Trip.create({
      tripCode,
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeightKg,
      plannedDistanceKm,
      status: "Draft",
    });

    return res.status(201).json({ success: true, data: trip });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Duplicate trip code, please retry" });
    }
    console.error("createTrip error:", error);
    return res.status(500).json({ success: false, error: "Failed to create trip" });
  }
};

export const getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      const validStatuses = ["Draft", "Dispatched", "Completed", "Cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: `Invalid status filter: ${status}` });
      }
      filter.status = status;
    }

    const trips = await Trip.find(filter)
      .populate("vehicleId", "registrationNumber model type status")
      .populate("driverId", "name licenseNumber status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: trips });
  } catch (error) {
    console.error("getTrips error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch trips" });
  }
};

export const dispatchTripHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await dispatchTrip(id);
    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error("dispatchTrip error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to dispatch trip",
    });
  }
};

export const completeTripHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { finalOdometer, fuelConsumedLiters } = req.body;

    const trip = await completeTrip(id, { finalOdometer, fuelConsumedLiters });
    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error("completeTrip error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to complete trip",
    });
  }
};

export const cancelTripHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await cancelTrip(id);
    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error("cancelTrip error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to cancel trip",
    });
  }
};