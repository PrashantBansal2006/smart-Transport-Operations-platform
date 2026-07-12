import FuelLog from "../model/fuelLog.js";

export const createFuelLog = async (req, res) => {
  try {
    const { vehicleId, tripId, liters, cost, date } = req.body;

    if (!vehicleId || !liters || !cost) {
      return res.status(400).json({ success: false, message: "vehicleId, liters and cost are required" });
    }

    const fuelLog = await FuelLog.create({
      vehicleId,
      tripId,  // optional
      liters,
      cost,
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, data: fuelLog });
  } catch (error) {
    console.log("createFuelLog error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFuelLogs = async (req, res) => {
  try {
    const fuelLogs = await FuelLog.find()
      .populate("vehicleId", "registrationNumber model")
      .populate("tripId")
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: fuelLogs.length, data: fuelLogs });
  } catch (error) {
    console.log("getFuelLogs error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
