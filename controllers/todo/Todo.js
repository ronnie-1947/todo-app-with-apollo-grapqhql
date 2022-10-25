import path from 'path'
import uniqid from 'uniqid'

import { readFile, writeFile } from '../../utils/__fileSystem.js'

const filePath = path.join(process.cwd(), 'database', 'todo.json')

export const createTask = async (args, { user }) => {
  try {

    // Validate User
    if (!user) throw new Error('You are not logged in')

    // Read Todo File
    let td = readFile(filePath)
    if (!Array.isArray(td) || td === '') td = []

    // Form new task
    const newTask = {
      id: uniqid(),
      completed: false,
      createdAt: new Date(),
      userId: user.id,
      ...args
    }

    // Save new task
    writeFile(filePath, [newTask, ...td])

    return newTask

  } catch (error) {
    throw error
  }
}
