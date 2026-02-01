import { Router, Request, Response } from 'express'

const router = Router()

const PAYMENT_WALLET = '0xCc75959A8Fa6ed76F64172925c0799ad94ab0B84'
const MONTHLY_PRICE_USD = 20
const API_KEY_PREFIX = 'sg_'

// In-memory store (replace with SQLite later)
interface Subscription {
  address: string
  apiKey: string
  paidTxHash: string
  paidAt: number
  expiresAt: number
  plan: string
}

const subscriptions: Map<string, Subscription> = new Map()

// Generate API key
function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = API_KEY_PREFIX
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

// GET /api/payments/info - Public payment info
router.get('/info', (_req: Request, res: Response) => {
  res.json({
    wallet: PAYMENT_WALLET,
    chain: 'base',
    chainId: 8453,
    monthlyPriceUsd: MONTHLY_PRICE_USD,
    acceptedTokens: ['ETH'],
    instructions: `Send $${MONTHLY_PRICE_USD} worth of ETH to ${PAYMENT_WALLET} on Base chain. Then call POST /api/payments/verify with your tx hash to activate your subscription.`
  })
})

// POST /api/payments/verify - Verify payment and issue API key
router.post('/verify', async (req: Request, res: Response) => {
  const { txHash, address } = req.body
  
  if (!txHash || !address) {
    return res.status(400).json({ error: 'txHash and address are required' })
  }

  try {
    // Check if already verified
    const existing = subscriptions.get(address.toLowerCase())
    if (existing && existing.expiresAt > Date.now()) {
      return res.json({
        status: 'active',
        apiKey: existing.apiKey,
        expiresAt: new Date(existing.expiresAt).toISOString(),
        message: 'Subscription already active'
      })
    }

    // Verify tx on Base using Basescan API
    const basescanUrl = `https://api.basescan.org/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`
    const response = await fetch(basescanUrl)
    const data = await response.json()
    
    if (!data.result) {
      return res.status(400).json({ error: 'Transaction not found on Base chain' })
    }

    const tx = data.result
    const toAddress = tx.to?.toLowerCase()
    const fromAddress = tx.from?.toLowerCase()
    
    // Verify recipient is our wallet
    if (toAddress !== PAYMENT_WALLET.toLowerCase()) {
      return res.status(400).json({ error: 'Transaction recipient does not match payment wallet' })
    }

    // Verify sender matches claimed address
    if (fromAddress !== address.toLowerCase()) {
      return res.status(400).json({ error: 'Transaction sender does not match provided address' })
    }

    // Verify amount (at least ~$15 worth of ETH at conservative pricing)
    const valueWei = BigInt(tx.value)
    const minWei = BigInt('3000000000000000') // ~0.003 ETH (~$8 at $2700/ETH, generous minimum)
    
    if (valueWei < minWei) {
      return res.status(400).json({ error: 'Payment amount too low. Minimum ~$20 in ETH required.' })
    }

    // Issue API key
    const apiKey = generateApiKey()
    const now = Date.now()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    
    const sub: Subscription = {
      address: address.toLowerCase(),
      apiKey,
      paidTxHash: txHash,
      paidAt: now,
      expiresAt: now + thirtyDays,
      plan: 'pro'
    }
    
    subscriptions.set(address.toLowerCase(), sub)

    return res.json({
      status: 'activated',
      apiKey,
      expiresAt: new Date(sub.expiresAt).toISOString(),
      plan: 'pro',
      message: 'Subscription activated! Use your API key in the Authorization header.'
    })

  } catch (err) {
    console.error('Payment verification error:', err)
    return res.status(500).json({ error: 'Failed to verify payment' })
  }
})

// GET /api/payments/status/:address - Check subscription status
router.get('/status/:address', (req: Request, res: Response) => {
  const address = req.params.address.toLowerCase()
  const sub = subscriptions.get(address)
  
  if (!sub) {
    return res.json({ status: 'inactive', message: 'No active subscription' })
  }
  
  if (sub.expiresAt < Date.now()) {
    return res.json({ status: 'expired', expiresAt: new Date(sub.expiresAt).toISOString() })
  }
  
  return res.json({
    status: 'active',
    plan: sub.plan,
    expiresAt: new Date(sub.expiresAt).toISOString(),
    apiKey: sub.apiKey.slice(0, 8) + '...'
  })
})

// Middleware: validate API key
export function requireApiKey(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer sg_')) {
    return res.status(401).json({ error: 'Valid API key required. Get one at supersandguard.com' })
  }
  
  const apiKey = authHeader.replace('Bearer ', '')
  const sub = Array.from(subscriptions.values()).find(s => s.apiKey === apiKey)
  
  if (!sub) {
    return res.status(401).json({ error: 'Invalid API key' })
  }
  
  if (sub.expiresAt < Date.now()) {
    return res.status(403).json({ error: 'Subscription expired. Please renew.' })
  }
  
  // Attach subscription to request
  ;(req as any).subscription = sub
  next()
}

export default router
