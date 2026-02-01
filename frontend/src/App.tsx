import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TxQueue from './pages/TxQueue'
import TxDetail from './pages/TxDetail'
import Settings from './pages/Settings'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      {/* Public pages — no app chrome */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* App pages — with Layout (header + bottom nav) */}
      <Route element={<Layout />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/queue" element={<TxQueue />} />
        <Route path="/app/tx/:id" element={<TxDetail />} />
        <Route path="/app/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
