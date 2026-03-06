import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema({
  candidateId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId:        { type: String, required: true },
  jobTitle:     { type: String, required: true },
  company:      { type: String, required: true },
  cvUrl:        { type: String },
  status:       { type: String, enum: ['pending','processing','screened','shortlisted','rejected'], default: 'pending' },
  result:       { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema)