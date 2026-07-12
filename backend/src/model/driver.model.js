import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: String,

    licenseNumber: {
      type: String,
      unique: true,
    },

    licenseCategory: String,

    licenseExpiryDate: Date,

    contactNumber: String,

    safetyScore: {
      type: Number,
      default: 100,
    },

    tripsCompleted: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Available", "OnTrip", "OffDuty", "Suspended"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
