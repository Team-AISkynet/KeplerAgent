import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
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
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
