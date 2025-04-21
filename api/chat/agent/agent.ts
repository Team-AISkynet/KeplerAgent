import { AgentExecutor, createReactAgent } from 'langchain/agents'
import { pull } from 'langchain/hub'
import { ChatOpenAI } from '@langchain/openai'
import type { PromptTemplate } from '@langchain/core/prompts'
import { TavilySearch } from '@langchain/tavily'
import { BufferMemory } from 'langchain/memory'
import log from 'encore.dev/log'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { Tool } from '@langchain/core/tools'

// Define types for our agent
interface AgentState {
  input: string
  chat_history: (HumanMessage | AIMessage)[]
}

let agentExecutorWithChat: AgentExecutor

async function setupAgent(): Promise<AgentExecutor> {
  // Pull the React chat prompt from the hub
  const promptWithChat = await pull<PromptTemplate>('hwchase17/react-chat')

  log.info('Setting up agent with prompt', { prompt: promptWithChat.template })

  // Initialize tools with proper typing
  const tools = [
    new TavilySearch({
      maxResults: 1,
    }),
  ]

  // Initialize the LLM with specific model and settings
  const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini', // Using a capable model for tool use
    temperature: 0, // Lower temperature for more focused responses
    streaming: true, // Enable streaming for better UX
  })

  // Setup memory with proper typing
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: 'chat_history',
    inputKey: 'input',
    outputKey: 'output',
  })

  // Create the React agent with tools and prompt
  const agentWithChat = await createReactAgent({
    llm,
    tools,
    prompt: promptWithChat,
  })

  // Initialize the agent executor with all components
  agentExecutorWithChat = new AgentExecutor({
    agent: agentWithChat,
    tools,
    memory,
    verbose: true, // Enable verbose mode for debugging
    maxIterations: 3, // Limit the number of tool use iterations
  })

  return agentExecutorWithChat
}

function getAgentExecutor(): AgentExecutor {
  if (!agentExecutorWithChat) {
    throw new Error('Agent executor not initialized')
  }

  return agentExecutorWithChat
}

// Add a helper function to format chat history
function formatChatHistory(messages: (HumanMessage | AIMessage)[]): string {
  return messages
    .map((msg) => {
      const role = msg instanceof HumanMessage ? 'Human' : 'AI'
      return `${role}: ${msg.content}`
    })
    .join('\n')
}

export { setupAgent, getAgentExecutor, formatChatHistory }
