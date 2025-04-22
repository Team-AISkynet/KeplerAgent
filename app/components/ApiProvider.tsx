'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Client, { Environment } from '@/app/lib/client'

// Create a context for the API client
const ApiContext = createContext<Client | null>(null)

// Custom hook to use the API client
export function useApi(): Client | null {
  const client = useContext(ApiContext)
  if (!client) {
    console.warn('API client not initialized yet')
    return null
  }
  return client
}

interface ApiProviderProps {
  children: ReactNode
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { getToken } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const initializeClient = async () => {
      try {
        setError(null)
        // Get the token from Clerk
        const token = await getToken()

        if (!isMounted) return

        // Determine the environment
        const env = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:4000' : Environment('staging')

        // Create a new client with the token
        const newClient = new Client(env, {
          auth: { authorization: token || '' },
        })

        setClient(newClient)
      } catch (error) {
        console.error('Failed to initialize API client:', error)
        if (isMounted) {
          setError('Failed to initialize API client. Please try refreshing the page.')
          setClient(null)
        }
      }
    }

    initializeClient()

    return () => {
      isMounted = false
    }
  }, [getToken]) // Add getToken as a dependency

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg'>{error}</div>
      </div>
    )
  }

  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>
}
