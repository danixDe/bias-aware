import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const { password: _pw, ...safeUser } = user.toObject()

    // Note: this only returns the user; session handling can be added later.
    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Login error', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

