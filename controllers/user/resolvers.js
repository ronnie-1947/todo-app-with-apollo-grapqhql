import * as User from './User.js'

export default {

  Query: {
    me: async (_, args, ctx) => await User.getMe(ctx)
  },

  Mutation: {
    registerUser: async (_, args) => await User.registerUser(args),
    loginUser: async (_, args, ctx) => await User.loginUser(args, ctx)
  }
}