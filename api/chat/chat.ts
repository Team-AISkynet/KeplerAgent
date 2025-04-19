import { api } from 'encore.dev/api'
import log from 'encore.dev/log'
import { getAuthData } from '~encore/auth'

interface InMessage {
  // Text sent by the user
  text: string
}

interface OutMessage {
  // Text to send back to the user
  text: string
}

// ChatStream is a streaming API endpoint that allows a user to chat with a chatbot.
// It requires authentication.
export const ChatStream = api.streamInOut<InMessage, OutMessage>(
  { path: '/chat', expose: true, auth: true },
  async (stream) => {
    const user = getAuthData()!

    await stream.send({
      text: `Hi ${user.emailAddress}`,
    })

    for await (const chatMessage of stream) {
      // Respond to the message by sending something back
      await stream.send({
        text: `You said: ${chatMessage.text}`,
      })
    }
  }
)
