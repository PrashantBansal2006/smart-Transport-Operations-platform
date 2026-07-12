import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      unique: true,
    },

    model: String,

    type: {
      type: String,
      enum: ["Truck", "Van", "Mini Truck", "Pickup", "Trailer"],
    },

    maxLoadCapacity: Number,

    odometer: Number,

    acquisitionCost: Number,

    status: {
      type: String,
      enum: ["Available", "OnTrip", "InShop", "Retired"],
      default: "Available",
    },

    region: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
