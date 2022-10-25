import path from 'path'
import bcrypt from 'bcrypt'
import uniqid from 'uniqid'

import { createToken } from '../../utils/jwt.js'
import {readFile, writeFile} from '../../utils/__fileSystem.js'

const filePath = path.join(process.cwd(), 'database', 'user.json')


export const getMe = async (ctx) => {

  try {
    // Check if you are logged in
    if(!ctx?.user) throw new Error('You are not logged in')

    // Find user in database
    const ud = await readFile(filePath)
    const me = ud.find(c=> c.id === ctx.user.id)
    
    // Return 200 response
    return me
    
  } catch (error) {
    throw error
  }
}

export const registerUser = async (args) => {
  try {
    
    // Read users from database
    const ud = await readFile(filePath)
    if (!Array.isArray(ud) || ud === '') ud = []

    // Check if email or username exists
    const checkExistance = ud.filter((user) => user.email === args.email || user.username === args.username)
    if (checkExistance.length > 0) throw new Error('User already exist')

    // Hash password
    const hashedPass = await bcrypt.hash(args.password, 11)

    // Save new user
    const newUser = { id: uniqid(), ...args, password: hashedPass }
    writeFile(filePath, [...ud, newUser])

    // Return new user
    return newUser
  } catch (error) {
    throw error
  }
}

export const loginUser = async ({ username, password }, ctx) => {
  try {
    // Read users from database
    let ud = await readFile(filePath)
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

export const logutUser = async ({res}) => {
  try {
    // Clear cookie
    res.clearCookie('_sid')
    return 'success logout'

  } catch (error) {
    console.error(error)
    throw error
  }
}


export const editUser = async (args, ctx)=> {
  try {

    // Check Authentication
    if(!ctx.user) throw new Error('You are not logged in')

    // Read users database & find index of the user
    const ud = await readFile(filePath)
    const userIndex = ud.findIndex(c=>c.id===ctx.user.id)

    // Modify user array
    const modifiedUser = {...ud[userIndex], ...args}

    // Save database
    ud[userIndex] = modifiedUser
    writeFile(filePath, ud)

    // Return 200 success message
    return modifiedUser
    
  } catch (error) {
    throw error
  }
}