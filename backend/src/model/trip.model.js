import mongoose,{Schema} from "mongoose"

const tripSchema = new Schema({
  tripCode: {
    type: String,
    unique: true,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  cargoWeightKg: {
    type: Number,
    required: true,
  },
  plannedDistanceKm: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
    default: 'Draft',
  },
  finalOdometer: {
    type: Number,
  },
  fuelConsumedLiters: {
    type: Number,
  },
  dispatchedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Trip= mongoose.model('Trip', tripSchema);