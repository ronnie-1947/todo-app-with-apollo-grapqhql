import fs from 'fs'
import path from 'path'
import {__dirname} from '../utils/__dirname.js'

const basePath = path.join(__dirname, '..', 'controllers')

const base = fs.readFileSync(`${basePath}/base/typeDefs.graphql`, 'utf-8')
const helloFriend = fs.readFileSync(`${basePath}/helloFriend/typeDefs.graphql`, 'utf-8')
const user = fs.readFileSync(`${basePath}/user/typeDefs.graphql`, 'utf-8')

export default [base, helloFriend, user]
