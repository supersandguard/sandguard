import express from 'express';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import safeRouter from './routes/safe';
import simulateRouter from './routes/simulate';
import decodeRouter from './routes/decode';
import explainRouter from './routes/explain';
import riskRouter from './routes/risk';
import pollRouter from './routes/poll';
import paymentsRouter from './routes/payments';
import stripeRouter from './routes/stripe';
import promoRouter from './routes/promo';
import daimoWebhookRouter from './routes/daimo-webhook';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(compression());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Rate limiting (apply only to API routes)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(cors({
  origin: [
    'https://supersandguard.com',
    'https://www.supersandguard.com',
    'https://sandguard.netlify.app',
    'https://web-production-9722f.up.railway.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// Apply rate limiting only to API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/safe', safeRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/decode', decodeRouter);
app.use('/api/explain', explainRouter);
app.use('/api/risk', riskRouter);
app.use('/api/poll', pollRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/promo', promoRouter);
app.use('/api/webhooks', daimoWebhookRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SandGuard API' });
});

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// --- Serve Frontend Static Files ---
// Resolve the frontend dist directory (located at backend/frontend-dist)
// When running via tsx from backend/src/index.ts, __dirname = backend/src/
// frontend-dist is at backend/frontend-dist (copied there during build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '..', 'frontend-dist');

if (fs.existsSync(frontendDistPath)) {
  console.log(`📦 Serving frontend from: ${frontendDistPath}`);
  // Serve static assets
  app.use(express.static(frontendDistPath, { maxAge: '1d' }));

  // SPA fallback: serve index.html for any non-API route
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log(`⚠️  Frontend dist not found at ${frontendDistPath} - serving API only`);
}

// Export for serverless (Netlify Functions)
export default app;

// Start server only when run directly (not imported)
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('/index.ts') ||
  process.argv[1].endsWith('/index.js') ||
  process.argv[1].endsWith('/server.cjs')
);

if (isDirectRun) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🛡️  SandGuard API running on http://localhost:${PORT}`);
  });
}
