import { api } from 'encore.dev/api'
import log from 'encore.dev/log'
import { getAuthData } from '~encore/auth'
import { getAgentExecutor, formatChatHistory, cleanOutput } from './agent/agent'
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

// ChatStream is a streaming API endpoint that allows a user to chat with a chatbot.
// It requires authentication.
export const ChatStream = api.streamInOut<InMessage, OutMessage>(
  { path: '/chat', expose: true, auth: true },
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
// export const ChatStream = api.streamInOut<InMessage, OutMessage>(
//   { path: '/chat', expose: true, auth: true },
//   async (stream) => {
//     const agentExecutor = getAgentExecutor()
//     const user = getAuthData()!
//     const chatHistory: (HumanMessage | AIMessage)[] = []

//     log.info('ChatStream sending welcome message', { user })
//     await stream.send({
//       text: `Hi! I'm your AI assistant. I can help you with information and answer questions.`,
//       isComplete: true,
//     })

//     for await (const chatMessage of stream) {
//       log.info('ChatStream received message', { chatMessage })

//       const userMessage = new HumanMessage(chatMessage.text)
//       chatHistory.push(userMessage)

//       try {
//         // Invoke the agent with chat history
//         const result = await agentExecutor.invoke({
//           input: chatMessage.text,
//           chat_history: formatChatHistory(chatHistory),
//         })

//         log.info('ChatStream result', { result })

//         // Clean the output before creating AI message and sending response
//         const cleanedOutput = cleanOutput(result.output)

//         // Add AI response to chat history
//         const aiMessage = new AIMessage(cleanedOutput)
//         chatHistory.push(aiMessage)

//         // Send the cleaned response
//         await stream.send({
//           text: cleanedOutput,
//           isComplete: true,
//         })
//       } catch (error) {
//         log.error('Error in ChatStream', { error })
//         await stream.send({
//           text: 'I apologize, but I encountered an error processing your request. Please try again.',
//           isComplete: true,
//         })
//       }
//     }
//   }
// )
