import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { StreamInOut } from '../lib/client'
import { chat } from '../lib/client'
import { AppDispatch, RootState } from './store'

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
  pendingMessage: ChatMessage | null
}

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  error: null,
  stream: null,
  pendingMessage: null,
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
    setPendingMessage: (state, action: PayloadAction<ChatMessage | null>) => {
      state.pendingMessage = action.payload
    },
    // Action creator for the middleware to handle
    sendToStream: (state, action: PayloadAction<chat.InMessage>) => {
      // The actual sending is handled by the middleware
    },
  },
})

export const { addMessage, setConnectionStatus, setError, clearMessages, setStream, sendToStream, setPendingMessage } =
  chatSlice.actions

// Thunk for sending messages
export const sendMessage = createAsyncThunk('chat/sendMessage', async (message: string, { dispatch, getState }) => {
  const state = (getState() as RootState).chat
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

  const pendingMessage = {
    id: 'pending-' + Date.now().toString(),
    content: '',
    role: 'assistant' as const,
    timestamp: Date.now(),
  }

  try {
    dispatch(addMessage(newMessage))
    dispatch(setPendingMessage(pendingMessage))
    dispatch(sendToStream({ text: message }))
  } catch (error) {
    console.error('Failed to send message:', error)
    dispatch(setError('Failed to send message'))
    dispatch(setPendingMessage(null))
  }
})

export default chatSlice.reducer
