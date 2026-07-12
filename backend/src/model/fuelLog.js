import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  liters: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { timestamps: true });

const FuelLog = mongoose.model('FuelLog', fuelLogSchema);
export default FuelLog;

