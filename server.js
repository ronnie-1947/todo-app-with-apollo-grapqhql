import express from 'express'
import dotenv from 'dotenv'
import ApolloServer from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import path from 'path'

import {verifyJwt} from './utils/jwt.js'
import {makeDB} from './utils/__fileSystem.js'
import { resolvers, typeDefs } from './graphql/index.js'

dotenv.config()

const app = express()

const graphqlServer = new ApolloServer.ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const authCookies = req.cookies['_sid']
      ? `Bearer ${req.cookies['_sid']}`
      : ''
    const authToken = req.headers.authorization || authCookies || ''
    const decodedToken = authToken? verifyJwt(authToken.split('Bearer ')[1]):null
    const device = req.headers['x-device-type']
    
    return {
      user: decodedToken,
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
const server = app.listen(process.env.PORT || 3737, () => {
  makeDB()
  console.log(`server running in http://localhost:${process.env?.PORT || 3737}/graphql`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})
