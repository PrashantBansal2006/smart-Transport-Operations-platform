import Vehicle from "../model/vehicle.model.js";

export const getVehicles = async (req, res) => {
  try {
    const { type, status, region, search } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (region) filter.region = { $regex: region, $options: "i" };

    if (search) {
      filter.$or = [
        { registrationNumber: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    console.log("getVehicles error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      status: { $nin: ["InShop", "Retired"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    console.log("getAvailableVehicles error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { regNumber, nameModel, type, maxLoadCapacityKg, odometer, acquisitionCost, region } = req.body;

    if (!regNumber) {
      return res.status(400).json({ success: false, message: "registrationNumber is required" });
    }

    const existing = await Vehicle.findOne({ registrationNumber: regNumber });
    if (existing) {
      return res.status(409).json({ success: false, message: "Vehicle with this registration already exists" });
    }

    const vehicle = await Vehicle.create({
      registrationNumber: regNumber,
      model: nameModel,
      type,
      maxLoadCapacity: maxLoadCapacityKg,
      odometer,
      acquisitionCost,
      region,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    console.log("createVehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    console.log("updateVehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    if (vehicle.status === "OnTrip") {
      return res.status(400).json({ success: false, message: "Cannot delete a vehicle that is currently on a trip" });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.log("deleteVehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
