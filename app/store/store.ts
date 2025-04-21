import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'
import { chatMiddleware } from './chatMiddleware'

// Using type assertion to avoid circular reference
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['chat/setStream'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.stream'],
        // Ignore these paths in the state
        ignoredPaths: ['chat.stream'],
      },
    }).concat(chatMiddleware),
}) as EnhancedStore

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
