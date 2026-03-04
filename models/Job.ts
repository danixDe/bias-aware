import mongoose, { Schema, models, model } from 'mongoose'

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'remote'], required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    salary: { type: String },
    postedAt: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
    applicants: { type: Number, default: 0 },
    recruiterName: { type: String, required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const Job = models.Job || model('Job', JobSchema)

export default Job

