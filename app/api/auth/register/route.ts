import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const { name, email, password, role, company } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (role === 'recruiter' && !company) {
      return NextResponse.json({ message: 'Company is required for recruiter accounts' }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: 'Email is already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role === 'recruiter' || role === 'candidate' || role === 'admin' ? role : 'candidate',
      company: company || undefined,
    })

    const { password: _pw, ...safeUser } = user.toObject()

    return NextResponse.json({ user: safeUser }, { status: 201 })
  } catch (error) {
    console.error('Register error', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

