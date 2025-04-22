import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import chartReducer from './chartSlice'
import chatReducer from './chatSlice'
import { chatMiddleware } from './chatMiddleware'

// Using type assertion to avoid circular reference
export const store = configureStore({
  reducer: {
    charts: chartReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/setStream'],
        ignoredActionPaths: ['payload.stream'],
        ignoredPaths: ['chat.stream'],
      },
    }).concat(chatMiddleware),
}) as EnhancedStore

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
