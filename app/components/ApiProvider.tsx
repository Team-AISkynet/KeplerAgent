'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Client, { Environment } from '@/app/lib/client'

// Create a context for the API client
const ApiContext = createContext<Client | null>(null)

// Custom hook to use the API client
export function useApi(): Client | null {
  const client = useContext(ApiContext)
  // if (!client) {
  //   throw new Error('useApi must be used within an ApiProvider')
  // }
  return client
}

interface ApiProviderProps {
  children: ReactNode
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { getToken } = useAuth()
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Get the token from Clerk
        const token = await getToken()

        // Determine the environment
        const env = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:4000' : Environment('staging')

        // Create a new client with the token
        const newClient = new Client(env, {
          auth: { authorization: token || '' },
        })

        setClient(newClient)
      } catch (error) {
        console.error('Failed to initialize API client:', error)
      }
    }

    initializeClient()
  }, [])

  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>
}
