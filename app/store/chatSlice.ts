import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StreamInOut } from '../lib/client'
import { chat } from '../lib/client'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

interface ChatState {
  messages: ChatMessage[]
  isConnected: boolean
  error: string | null
  stream: StreamInOut<chat.InMessage, chat.OutMessage> | null
}

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  error: null,
  stream: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    setStream: (state, action: PayloadAction<StreamInOut<chat.InMessage, chat.OutMessage> | null>) => {
      state.stream = action.payload
    },
    // Action creator for the middleware to handle
    sendToStream: (state, action: PayloadAction<chat.InMessage>) => {
      // The actual sending is handled by the middleware
    },
  },
})

export const { addMessage, setConnectionStatus, setError, clearMessages, setStream, sendToStream } = chatSlice.actions

// Thunk for sending messages
export const sendMessage = (message: string) => async (dispatch: any, getState: any) => {
  const state = getState().chat
  if (!state.stream) {
    dispatch(setError('No active chat connection'))
    return
  }

  const newMessage = {
    id: Date.now().toString(),
    content: message,
    role: 'user' as const,
    timestamp: Date.now(),
  }

  try {
    dispatch(addMessage(newMessage))
    dispatch(sendToStream({ text: message }))
  } catch (error) {
    console.error('Failed to send message:', error)
    dispatch(setError('Failed to send message'))
  }
}

export default chatSlice.reducer
