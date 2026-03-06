import mongoose, { Schema, models, model } from 'mongoose'
import type { UserRole } from '@/types'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: UserRole
  company?: string
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['recruiter', 'candidate', 'admin'],
      default: 'candidate',
    },
    company: { type: String },
  },
  { timestamps: true }
)

const User = models.User || model<IUser>('User', UserSchema)

export default User