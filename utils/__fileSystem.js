import fs from 'fs'

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
