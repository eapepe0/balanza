import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import cors from 'cors';
import { stmts, saveRecipe } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Mock serial port for development
const mockSerialPort = {
  write: (data, callback) => callback(),
  on: (event, callback) => {
    if (event === 'data') {
      // Simulate weight data every second
      setInterval(() => callback(Buffer.from('0.00')), 1000);
    }
  }
};

// Use mock serial port in development
/* const port = process.env.NODE_ENV === 'production' 
  ? new SerialPort({ path: 'COM1', baudRate: 9600 })
  : mockSerialPort; */
const port = mockSerialPort;
port.on('data', (data) => {
  let currentWeight = parseFloat(data.toString());
  io.emit('weight', currentWeight);
});

// Recipe validation middleware
const validateRecipe = (req, res, next) => {
  const { name, steps } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Recipe name is required' });
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: 'Recipe must have at least one step' });
  }

  for (const step of steps) {
    if (!step.ingredient || typeof step.ingredient !== 'string' || step.ingredient.trim().length === 0) {
      return res.status(400).json({ error: 'Each step must have an ingredient name' });
    }
    
    if (!step.targetWeight || typeof step.targetWeight !== 'number' || step.targetWeight <= 0) {
      return res.status(400).json({ error: 'Each step must have a valid target weight' });
    }
  }

  next();
};

// Recipe API endpoints
app.get('/api/recipes', (req, res) => {
  try {
    const recipes = stmts.getAllRecipes.all().map(recipe => ({
      ...recipe,
      steps: JSON.parse(recipe.steps || '[]').filter(Boolean).map(step => ({
        ...step,
        completed: false
      }))
    }));
    res.json(recipes);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = stmts.getRecipeById.get(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    recipe.steps = JSON.parse(recipe.steps || '[]').filter(Boolean).map(step => ({
      ...step,
      completed: false
    }));
    
    res.json(recipe);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

app.post('/api/recipes', validateRecipe, (req, res) => {
  try {
    const recipe = saveRecipe(req.body);
    recipe.steps = JSON.parse(recipe.steps || '[]').filter(Boolean);
    res.json(recipe);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

app.delete('/api/recipes/:id', (req, res) => {
  try {
    stmts.deleteRecipe.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

app.get('/api/tare', (req, res) => {
  port.write('TARE\r\n', (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to tare scale' });
    } else {
      res.json({ message: 'Scale tared successfully' });
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});