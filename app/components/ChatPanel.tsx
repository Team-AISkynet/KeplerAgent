import React, { useEffect, useRef } from 'react'
import { ChatBubble, ChatBubbleMessage, ChatBubbleAvatar } from '../components/ui/chat/chat-bubble'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addMessage, setConnectionStatus, setError, setStream } from '../store/chatSlice'
import { useApi } from './ApiProvider'
import { Bot, User } from 'lucide-react'

// Define the ChatMessage type
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

export function ChatPanel() {
  const dispatch = useAppDispatch()
  const { messages } = useAppSelector((state) => state.chat)
  const [inputMessage, setInputMessage] = React.useState('')
  const api = useApi()
  // Using any here since we just need to track the instance for cleanup
  const streamRef = useRef<any>(null)

  useEffect(() => {
    if (!api) return

    let isSubscribed = true

    const startChat = async () => {
      try {
        const chatStream = await api.chat.ChatStream()

        // Only set the stream if the component is still mounted
        if (!isSubscribed) {
          chatStream.socket.close()
          return
        }

        streamRef.current = chatStream
        dispatch(setStream(chatStream))
        dispatch(setConnectionStatus(true))

        chatStream.socket.on('error', (event) => {
          console.error('ChatStream error', event)
          if (isSubscribed) {
            dispatch(setError('Chat connection error occurred'))
            dispatch(setConnectionStatus(false))
            dispatch(setStream(null))
          }
        })

        chatStream.socket.on('close', (event) => {
          console.error('ChatStream close', event)
          if (isSubscribed) {
            dispatch(setConnectionStatus(false))
            dispatch(setStream(null))
          }
        })

        while (isSubscribed) {
          const msg = await chatStream.next()
          if (!msg) break

          if (isSubscribed) {
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
        }
      }
    }

    startChat()

    return () => {
      isSubscribed = false
      // Close the socket connection if it exists
      if (streamRef.current?.socket) {
        streamRef.current.socket.close()
        streamRef.current = null
      }
      dispatch(setConnectionStatus(false))
      dispatch(setStream(null))
    }
  }, [api, dispatch])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !api) return

    dispatch({
      type: 'chat/sendToStream',
      payload: { text: inputMessage },
    })

    dispatch(
      addMessage({
        id: Date.now().toString(),
        content: inputMessage,
        role: 'user',
        timestamp: Date.now(),
      })
    )

    setInputMessage('')
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto p-3 pb-20 space-y-3'>
        {messages.map((message: ChatMessage) => (
          <ChatBubble
            key={message.id}
            variant={message.role === 'user' ? 'sent' : 'received'}
            className='max-w-[80%] text-sm'
          >
            <div className='flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400/10'>
              {message.role === 'user' ? (
                <User className='w-4 h-4 text-yellow-400' />
              ) : (
                <Bot className='w-4 h-4 text-yellow-400' />
              )}
            </div>
            <ChatBubbleMessage className='py-2 px-3'>{message.content}</ChatBubbleMessage>
          </ChatBubble>
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className='absolute bottom-0 left-0 right-0 p-4 bg-black/10 dark:bg-black/10 backdrop-blur-sm'
      >
        <div className='flex max-w-[1200px] mx-auto'>
          <div className='flex w-full rounded-lg overflow-hidden border border-gray-200 dark:border-yellow-500/20'>
            <input
              type='text'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Type your message...'
              className='flex-1 px-4 py-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-sm'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <button
              type='submit'
              className='px-8 py-3 bg-yellow-400 text-black font-medium hover:bg-yellow-300 transition-colors text-sm'
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
