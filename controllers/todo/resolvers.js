import * as Todo from './Todo.js'

export default {

  Query: {
    
  },

  Mutation: {
    createTask: async (_, args, ctx)=> Todo.createTask(args, ctx)
  }
}