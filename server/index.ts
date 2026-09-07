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
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;

// Build allowed origins list based on environment and FRONTEND_URL env var
const defaultDevOrigins = [
  'http://localhost:5173'
];

const defaultProdOrigins = [
  'https://chowly-restaurant.vercel.app',
];

const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = new Set([
  ...defaultDevOrigins,
  ...defaultProdOrigins,
  ...envOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/+$/, '');

      // Direct match against allowed origins set
      if (allowedOrigins.has(cleanOrigin)) {
        return callback(null, true);
      }

      // In development, allow any localhost or 127.0.0.1 port
      if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow Vercel preview or production deployments for Chowly
      if (
        /^https:\/\/chowly[a-z0-9-]*\.vercel\.app$/.test(cleanOrigin) ||
        /^https:\/\/chowly-restaurant[a-z0-9-]*\.vercel\.app$/.test(cleanOrigin)
      ) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  })
);

app.use(express.json());

// Helper to construct Swagger document with current server host
const getSwaggerDocument = (req: express.Request) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const currentUrl = `${protocol}://${host}`;
  return {
    ...swaggerDocument,
    servers: [
      { url: currentUrl, description: 'Current Server' },
      { url: 'http://localhost:5000', description: 'Local Development Server' },
      { url: 'https://chowly.up.railway.app', description: 'Railway Production Server' },
    ],
  };
};

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  swaggerUi.setup(getSwaggerDocument(req))(req, res, next);
});
app.get('/api/docs.json', (req, res) => {
  res.json(getSwaggerDocument(req));
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
    console.log(`Chowly server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Allowed CORS origins: ${Array.from(allowedOrigins).join(', ')}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
  });
}
