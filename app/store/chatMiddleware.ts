import { Middleware, Action } from '@reduxjs/toolkit'
import { chat } from '../lib/client'
import { RootState } from './store'

interface SendToStreamAction {
  type: 'chat/sendToStream'
  payload: chat.InMessage
}

// Type guard function
function isSendToStreamAction(action: unknown): action is SendToStreamAction {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    (action as Action<string>).type === 'chat/sendToStream'
  )
}

export const chatMiddleware: Middleware<{}, RootState> = (store) => (next) => async (action) => {
  const result = next(action)

  if (isSendToStreamAction(action)) {
    const state = store.getState()
    const stream = state.chat.stream

    if (stream) {
      try {
        await stream.send(action.payload)
      } catch (error) {
        store.dispatch({ type: 'chat/setError', payload: 'Failed to send message to stream' })
      }
    }
  }

  return result
}
