import { ReactNode } from 'react'

interface DaimoProviderProps {
  children: ReactNode
}

// Stub implementation until Daimo dependencies are installed
export function DaimoProvider({ children }: DaimoProviderProps) {
  // TODO: Install @daimo/pay, wagmi, viem, @tanstack/react-query
  // For now, just wrap children without providers
  return <>{children}</>
}