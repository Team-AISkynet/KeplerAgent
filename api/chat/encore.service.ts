import { secret } from 'encore.dev/config'
import { Service } from 'encore.dev/service'
import log from 'encore.dev/log'

const langsmithApiKey = secret('LANGSMITH_API_KEY')
const openaiApiKey = secret('OPENAI_API_KEY')
const tavilyApiKey = secret('TAVILY_API_KEY')

function initService() {
  log.info('Initializing chat service')
  process.env.LANGCHAIN_API_KEY = langsmithApiKey()
  process.env.LANGCHAIN_CALLBACKS_BACKGROUND = 'true'
  process.env.LANGCHAIN_TRACING_V2 = 'true'
  process.env.LANGCHAIN_PROJECT = 'keplerbot'

  process.env.OPENAI_API_KEY = openaiApiKey()
  process.env.TAVILY_API_KEY = tavilyApiKey()
}

initService()

export default new Service('chat')
