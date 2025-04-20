import type { LinksFunction } from '@react-router/node'

export namespace Route {
  export type LinksFunction = LinksFunction
  export interface ErrorBoundaryProps {
    error: unknown
  }
}
