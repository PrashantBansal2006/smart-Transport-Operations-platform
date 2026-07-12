import Vehicle from "../model/vehicle.model.js";
import { Trip } from "../model/trip.model.js";

export const getDashboardKPIs = async (req, res) => {
  try {
    const { vehicleType, status, region } = req.query;

    let vehicleQuery = {};
    if (vehicleType) vehicleQuery.type = vehicleType;
    if (status) vehicleQuery.status = status;
    if (region) vehicleQuery.region = region;

    // Aggregate vehicles
    const totalVehicles = await Vehicle.countDocuments(vehicleQuery);
    const availableVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: "Available" });
    const onTripVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: "OnTrip" });
    const inShopVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: "InShop" });

    // Aggregate active trips (assuming active means Dispatched)
    const activeTrips = await Trip.countDocuments({ status: "Dispatched" });

    res.status(200).json({
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: onTripVehicles,
        inShop: inShopVehicles
      },
      activeTrips
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard KPIs", error: error.message });
  }
};
