import { AuthMiddleware } from '../components/AuthMiddleware'
import { ChatPanel } from '../components/ChatPanel'

export default function ChatPage() {
  return (
    <AuthMiddleware>
      <div className='flex h-screen bg-background'>
        {/* Left side panel */}
        <div className='w-[400px] border-r bg-card'>
          <ChatPanel />
        </div>

        {/* Main content area */}
        <div className='flex-1 p-6'>
          <h1 className='text-2xl font-bold mb-4'>Select a chat to start</h1>
          <p className='text-muted-foreground'>Choose a conversation from the left panel or start a new one.</p>
        </div>
      </div>
    </AuthMiddleware>
  )
}
