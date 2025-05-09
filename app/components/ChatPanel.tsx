import React, { useEffect, useRef } from 'react'
import { ChatBubble, ChatBubbleMessage } from '../components/ui/chat/chat-bubble'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addMessage,
  setConnectionStatus,
  setError,
  setStream,
  setPendingMessage,
  sendMessage,
} from '../store/chatSlice'
import { useApi } from './ApiProvider'
import { Bot, User, Loader2 } from 'lucide-react'
import { addChart } from '../store/chartSlice'
import { v4 as uuidv4 } from 'uuid'

// Define the ChatMessage type
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

export function ChatPanel() {
  const dispatch = useAppDispatch()
  const { messages, isConnected, error, pendingMessage } = useAppSelector((state) => state.chat)
  const [inputMessage, setInputMessage] = React.useState('')
  const [isInitializing, setIsInitializing] = React.useState(true)
  const api = useApi()
  const streamRef = useRef<any>(null)

  useEffect(() => {
    if (!api) return

    let isSubscribed = true
    setIsInitializing(true)

    const startChat = async () => {
      try {
        const chatStream = await api.chat.ChatAPIStream()

        if (!isSubscribed) {
          chatStream.socket.close()
          return
        }

        streamRef.current = chatStream
        dispatch(setStream(chatStream))
        dispatch(setConnectionStatus(true))
        setIsInitializing(false)

        chatStream.socket.on('error', (event) => {
          console.error('ChatStream error', event)
          if (isSubscribed) {
            dispatch(setError('Chat connection error occurred'))
            dispatch(setConnectionStatus(false))
            dispatch(setStream(null))
            dispatch(setPendingMessage(null))
          }
        })

        chatStream.socket.on('close', (event) => {
          console.error('ChatStream close', event)
          if (isSubscribed) {
            dispatch(setConnectionStatus(false))
            dispatch(setStream(null))
            dispatch(setPendingMessage(null))
          }
        })

        while (isSubscribed) {
          const msg = await chatStream.next()
          if (!msg) break

          if (isSubscribed) {
            // if the message is a visualization, add it to the state
            if (msg.visualization && msg.visualization.type === 'tool_call') {
              const v = msg.visualization!
              dispatch(
                addChart({
                  id: uuidv4(),
                  type: v.args.chart_type as 'line' | 'bar',
                  labels: v.args.labels,
                  data: v.args.data,
                  title: v.args.title,
                  answer: msg.text,
                })
              )
            }

            // Clear pending message and add the actual response
            dispatch(setPendingMessage(null))
            dispatch(
              addMessage({
                id: Date.now().toString(),
                content: msg.text,
                role: 'assistant',
                timestamp: Date.now(),
              })
            )
          }
        }
      } catch (error) {
        console.error('Failed to start chat:', error)
        if (isSubscribed) {
          dispatch(setError('Failed to establish chat connection'))
          dispatch(setStream(null))
          dispatch(setPendingMessage(null))
          setIsInitializing(false)
        }
      }
    }

    startChat()

    return () => {
      isSubscribed = false
      if (streamRef.current?.socket) {
        streamRef.current.socket.close()
        streamRef.current = null
      }
      dispatch(setConnectionStatus(false))
      dispatch(setStream(null))
      dispatch(setPendingMessage(null))
    }
  }, [api, dispatch])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !api || !isConnected) return

    void dispatch(sendMessage(inputMessage))
    setInputMessage('')
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isInitializing) {
    return (
      <div className='flex flex-col h-full items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
        <p className='mt-2 text-sm text-foreground/70'>Connecting to chat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col h-full items-center justify-center'>
        <div className='p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg text-sm'>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full relative'>
      <div className='flex-1 overflow-y-auto p-3 space-y-3'>
        {messages.length === 0 && (
          <div className='flex items-center justify-center h-full'>
            <p className='text-foreground/50 text-sm'>Start with a question about your properties...</p>
          </div>
        )}
        {messages.map((message: ChatMessage) => (
          <ChatBubble
            key={message.id}
            variant={message.role === 'user' ? 'sent' : 'received'}
            className='max-w-[95%] text-sm'
          >
            <div className='flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400/10'>
              {message.role === 'user' ? (
                <User className='w-4 h-4 text-primary' />
              ) : (
                <Bot className='w-4 h-4 text-primary' />
              )}
            </div>
            <ChatBubbleMessage className='py-2 px-3 flex-1'>{message.content}</ChatBubbleMessage>
          </ChatBubble>
        ))}
        {pendingMessage && (
          <ChatBubble key={pendingMessage.id} variant='received' className='max-w-[95%] text-sm'>
            <div className='flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400/10'>
              <Bot className='w-4 h-4 text-primary' />
            </div>
            <ChatBubbleMessage isLoading className='py-2 px-3 flex-1' />
          </ChatBubble>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className='sticky bottom-0 left-0 right-0 p-4 bg-black/10 dark:bg-black/10 backdrop-blur-sm'
      >
        <div className='flex'>
          <div className='flex w-full rounded-lg overflow-hidden border border-gray-200 dark:border-yellow-500/20'>
            <input
              type='text'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isConnected ? 'Type your message...' : 'Connecting...'}
              disabled={!isConnected}
              className='flex-1 px-4 py-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-sm disabled:opacity-50'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <button
              type='submit'
              disabled={!isConnected}
              className='px-8 py-3 bg-primary/80 text-black font-medium hover:bg-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
