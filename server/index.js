import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { optimizeAndCompare } from './services/optimizer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.post('/api/optimize', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await optimizeAndCompare(prompt);
    res.json(result);
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize prompt', details: error.message });
  }
});

import { executeGroqPrompt } from './services/groq.js';

app.post('/api/execute', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    
    // Default to a safe model if none provided
    const targetModel = model || 'llama-3.3-70b-versatile';
    
    const result = await executeGroqPrompt(targetModel, prompt);
    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Failed to execute prompt', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
