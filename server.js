import express from 'express'
import dotenv from 'dotenv'
import ApolloServer from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { resolvers, typeDefs } from './graphql/index.js'

dotenv.config()

const app = express()

const graphqlServer = new ApolloServer.ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const authCookies = req.cookies['token']
      ? `Bearer ${req.cookies['token']}`
      : ''
    const auth = req.headers.authorization || authCookies || ''
    const device = req.headers['x-device-type']

    return {
      auth,
      res,
      req,
      device
    }
  }
})

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(process.cwd(), 'public')))

await graphqlServer.start()
graphqlServer.applyMiddleware({ app, path: '/graphql' })

// Start server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`server running in http://localhost:${process.env?.PORT || 5000}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})
