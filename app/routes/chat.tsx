import { AuthMiddleware } from '../components/AuthMiddleware'

export default function ChatPage() {
  return (
    <AuthMiddleware>
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Chat</h1>
        <div className='bg-card rounded-lg p-4 min-h-[600px]'>
          {/* Chat content will go here */}
          <p>Chat interface coming soon...</p>
        </div>
      </div>
    </AuthMiddleware>
  )
}
