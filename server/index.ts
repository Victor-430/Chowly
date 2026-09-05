import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerDocument);
});

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'chowly-server', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Static client serving (if built client exists)
const clientDistPath = path.resolve(process.cwd(), '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

const isDirectRun = !process.argv[1]?.includes('generate-postman');
if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Chowly server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
  });
}
