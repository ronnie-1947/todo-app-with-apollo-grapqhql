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

export const getMyTasks = async ({ page = 1, limit = 15 }, { user }) => {
  try {
    // Validate User
    if (!user) throw new Error('You are not logged in')

    // Read Todo File and get tasks
    const td = readFile(filePath)
    const requiredTasks = td.filter((c) => c.userId === user.id)

    // Modify result
    const startIndx = (page - 1) * limit
    const endIndx = startIndx + limit - 1

    const finalTaskList = requiredTasks.filter((c, i) => i >= startIndx && i <= endIndx)

    // Return Tasks
    return finalTaskList
  } catch (error) {
    throw error
  }
}

export const modifyCompletion = async (args, { user }) => {
  try {
    // Validate User
    if (!user) throw new Error('You are not logged in')

    // Read Todo File and get tasks
    const td = readFile(filePath)

    // Get specific task
    const taskIndx = td.findIndex((t) => t.id === args.taskId)
    
    const task = { ...td[taskIndx] }

    // Check user authorization
    if (task.userId !== user.id) throw new Error('You are not authorized to make changes')

    // Modify task
    task.completed = !task.completed
    td[taskIndx] = task
    writeFile(filePath, td)

    // Get 200 successful
    return task
  } catch (error) {
    throw error
  }
}

export const updateTask = async (args, { user }) => {
  try {
    // Validate User
    if (!user) throw new Error('You are not logged in')

    // Read Todo File and get tasks
    const td = readFile(filePath)

    // Get specific task
    const taskIndx = td.findIndex((t) => t.id === args.taskId)
    const task = { ...td[taskIndx] }

    // Check user authorization
    if (task.userId !== user.id) throw new Error('You are not authorized to make changes')

    // Modify task
    task.task = args.task
    td[taskIndx] = task
    writeFile(filePath, td)

    // Get 200 successful
    return task
  } catch (error) {
    throw error
  }
}


export const deleteTask = async (args, {user})=> {
  try {

    // Validate User
    if (!user) throw new Error('You are not logged in')

    // Read Todo File and get tasks
    const td = readFile(filePath)

    // Get specific task
    const taskIndx = td.findIndex((t) => t.id === args.taskId)
    const task = { ...td[taskIndx] }

    // Check user authorization
    if (task.userId !== user.id) throw new Error('You are not authorized to make changes')

    // Filter and update task
    td.splice(taskIndx, 1)
    writeFile(filePath, td)

    // Return 200 success
    return 'successful'
    
  } catch (error) {
    throw error
  }
}