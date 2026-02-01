'use client'
import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DaimoPayProvider, getDefaultConfig } from '@daimo/pay'

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'SandGuard',
})

interface DaimoProviderProps {
  children: ReactNode
}

export function DaimoProvider({ children }: DaimoProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DaimoPayProvider appId="pay-demo" mode="dark">
          {children}
        </DaimoPayProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
