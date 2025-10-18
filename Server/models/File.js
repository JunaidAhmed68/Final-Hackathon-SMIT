// models/File.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    fileType: { 
      type: String, 
      enum: ['report', 'prescription', 'image', 'other'],
      default: 'report'
    },
    uploadDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;