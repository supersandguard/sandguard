import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use(cors({
  origin: [
    'https://sandguard.netlify.app',
    'https://web-production-9722f.up.railway.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
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
  res.json({ status: 'ok', service: 'SandGuard API', version: '0.3.0' });
});

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
