import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PAYMENT_ADDRESS = '0xCc75959A8Fa6ed76F64172925c0799ad94ab0B84'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'choose' | 'eth-pay' | 'eth-verify' | 'card'>('choose')
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')

  const handleWalletConnect = () => {
    setStep('eth-pay')
  }

  const handleStripe = async () => {
    // TODO: Call /api/stripe/create-checkout
    // For now show a coming soon state
    setStep('card')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Call /api/payments/verify
    navigate('/app')
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-lg mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
              🛡
            </div>
            <span className="text-lg font-semibold tracking-tight">SandGuard</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Step: Choose payment method */}
          {step === 'choose' && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Get Started</h1>
                <p className="text-sm text-slate-400">
                  Protect your Safe multisig — $20/month
                </p>
              </div>

              {/* ETH Payment */}
              <button
                onClick={handleWalletConnect}
                className="w-full py-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between px-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">◆</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">Pay with ETH</p>
                    <p className="text-xs text-slate-500">On Base chain</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-medium">$20/mo</span>
              </button>

              {/* Stripe / Card Payment */}
              <button
                onClick={handleStripe}
                className="w-full py-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-between px-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">💳</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">Pay with Card</p>
                    <p className="text-xs text-slate-500">Via Stripe</p>
                  </div>
                </div>
                <span className="text-xs text-blue-400 font-medium">$20/mo</span>
              </button>

              {/* What you get */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">What's included</p>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span> Unlimited transactions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span> All chains (Ethereum, Base, Optimism, Arbitrum)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span> Transaction simulation & decoding
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span> AI risk scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span> API access + Web dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span> Clawdbot integration
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Step: ETH Payment */}
          {step === 'eth-pay' && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Send Payment</h1>
                <p className="text-sm text-slate-400">
                  Send <span className="text-emerald-400 font-medium">$20 in ETH</span> on Base to activate
                </p>
              </div>

              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Send to</p>
                  <div
                    onClick={copyAddress}
                    className="font-mono text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-2.5 break-all cursor-pointer hover:bg-slate-700 transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="select-all">{PAYMENT_ADDRESS}</span>
                    <span className="text-slate-500 text-[10px] shrink-0">
                      {copied ? '✓ Copied' : 'Copy'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Amount</p>
                    <p className="text-sm font-medium">~$20 in ETH</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Network</p>
                    <p className="text-sm font-medium">Base (8453)</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('eth-verify')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                I've sent the payment →
              </button>

              <button onClick={() => setStep('choose')} className="w-full text-center text-xs text-slate-600 hover:text-slate-400">
                ← Back
              </button>
            </>
          )}

          {/* Step: Verify ETH Payment */}
          {step === 'eth-verify' && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Verify Payment</h1>
                <p className="text-sm text-slate-400">
                  Paste your transaction hash to get your API key
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Transaction Hash</label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-300 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Verify & Get API Key
                </button>
              </form>

              <button onClick={() => setStep('eth-pay')} className="w-full text-center text-xs text-slate-600 hover:text-slate-400">
                ← Back
              </button>
            </>
          )}

          {/* Step: Stripe / Card */}
          {step === 'card' && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Pay with Card</h1>
                <p className="text-sm text-slate-400">
                  $20/month via Stripe
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
                <button
                  onClick={() => {
                    // TODO: Create Stripe checkout session and redirect
                    alert('Stripe integration coming soon! Use ETH payment for now.')
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors"
                >
                  Continue to Checkout →
                </button>
              </div>

              <button onClick={() => setStep('choose')} className="w-full text-center text-xs text-slate-600 hover:text-slate-400">
                ← Back
              </button>
            </>
          )}

          {/* Demo link - always visible */}
          <div className="text-center pt-4 border-t border-slate-800/40">
            <Link to="/app" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">
              Skip — try the demo →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
