import fs from 'fs'
import path from 'path'

export const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
    throw new Error('Database reading failed')
  }
}

export const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data))
  } catch (error) {
    throw new Error('Writing to database failed')
  }
}

export const makeDB = () => {
  
  const dbPath = path.join(process.cwd(), 'database')
  
  // Check if file exists
  const chckDir = fs.existsSync(dbPath)
  const chckTodo = fs.existsSync(`${dbPath}/todo.json`)
  const chckUsr = fs.existsSync(`${dbPath}/user.json`)

  if(!chckDir) fs.mkdirSync('database')

  // Make new file
  if(!chckTodo) fs.writeFile(`${dbPath}/todo.json`, JSON.stringify([]), (err)=>{
    if(err)throw err
  })
  if(!chckUsr) fs.writeFile(`${dbPath}/user.json`, JSON.stringify([]), (err)=>{
    if(err)throw err
  })
}