import { createClerkClient, verifyToken } from '@clerk/backend'
import { APIError, Gateway, Header } from 'encore.dev/api'
import { authHandler } from 'encore.dev/auth'
import { secret } from 'encore.dev/config'

import log from 'encore.dev/log'
import { AUTHORIZED_PARTIES } from './config'

const clerkSecretKey = secret('CLERK_SECRET_KEY')

const clerkClient = createClerkClient({
  secretKey: clerkSecretKey(),
})

interface AuthParams {
  authorization: Header<'Authorization'>
}

interface AuthData {
  userID: string
  imageUrl: string
  emailAddress: string | null
}

const myAuthHandler = authHandler(async (params: AuthParams): Promise<AuthData> => {
  const token = params.authorization.replace('Bearer ', '')

  if (!token) {
    throw APIError.unauthenticated('no token provided')
  }

  try {
    const result = await verifyToken(token, {
      authorizedParties: AUTHORIZED_PARTIES,
      secretKey: clerkSecretKey(),
    })

    const user = await clerkClient.users.getUser(result.sub)

    return {
      userID: user.id,
      imageUrl: user.imageUrl,
      emailAddress: user.emailAddresses[0].emailAddress || null,
    }
  } catch (e) {
    log.error(e)
    throw APIError.unauthenticated('invalid token', e as Error)
  }
})

export const gw = new Gateway({ authHandler: myAuthHandler })
