import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, NavLink } from 'react-router'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { cn } from '@/app/lib/utils'
import { Provider } from 'react-redux'
import { store } from './store/store'

import './app.css'
import ThemeSwitcher from '@/app/components/ThemeSwitcher'
import { ApiProvider } from '@/app/components/ApiProvider'

// Get the publishable key from environment variable
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <ApiProvider>
          <html lang='en'>
            <head>
              <meta charSet='utf-8' />
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <Meta />
              <Links />
            </head>
            <body className='bg-background text-foreground min-h-screen'>
              <nav className='w-full border-b border-border/30 bg-black/40 backdrop-blur-[5px] supports-[backdrop-filter]:bg-black/5 sticky top-0 z-50'>
                <div className='container mx-auto flex h-16 items-center justify-between px-4'>
                  <div className='flex items-center gap-4'>
                    <NavLink
                      to='/'
                      className={({ isActive }) =>
                        cn(
                          'font-bold text-xl tracking-tight',
                          isActive && 'dark:text-white text-black border-b-2 border-primary'
                        )
                      }
                    >
                      KeepItReal
                    </NavLink>
                    <SignedIn>
                      <NavLink
                        to='/chat'
                        className={({ isActive }) =>
                          cn(
                            'text-foreground/80 hover:text-foreground',
                            isActive && 'dark:text-white text-black border-b-2 border-primary'
                          )
                        }
                      >
                        Chat Charts
                      </NavLink>
                      <NavLink
                        to='/chatmap'
                        className={({ isActive }) =>
                          cn(
                            'text-foreground/80 hover:text-foreground',
                            isActive && 'dark:text-white text-black border-b-2 border-primary'
                          )
                        }
                      >
                        Chat Map
                      </NavLink>
                    </SignedIn>
                  </div>
                  <div className='flex items-center gap-4'>
                    <ThemeSwitcher />
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode='modal'>
                        <button className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90'>
                          Sign In
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                </div>
              </nav>
              {children}
              <ScrollRestoration />
              <Scripts />
            </body>
          </html>
        </ApiProvider>
      </Provider>
    </ClerkProvider>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
