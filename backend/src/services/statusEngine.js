import { Trip } from "../models/trip.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Driver } from "../models/driver.model.js";

export const dispatchTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw {
        status: 404,
        message: "Trip not found"
    };
  }
  if (trip.status !== "Draft") {
    throw { 
        status: 400,
        message: `Cannot dispatch a trip with status '${trip.status}'` 
    };
  }

  const vehicle = await Vehicle.findById(trip.vehicleId);
  const driver = await Driver.findById(trip.driverId);

  if (!vehicle){
    throw {
        status: 404, 
        message: "Vehicle not found"
    }
  }
  if (!driver){
    throw { 
        status: 404, 
        message: "Driver not found" 
    }
  }

  if (vehicle.status === "In Shop" || vehicle.status === "Retired") {
    throw { 
        status: 400, 
        message: `Vehicle is '${vehicle.status}' and cannot be dispatched` 
    };
  }

  if (vehicle.status === "On Trip") {
    throw { 
        status: 400,
        message: "Vehicle is already On Trip"
    }
  }

  if (driver.status === "Suspended" || driver.status === "Off Duty") {
    throw {
        status: 400,
        message: `Driver is '${driver.status}' and cannot be dispatched` 
    }
  }
  if (driver.status === "On Trip") {
    throw {
        status: 400,
        message: "Driver is already On Trip" 
    }
  }
  if (driver.licenseExpiry && new Date(driver.licenseExpiry) < new Date()) {
    throw { 
        status: 400, 
        message: "Driver's license has expired" 
    }
  }

  if (trip.cargoWeightKg > vehicle.maxLoadCapacityKg) {
    throw {
      status: 400,
      message: `Cargo weight (${trip.cargoWeightKg}kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacityKg}kg)`,
    }
  }

  trip.status = "Dispatched";
  trip.dispatchedAt = new Date();
  vehicle.status = "On Trip";
  driver.status = "On Trip";

  await trip.save();
  await vehicle.save();
  await driver.save();

  return trip;
}

export const completeTrip = async (tripId, { finalOdometer, fuelConsumedLiters }) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw {
        status: 404, 
        message: "Trip not found" 
    }
  }
  if (trip.status !== "Dispatched") {
    throw {
        status: 400,
        message: `Cannot complete a trip with status '${trip.status}'` 
    }
  }

  const vehicle = await Vehicle.findById(trip.vehicleId);
  const driver = await Driver.findById(trip.driverId);

  if (!vehicle){
    throw { 
        status: 404, 
        message: "Vehicle not found" 
    }
  }

  if (!driver){
    throw { 
        status: 404, 
        message: "Driver not found" 
    }
  }

  if (finalOdometer === undefined || finalOdometer === null) {
    throw { 
        status: 400, 
        message: "finalOdometer is required to complete a trip" 
    }
  }

  if (finalOdometer < vehicle.odometer) {
    throw { 
        status: 400, 
        message: "finalOdometer cannot be less than current vehicle odometer" 
    }
  }

  if (fuelConsumedLiters === undefined || fuelConsumedLiters === null || fuelConsumedLiters < 0) {
    throw { 
        status: 400, 
        message: "Valid fuelConsumedLiters is required to complete a trip" 
    }
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
}

export const cancelTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw { 
        status: 404, 
        message: "Trip not found" 
    }
  }

  if (trip.status !== "Dispatched" && trip.status !== "Draft") {
    throw { 
        status: 400, 
        message: `Cannot cancel a trip with status '${trip.status}'` 
    }
  }

  if (trip.status === "Dispatched") {
    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (vehicle && vehicle.status === "On Trip") {
      vehicle.status = "Available";
      await vehicle.save();
    }
    if (driver && driver.status === "On Trip") {
      driver.status = "Available";
      await driver.save();
    }
  }

  trip.status = "Cancelled";
  await trip.save();

  return trip;
}