import mongoose,{Schema} from "mongoose";

const maintenanceLogSchema = new mongoose.Schema({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active',
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const MaintenanceLog= mongoose.model('MaintenanceLog', maintenanceLogSchema);