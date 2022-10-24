import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(5).toString('hex')

export const createToken = (data) => {
  try {
    const token = jwt.sign(data, JWT_SECRET, {
      expiresIn: '1h'
    })
    return token
  } catch (error) {
    throw new Error('LogIn failed')
  }
}

export const verifyJwt = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload
  } catch (error) {
  }
}
