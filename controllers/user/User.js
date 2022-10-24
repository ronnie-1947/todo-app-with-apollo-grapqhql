import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import uniqid from 'uniqid'

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

export const getMe = async () => {
  const me = {
    username: 'lahori',
    email: 'lahori@strapi.com',
    firstName: 'laho',
    lastName: 'ri'
  }

  return me
}

export const registerUser = async (args) => {
  try {
    // Read users from database
    const ud = await readUsers()
    if (!Array.isArray(ud) || ud === '') ud = []

    // Check if email or username exists
    const checkExistance = ud.filter(
      (user) => user.email === args.email || user.username === args.username
    )
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
