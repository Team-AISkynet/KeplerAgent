import { api } from 'encore.dev/api'
import log from 'encore.dev/log'
import { getAuthData } from '~encore/auth'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { getGraphAgentExecutor } from './agent/graph-agent'

interface InMessage {
  // Text sent by the user
  text: string
}

interface OutMessage {
  // Text to send back to the user
  text: string
  isComplete?: boolean
}

interface OutAPIMessage {
  // Text to send back to the user
  text: string
  visualization: any
  isComplete?: boolean
}

// ChatLLStream is a streaming API endpoint that allows a user to chat with a chatbot.
// It requires authentication. It uses a langgraph setup
export const ChatLLMStream = api.streamInOut<InMessage, OutMessage>(
  { path: '/chat-llm', expose: true, auth: true },
  async (stream) => {
    const agentExecutor = getGraphAgentExecutor()
    const user = getAuthData()!
    const chatHistory: (HumanMessage | AIMessage)[] = []

    log.info('ChatStream sending welcome message', { user })
    await stream.send({
      text: `Hi! I'm your AI assistant. I can help you with information and answer questions.`,
      isComplete: true,
    })

    for await (const chatMessage of stream) {
      log.info('ChatStream received message', { chatMessage })

      const userMessage = new HumanMessage(chatMessage.text)
      chatHistory.push(userMessage)

      try {
        const agentNextState = await agentExecutor.invoke(
          { messages: [new HumanMessage(chatMessage.text)] },
          { configurable: { thread_id: user.userID } }
        )

        const responseText = agentNextState.messages[agentNextState.messages.length - 1].content

        // Send the cleaned response
        await stream.send({
          text: responseText,
          isComplete: true,
        })
      } catch (error) {
        log.error('Error in ChatStream', { error })
        await stream.send({
          text: 'I apologize, but I encountered an error processing your request. Please try again.',
          isComplete: true,
        })
      }
    }
  }
)

// ChatAPIStream is a streaming API endpoint that allows a user to chat with a chatbot.
// It requires authentication. It uses a backend pything API setup

export const ChatAPIStream = api.streamInOut<InMessage, OutAPIMessage>(
  { path: '/chat-api', expose: true, auth: true },
  async (stream) => {
    const user = getAuthData()!
    const chatHistory: (HumanMessage | AIMessage)[] = []

    log.info('ChatStream sending welcome message', { user })
    await stream.send({
      text: `Hi! I'm your AI assistant. I can help you with information and answer questions.`,
      visualization: {},
      isComplete: true,
    })

    for await (const chatMessage of stream) {
      log.info('ChatStream received message', { chatMessage })

      const userMessage = new HumanMessage(chatMessage.text)
      chatHistory.push(userMessage)

      try {
        const response = await fetch('https://real-estate-query-api.darkube.app/rent-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: chatMessage.text,
            email: user.emailAddress,
          }),
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const apiResponse = await response.json()
        const responseText = apiResponse.answer

        // Send the cleaned response
        await stream.send({
          text: responseText,
          visualization: apiResponse.visualization,
          isComplete: true,
        })
      } catch (error) {
        log.error('Error in ChatStream', { error })
        await stream.send({
          text: 'I apologize, but I encountered an error processing your request. Please try again.',
          visualization: {},
          isComplete: true,
        })
      }
    }
  }
)
