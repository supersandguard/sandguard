import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Zap, Shield, Bell, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

const features: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Search size={24} className="text-emerald-400" />,
    title: 'Decode',
    desc: 'Automatically decode calldata into human-readable function calls. Identifies known protocols like Aave, Uniswap, and Morpho.',
  },
  {
    icon: <Zap size={24} className="text-cyan-400" />,
    title: 'Simulate',
    desc: 'Fork the chain and simulate every transaction before signing. See exact balance changes, gas costs, and state diffs.',
  },
  {
    icon: <Shield size={24} className="text-emerald-400" />,
    title: 'Risk Score',
    desc: 'AI-powered risk analysis flags unlimited approvals, unverified contracts, and suspicious patterns before you sign.',
  },
  {
    icon: <Bell size={24} className="text-cyan-400" />,
    title: 'Push Alerts',
    desc: 'Get notified instantly when new transactions hit your queue. Never miss a pending signature via Clawdbot.',
  },
]

const steps = [
  { num: '1', text: 'Connect your Safe multisig wallet' },
  { num: '2', text: 'Pending transactions are automatically analyzed' },
  { num: '3', text: 'Review decoded calldata, simulation results, and risk scores' },
  { num: '4', text: 'Sign with confidence — or reject with evidence' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { setDemoMode } = useAuth()

  useEffect(() => { document.title = 'SandGuard — Transaction Firewall for Safe Multisig' }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SandGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Open Beta
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Transaction Firewall
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            for Safe Multisig
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Don't trust, verify — without reading Solidity. SandGuard decodes, simulates, and scores every
          transaction before you sign. Know exactly what you're approving.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Start Free — No Payment Required
          </Link>
          <button
            onClick={() => { setDemoMode(); navigate('/app') }}
            className="px-8 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-medium text-base border border-slate-700 hover:border-slate-600 transition-colors"
          >
            Try Demo →
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-12">
          What SandGuard does
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/60 hover:border-slate-700/60 transition-colors"
            >
              <span className="mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-12">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {s.num}
              </div>
              <p className="text-sm text-slate-300">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-12">
          Simple pricing
        </h2>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Scout - FREE */}
          <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800/60 flex flex-col">
            <p className="text-sm text-slate-400 mb-2">Scout</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold">Free</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">No credit card required</p>
            <ul className="text-sm text-slate-400 space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> 1 Safe monitored
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Transaction decoding
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> 10 API calls/day
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-slate-600" /> <span className="text-slate-600">Simulation</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-slate-600" /> <span className="text-slate-600">Risk scoring</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-slate-600" /> <span className="text-slate-600">Alerts</span>
              </li>
            </ul>
            <Link
              to="/login"
              className="block w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-center border border-slate-700 hover:border-emerald-500/50 transition-colors"
            >
              Start Free →
            </Link>
          </div>

          {/* Pro - $20/mo */}
          <div className="bg-slate-900/50 rounded-2xl p-8 border-2 border-emerald-500/40 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <p className="text-sm text-slate-400 mb-2">Pro</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold">$20</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">Pay with any crypto</p>
            <ul className="text-sm text-slate-400 space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> 5 Safes monitored
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Transaction decoding
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Simulation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> AI risk scoring
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> 1,000 API calls/day
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Push alerts via Clawdbot
              </li>
            </ul>
            <Link
              to="/login"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-center hover:opacity-90 transition-opacity"
            >
              Go Pro →
            </Link>
            <p className="text-xs text-slate-600 mt-3 text-center">Pay with any crypto • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Stop signing blind
        </h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
          Every transaction decoded, simulated, and scored before your signature touches it.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield size={16} className="text-slate-500" />
            <span>SandGuard</span>
            <span>·</span>
            <span>supersandguard.com</span>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} SandGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
