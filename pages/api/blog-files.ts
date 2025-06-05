import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Path to the blog notes directory in the public folder
    const blogDir = path.join(process.cwd(), 'public', 'Blog notes')

    // Read the directory
    const files = await fs.promises.readdir(blogDir)

    // Filter for markdown files
    const markdownFiles = files.filter(file => file.endsWith('.md'))

    // Return the list of markdown files
    res.status(200).json(markdownFiles)
  } catch (error) {
    console.error('Error reading blog files:', error)
    res.status(500).json({ error: 'Failed to read blog files' })
  }
}
