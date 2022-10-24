import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import uniqid from 'uniqid'

import { createToken } from '../../utils/jwt.js'

const filePath = path.join(process.cwd(), 'database', 'user.json')

const readUsers = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error('Database reading failed')
  }
}

const writeUsers = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data))
  } catch (error) {
    throw new Error('Writing to database failed')
  }
}

export const getMe = async (ctx) => {

  try {
    if(ctx?.user) return ctx.user
    throw new Error('You are not logged in')
    
  } catch (error) {
    throw error
  }
}

export const registerUser = async (args) => {
  try {
    
    // Read users from database
    const ud = await readUsers()
    if (!Array.isArray(ud) || ud === '') ud = []

    // Check if email or username exists
    const checkExistance = ud.filter((user) => user.email === args.email || user.username === args.username)
    if (checkExistance.length > 0) throw new Error('User already exist')

    // Hash password
    const hashedPass = await bcrypt.hash(args.password, 11)

    // Save new user
    const newUser = { id: uniqid(), ...args, password: hashedPass }
    writeUsers([...ud, newUser])

    // Return new user
    return newUser
  } catch (error) {
    throw error
  }
}

export const loginUser = async ({ username, password }, ctx) => {
  try {
    // Read users from database
    const ud = await readUsers()
    if (!Array.isArray(ud) || ud === '') ud = []

    // Check if email or username exists
    const user = ud.find((user) => user.email === username || user.username === username)
    if (!user) throw new Error('Invalid Username or Password')

    // Check password
    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) throw new Error('Invalid Username or Password')

    // Create JWT Token
    const sanitizedUser = { ...user }
    delete sanitizedUser.password
    const jwtToken = createToken(sanitizedUser)

    // Send Token via cookie
    ctx.res.cookie('_sid', jwtToken, { maxAge: 1000 * 60 * 60, httpOnly: true })

    // Return to graphql
    return {
      token: jwtToken
    }
  } catch (error) {
    throw error
  }
}

export const logutUser = async (ctx) => {
  try {

    // Clear cookie
    res.clearCookie('_sid')
    return 'success logout'

  } catch (error) {
    throw error
  }
}
