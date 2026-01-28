import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3001
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINIAPI_KEY

if (!apiKey) {
  console.warn('GEMINI API key not found in environment. Set GEMINI_API_KEY.')
}

let model = null
try {
  if (apiKey) {
    const genAI = new GoogleGenerativeAI({ apiKey })
    const generationConfig = {
      temperature: 1,
      topP: 0.8,
      topK: 40,
      responseMimeType: 'application/json',
    }
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig })
  }
} catch (err) {
  console.error('Failed to initialize GoogleGenerativeAI:', err)
}

app.post('/api/gemini', async (req, res) => {
  const { query } = req.body || {}
  if (!query || !String(query).trim()) return res.status(400).json({ error: 'Missing query' })
  if (!model) return res.status(500).json({ error: 'Server not configured with Gemini API key' })

  const prompt = `You are a helpful assistant. Answer the user's query concisely and accurately. => ${query}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    let value
    try {
      value = JSON.parse(text)
    } catch (e) {
      // Not JSON — return raw text
      return res.json({ response: text })
    }

    return res.json({ response: value.response ?? value })
  } catch (err) {
    console.error('Error generating content:', err)
    return res.status(500).json({ error: 'Generation failed' })
  }
})

app.listen(port, () => {
  console.log(`Gemini proxy server listening on http://localhost:${port}`)
})
