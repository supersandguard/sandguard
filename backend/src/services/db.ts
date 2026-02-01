import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DB file lives alongside the backend
const DB_DIR = process.env.SANDGUARD_DATA_DIR || path.join(__dirname, '..', '..', 'data')
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })

const DB_PATH = path.join(DB_DIR, 'sandguard.db')
const db = new Database(DB_PATH)

// WAL mode for better concurrent reads
db.pragma('journal_mode = WAL')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL UNIQUE,
    email TEXT,
    api_key TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'pro',
    paid_tx_hash TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    paid_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
  );

  CREATE INDEX IF NOT EXISTS idx_subs_api_key ON subscriptions(api_key);
  CREATE INDEX IF NOT EXISTS idx_subs_email ON subscriptions(email);
  CREATE INDEX IF NOT EXISTS idx_subs_stripe_customer ON subscriptions(stripe_customer_id);

  CREATE TABLE IF NOT EXISTS api_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    response_ms INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_usage_key_ts ON api_usage(api_key, timestamp);
`)

// Prepared statements
const stmts = {
  upsertSub: db.prepare(`
    INSERT INTO subscriptions (address, email, api_key, plan, paid_tx_hash, stripe_customer_id, stripe_subscription_id, paid_at, expires_at, updated_at)
    VALUES (@address, @email, @apiKey, @plan, @paidTxHash, @stripeCustomerId, @stripeSubscriptionId, @paidAt, @expiresAt, @updatedAt)
    ON CONFLICT(address) DO UPDATE SET
      api_key = @apiKey,
      plan = @plan,
      paid_tx_hash = COALESCE(@paidTxHash, paid_tx_hash),
      stripe_customer_id = COALESCE(@stripeCustomerId, stripe_customer_id),
      stripe_subscription_id = COALESCE(@stripeSubscriptionId, stripe_subscription_id),
      paid_at = @paidAt,
      expires_at = @expiresAt,
      updated_at = @updatedAt
  `),

  getByAddress: db.prepare('SELECT * FROM subscriptions WHERE address = ?'),
  getByApiKey: db.prepare('SELECT * FROM subscriptions WHERE api_key = ?'),
  getByEmail: db.prepare('SELECT * FROM subscriptions WHERE email = ?'),
  getByStripeCustomer: db.prepare('SELECT * FROM subscriptions WHERE stripe_customer_id = ?'),
  getByStripeSubscription: db.prepare('SELECT * FROM subscriptions WHERE stripe_subscription_id = ?'),

  deactivate: db.prepare('UPDATE subscriptions SET expires_at = ?, updated_at = ? WHERE stripe_subscription_id = ?'),

  logUsage: db.prepare('INSERT INTO api_usage (api_key, endpoint, timestamp, response_ms) VALUES (?, ?, ?, ?)'),
  
  getUsage: db.prepare('SELECT COUNT(*) as count FROM api_usage WHERE api_key = ? AND timestamp > ?'),

  getAllActive: db.prepare('SELECT * FROM subscriptions WHERE expires_at > ?'),
}

// Helper functions
const API_KEY_PREFIX = 'sg_'
function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = API_KEY_PREFIX
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

export interface Subscription {
  id: number
  address: string
  email: string | null
  api_key: string
  plan: string
  paid_tx_hash: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  paid_at: number
  expires_at: number
  created_at: number
  updated_at: number
}

export function activateSubscription(opts: {
  address: string
  email?: string
  paidTxHash?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  plan?: string
  durationMs?: number
}): { apiKey: string; expiresAt: number } {
  const now = Date.now()
  const thirtyDays = opts.durationMs || 30 * 24 * 60 * 60 * 1000
  const expiresAt = now + thirtyDays
  
  // Check existing — reuse API key if active
  const existing = stmts.getByAddress.get(opts.address.toLowerCase()) as Subscription | undefined
  const apiKey = existing?.api_key || generateApiKey()

  stmts.upsertSub.run({
    address: opts.address.toLowerCase(),
    email: opts.email || null,
    apiKey,
    plan: opts.plan || 'pro',
    paidTxHash: opts.paidTxHash || null,
    stripeCustomerId: opts.stripeCustomerId || null,
    stripeSubscriptionId: opts.stripeSubscriptionId || null,
    paidAt: now,
    expiresAt,
    updatedAt: now,
  })

  return { apiKey, expiresAt }
}

export function getSubscriptionByAddress(address: string): Subscription | undefined {
  return stmts.getByAddress.get(address.toLowerCase()) as Subscription | undefined
}

export function getSubscriptionByApiKey(apiKey: string): Subscription | undefined {
  return stmts.getByApiKey.get(apiKey) as Subscription | undefined
}

export function getSubscriptionByEmail(email: string): Subscription | undefined {
  return stmts.getByEmail.get(email.toLowerCase()) as Subscription | undefined
}

export function getSubscriptionByStripeCustomer(customerId: string): Subscription | undefined {
  return stmts.getByStripeCustomer.get(customerId) as Subscription | undefined
}

export function deactivateByStripeSubscription(subscriptionId: string): void {
  const now = Date.now()
  stmts.deactivate.run(now, now, subscriptionId)
}

export function logApiUsage(apiKey: string, endpoint: string, responseMs?: number): void {
  stmts.logUsage.run(apiKey, endpoint, Date.now(), responseMs || null)
}

export function getApiUsageCount(apiKey: string, sinceMs: number): number {
  const result = stmts.getUsage.get(apiKey, sinceMs) as { count: number }
  return result.count
}

export function getAllActiveSubscriptions(): Subscription[] {
  return stmts.getAllActive.all(Date.now()) as Subscription[]
}

export default db
