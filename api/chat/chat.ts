import { api } from 'encore.dev/api'
import log from 'encore.dev/log'
import { getAuthData } from '~encore/auth'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { getGraphAgentExecutor } from './agent/graph-agent'

interface ChartArgs {
  chart_type: 'bar' | 'line'
  title: string
  labels: string[]
  data: number[]
}

interface Visualization {
  type: 'tool_call'
  tool_name: 'draw_chart'
  args: ChartArgs
}

interface APIResponse {
  query: string
  sql: string
  result: Array<Record<string, number | string>>
  visualization: Visualization
  answer: string
}

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
  visualization?: Visualization
  isComplete?: boolean
}

// ChatLLStream is a streaming API endpoint that allows a user to chat with a chatbot.
// It requires authentication. It uses a langgraph setup
export const ChatLLMStream = api.streamInOut<InMessage, OutMessage>(
  { path: '/api/chat-llm', expose: true, auth: true },
  async (stream) => {
    const agentExecutor = getGraphAgentExecutor()
    const user = getAuthData()!
    const chatHistory: (HumanMessage | AIMessage)[] = []

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
  { path: '/api/chat-api', expose: true, auth: true },
  async (stream) => {
    const user = getAuthData()!
    const chatHistory: (HumanMessage | AIMessage)[] = []

    for await (const chatMessage of stream) {
      log.info('ChatStream received message', { chatMessage })

      const userMessage = new HumanMessage(chatMessage.text)
      chatHistory.push(userMessage)

      try {
        log.debug('Sending request to API')
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

        log.debug('API response code', response.status)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const apiResponse = await response.json()

        log.debug('apiResponse json', apiResponse)

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
          visualization: undefined,
          isComplete: true,
        })
      }
    }
  }
)
