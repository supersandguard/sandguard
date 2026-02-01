import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PAYMENT_ADDRESS = '0xCc75959A8Fa6ed76F64172925c0799ad94ab0B84'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'connect' | 'pay' | 'verify'>('connect')
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)

  const handleWalletConnect = () => {
    // TODO: Implement actual WalletConnect
    setStep('pay')
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

          {/* Step 1: Connect */}
          {step === 'connect' && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Get Started</h1>
                <p className="text-sm text-slate-400">
                  Connect your wallet to activate SandGuard
                </p>
              </div>

              <button
                onClick={handleWalletConnect}
                className="w-full py-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-colors flex items-center justify-center gap-3 font-medium text-sm"
              >
                <span className="text-lg">◆</span>
                Connect with Ethereum
              </button>

              {/* Pricing preview */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Plan</span>
                  <span className="text-sm font-medium">Pro</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Price</span>
                  <span className="text-sm font-medium text-emerald-400">$20/month in ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Network</span>
                  <span className="text-sm font-medium">Base</span>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <p className="text-xs text-slate-500">
                    Unlimited transactions • All chains • API access • Web dashboard
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Pay */}
          {step === 'pay' && (
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
                    className="font-mono text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-2.5 break-all cursor-pointer hover:bg-slate-750 transition-colors flex items-center justify-between gap-2"
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
                    <p className="text-sm font-medium">Base (Chain ID 8453)</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('verify')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                I've sent the payment →
              </button>

              <button
                onClick={() => setStep('connect')}
                className="w-full text-center text-xs text-slate-600 hover:text-slate-400"
              >
                ← Go back
              </button>
            </>
          )}

          {/* Step 3: Verify */}
          {step === 'verify' && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Verify Payment</h1>
                <p className="text-sm text-slate-400">
                  Paste your transaction hash to activate your account
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
                  Verify & Activate
                </button>
              </form>

              <button
                onClick={() => setStep('pay')}
                className="w-full text-center text-xs text-slate-600 hover:text-slate-400"
              >
                ← Go back
              </button>
            </>
          )}

          {/* Demo link */}
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
