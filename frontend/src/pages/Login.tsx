import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Scaffolding only — no actual auth logic yet
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual auth (magic link, wallet connect, etc.)
    // For now, just redirect to the app
    navigate('/app')
  }

  const handleWalletConnect = () => {
    // TODO: Implement WalletConnect / Safe app auth
    navigate('/app')
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
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-slate-400">
              {mode === 'login'
                ? 'Sign in to your SandGuard dashboard'
                : 'Start protecting your multisig — $20/month'}
            </p>
          </div>

          {/* Wallet Connect */}
          <button
            onClick={handleWalletConnect}
            className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-3 font-medium text-sm"
          >
            <span className="text-lg">◆</span>
            Connect with Ethereum
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 uppercase">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {mode === 'login' ? 'Sign In' : 'Sign Up — $20/mo'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-500">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-emerald-400 hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-emerald-400 hover:underline">
                  Log in
                </button>
              </>
            )}
          </p>

          {/* Demo link */}
          <div className="text-center">
            <Link to="/app" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Skip — try the demo →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
