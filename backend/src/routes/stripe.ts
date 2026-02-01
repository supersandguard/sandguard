import { Router, Request, Response } from 'express'

const router = Router()

// Stripe keys - set via environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '' // Monthly $20 subscription price
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://supersandguard.com'

// POST /api/stripe/create-checkout - Create Stripe checkout session
router.post('/create-checkout', async (req: Request, res: Response) => {
  if (!STRIPE_SECRET_KEY) {
    return res.status(503).json({ 
      error: 'Stripe not configured yet',
      message: 'Credit card payments coming soon. Pay with ETH in the meantime.',
      ethPaymentUrl: '/api/payments/info'
    })
  }

  try {
    const { email } = req.body

    // Create Stripe Checkout Session via API
    const params = new URLSearchParams({
      'mode': 'subscription',
      'success_url': `${FRONTEND_URL}/app?payment=success`,
      'cancel_url': `${FRONTEND_URL}/login?payment=cancelled`,
      ...(STRIPE_PRICE_ID ? { 'line_items[0][price]': STRIPE_PRICE_ID, 'line_items[0][quantity]': '1' } : {}),
      ...(email ? { 'customer_email': email } : {}),
    })

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    const session = await response.json()
    
    if (session.error) {
      return res.status(400).json({ error: session.error.message })
    }

    return res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// POST /api/stripe/webhook - Handle Stripe webhooks
router.post('/webhook', async (req: Request, res: Response) => {
  // TODO: Verify webhook signature
  // TODO: Handle subscription.created, payment_succeeded, etc.
  // TODO: Issue API key on successful payment
  
  const event = req.body

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Checkout completed:', event.data.object.customer_email)
      // TODO: Activate subscription, issue API key
      break
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled:', event.data.object.id)
      // TODO: Deactivate subscription
      break
    default:
      console.log('Unhandled event:', event.type)
  }

  res.json({ received: true })
})

// GET /api/stripe/status - Check if Stripe is configured
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    configured: !!STRIPE_SECRET_KEY,
    priceId: STRIPE_PRICE_ID ? 'set' : 'not set',
    monthlyPriceUsd: 20
  })
})

export default router
