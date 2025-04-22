import { AgentExecutor } from 'langchain/agents'
import { pull } from 'langchain/hub'
import { ChatOpenAI } from '@langchain/openai'
import type { PromptTemplate } from '@langchain/core/prompts'
import { TavilySearch } from '@langchain/tavily'
import { BufferMemory } from 'langchain/memory'
import log from 'encore.dev/log'
import { HumanMessage } from '@langchain/core/messages'
import { MemorySaver } from '@langchain/langgraph'
import { createReactAgent } from '@langchain/langgraph/prebuilt'

let agentExecutorWithChat: any

async function setupGraphAgent(): Promise<any> {
  // Initialize tools array with our configured tool
  const agentTools = [
    new TavilySearch({
      maxResults: 1,
      topic: 'general',
    }),
  ]

  // Initialize the LLM with specific model and settings
  const agentModel = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0,
  })

  const agentCheckpointer = new MemorySaver()

  // Create the React agent with tools and prompt
  const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
  })

  agentExecutorWithChat = agent

  return agentExecutorWithChat
}

function getGraphAgentExecutor(): AgentExecutor {
  if (!agentExecutorWithChat) {
    throw new Error('Agent executor not initialized')
  }

  return agentExecutorWithChat
}

export { setupGraphAgent, getGraphAgentExecutor }
