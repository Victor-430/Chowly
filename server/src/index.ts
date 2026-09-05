import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'chowly-server', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Chowly server running on http://localhost:${PORT}`);
});

