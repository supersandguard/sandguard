import { useState, useEffect } from 'react'

interface SafeAppContext {
  /** True when the app is running inside an iframe (likely Safe App Store) */
  isInsideIframe: boolean
  /** The parent origin, if available (e.g., "https://app.safe.global") */
  parentOrigin: string | null
  /** Whether we think this is a Safe App context specifically */
  isSafeApp: boolean
  /** Safe address detected from URL params or parent context (future: SDK) */
  safeAddress: string | null
  /** Chain ID from URL params (future: SDK) */
  chainId: number | null
}

/**
 * Detect if the app is running inside a Safe App iframe.
 * 
 * For now this is lightweight detection via iframe check + URL params.
 * Full @safe-global/safe-apps-sdk integration comes later.
 * 
 * Safe App Store passes context via URL search params or postMessage.
 * Common params: safe=<address>&chain=<chainId>
 */
export function useSafeApp(): SafeAppContext {
  const [context, setContext] = useState<SafeAppContext>({
    isInsideIframe: false,
    parentOrigin: null,
    isSafeApp: false,
    safeAddress: null,
    chainId: null,
  })

  useEffect(() => {
    // Check if running inside an iframe
    const isInsideIframe = window.self !== window.top

    if (!isInsideIframe) {
      setContext({
        isInsideIframe: false,
        parentOrigin: null,
        isSafeApp: false,
        safeAddress: null,
        chainId: null,
      })
      return
    }

    // Try to detect parent origin (may be blocked by CORS)
    let parentOrigin: string | null = null
    try {
      parentOrigin = document.referrer ? new URL(document.referrer).origin : null
    } catch {
      // referrer parsing failed — that's fine
    }

    // Check if parent looks like Safe App Store
    const isSafeApp = parentOrigin?.includes('safe.global') ?? false

    // Parse URL params that Safe App Store may inject
    const params = new URLSearchParams(window.location.search)
    const safeParam = params.get('safe')
    const chainParam = params.get('chain') || params.get('chainId')

    // Extract address from safe param (format: <chainPrefix>:<address> or just <address>)
    let safeAddress: string | null = null
    if (safeParam) {
      const parts = safeParam.split(':')
      safeAddress = parts.length > 1 ? parts[parts.length - 1] : safeParam
      // Validate it looks like an Ethereum address
      if (!/^0x[a-fA-F0-9]{40}$/.test(safeAddress)) {
        safeAddress = null
      }
    }

    const chainId = chainParam ? parseInt(chainParam, 10) : null

    setContext({
      isInsideIframe,
      parentOrigin,
      isSafeApp,
      safeAddress,
      chainId: chainId && !isNaN(chainId) ? chainId : null,
    })
  }, [])

  return context
}
