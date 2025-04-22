import { secret } from 'encore.dev/config'
import { Service } from 'encore.dev/service'
import log from 'encore.dev/log'
import { setupAgent } from './agent/agent'
import { setupGraphAgent } from './agent/graph-agent'
const langsmithApiKey = secret('LANGSMITH_API_KEY')
const openaiApiKey = secret('OPENAI_API_KEY')
const tavilyApiKey = secret('TAVILY_API_KEY')

async function initService() {
  log.info('Initializing chat service')
  process.env.LANGCHAIN_API_KEY = langsmithApiKey()
  process.env.LANGCHAIN_CALLBACKS_BACKGROUND = 'true'
  process.env.LANGCHAIN_TRACING_V2 = 'true'
  process.env.LANGCHAIN_PROJECT = 'keplerbot'

  process.env.OPENAI_API_KEY = openaiApiKey()
  process.env.TAVILY_API_KEY = tavilyApiKey()

  await setupAgent()
  await setupGraphAgent()
}

initService()

export default new Service('chat')
