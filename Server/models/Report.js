// import mongoose from 'mongoose';

// const medicalReportSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   originalText: {
//     type: String,
//     required: true
//   },
//   aiAnalysis: {
//     type: String,
//     required: true
//   },
//   reportType: {
//     type: String,
//     enum: ['blood_test', 'urine_test', 'xray', 'mri', 'general'],
//     default: 'general'
//   },
//   fileUrl: {
//     type: String
//   },
//   analysisDate: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('MedicalReport', medicalReportSchema);