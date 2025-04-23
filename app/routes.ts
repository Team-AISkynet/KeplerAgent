import { type RouteConfig, route, index, layout } from '@react-router/dev/routes'

export default [
  // Root layout with all app-wide components (Clerk provider, navigation, etc)
  // Index route for the home page
  index('./routes/home.tsx'),

  // Protected chat routes under auth layout
  layout('./components/AuthMiddleware.tsx', [
    route('chat', './routes/chat.tsx'),
    route('chatmap', './routes/chat-map.tsx'),
    route('properties', './routes/properties.tsx'),
  ]),
] satisfies RouteConfig
