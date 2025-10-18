// models/Vitals.js
import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    bloodSugar: Number, // fasting sugar
    weight: Number, // in kg
    heartRate: Number,
    temperature: Number,
    notes: String
  },
  { timestamps: true }
);

const Vitals = mongoose.models.Vitals || mongoose.model('Vitals', vitalsSchema);
export default Vitals;