import * as Todo from './Todo.js'
import * as User from '../user/User.js'

export default {

  Query: {
    getMyTasks: async (_, args, ctx)=> Todo.getMyTasks(args, ctx)
  },

  Mutation: {
    createTask: async (_, args, ctx)=> Todo.createTask(args, ctx),
    modifyCompletion: async (_, args, ctx)=> Todo.modifyCompletion(args, ctx),
    editTask: async (_, args, ctx)=> Todo.updateTask(args, ctx),
    deleteTask: async (_, args, ctx) => Todo.deleteTask(args, ctx)
  },

  Todo: {
    user: async (_, __, ctx) => await User.getMe(ctx)
  }
}