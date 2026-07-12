import Driver from "../model/driver.model.js";

// GET /api/drivers?status=&search=
export const getDrivers = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const drivers = await Driver.find(query).sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drivers", error: error.message });
  }
};

// GET /api/drivers/available
export const getAvailableDrivers = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const query = {
      status: { $nin: ["Suspended", "OnTrip"] },
      $or: [
        { licenseExpiryDate: { $gt: currentDate } },
        { licenseExpiryDate: { $exists: false } },
        { licenseExpiryDate: null }
      ]
    };

    const drivers = await Driver.find(query).sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available drivers", error: error.message });
  }
};

// POST /api/drivers
export const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber, safetyScore } = req.body;
    
    const newDriver = new Driver({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate: licenseExpiry,
      contactNumber,
      safetyScore: safetyScore !== undefined ? safetyScore : 100
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(500).json({ message: "Error creating driver", error: error.message });
  }
};

// PUT /api/drivers/:id
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.licenseExpiry) {
      updateData.licenseExpiryDate = updateData.licenseExpiry;
      delete updateData.licenseExpiry;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: "Error updating driver", error: error.message });
  }
};
