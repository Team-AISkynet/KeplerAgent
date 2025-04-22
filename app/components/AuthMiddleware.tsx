import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router'

interface AuthMiddlewareProps {
  children: React.ReactNode
}

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <Navigate to='/' />
  }

  return <>{children}</>
}
