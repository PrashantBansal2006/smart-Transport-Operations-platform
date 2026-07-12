import { Trip } from "../model/trip.model.js";
import Vehicle from "../model/vehicle.model.js";
import Driver from "../model/driver.model.js";

export const dispatchTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw { status: 404, message: "Trip not found" };
  }
  if (trip.status !== "Draft") {
    throw { status: 400, message: `Cannot dispatch a trip with status '${trip.status}'` };
  }

  const vehicle = await Vehicle.findById(trip.vehicleId);
  const driver = await Driver.findById(trip.driverId);

  if (!vehicle) {
    throw { status: 404, message: "Vehicle not found" };
  }
  if (!driver) {
    throw { status: 404, message: "Driver not found" };
  }

  if (vehicle.status === "InShop" || vehicle.status === "Retired") {
    throw { status: 400, message: `Vehicle is '${vehicle.status}' and cannot be dispatched` };
  }
  if (vehicle.status === "OnTrip") {
    throw { status: 400, message: "Vehicle is already OnTrip" };
  }

  if (driver.status === "Suspended" || driver.status === "OffDuty") {
    throw { status: 400, message: `Driver is '${driver.status}' and cannot be dispatched` };
  }
  if (driver.status === "OnTrip") {
    throw { status: 400, message: "Driver is already OnTrip" };
  }
  if (driver.licenseExpiryDate && new Date(driver.licenseExpiryDate) < new Date()) {
    throw { status: 400, message: "Driver's license has expired" };
  }

  if (trip.cargoWeightKg > vehicle.maxLoadCapacity) {
    throw {
      status: 400,
      message: `Cargo weight (${trip.cargoWeightKg}kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity}kg)`,
    };
  }

  trip.status = "Dispatched";
  trip.dispatchedAt = new Date();
  vehicle.status = "OnTrip";
  driver.status = "OnTrip";

  await trip.save();
  await vehicle.save();
  await driver.save();

  return trip;
};

export const completeTrip = async (tripId, { finalOdometer, fuelConsumedLiters }) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw { status: 404, message: "Trip not found" };
  }
  if (trip.status !== "Dispatched") {
    throw { status: 400, message: `Cannot complete a trip with status '${trip.status}'` };
  }

  const vehicle = await Vehicle.findById(trip.vehicleId);
  const driver = await Driver.findById(trip.driverId);

  if (!vehicle) {
    throw { status: 404, message: "Vehicle not found" };
  }
  if (!driver) {
    throw { status: 404, message: "Driver not found" };
  }

  if (finalOdometer === undefined || finalOdometer === null) {
    throw { status: 400, message: "finalOdometer is required to complete a trip" };
  }
  if (finalOdometer < vehicle.odometer) {
    throw { status: 400, message: "finalOdometer cannot be less than current vehicle odometer" };
  }
  if (fuelConsumedLiters === undefined || fuelConsumedLiters === null || fuelConsumedLiters < 0) {
    throw { status: 400, message: "Valid fuelConsumedLiters is required to complete a trip" };
  }

  trip.status = "Completed";
  trip.finalOdometer = finalOdometer;
  trip.fuelConsumedLiters = fuelConsumedLiters;
  trip.completedAt = new Date();

  vehicle.status = "Available";
  vehicle.odometer = finalOdometer;
  driver.status = "Available";

  await trip.save();
  await vehicle.save();
  await driver.save();

  return trip;
};

export const cancelTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw { status: 404, message: "Trip not found" };
  }
  if (trip.status !== "Dispatched" && trip.status !== "Draft") {
    throw { status: 400, message: `Cannot cancel a trip with status '${trip.status}'` };
  }

  if (trip.status === "Dispatched") {
    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (vehicle && vehicle.status === "OnTrip") {
      vehicle.status = "Available";
      await vehicle.save();
    }
    if (driver && driver.status === "OnTrip") {
      driver.status = "Available";
      await driver.save();
    }
  }

  trip.status = "Cancelled";
  await trip.save();

  return trip;
};