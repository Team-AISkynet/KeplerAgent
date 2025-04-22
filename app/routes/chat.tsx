import { AuthMiddleware } from '../components/AuthMiddleware'
import { ChatPanel } from '../components/ChatPanel'

export default function ChatPage() {
  return (
    <AuthMiddleware>
      <div className='flex h-screen bg-background relative'>
        {/* Dot grid background pattern */}
        <div
          className='fixed inset-0 pointer-events-none'
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Left side panel */}
        <div className='w-[400px] border-r bg-card/30 backdrop-blur-[2px] relative z-10 rounded-2xl m-4'>
          <ChatPanel />
        </div>

        {/* Main content area */}
        <div className='flex-1 p-6 relative z-10'>
          <h1 className='text-2xl font-bold mb-4'>Space for Map or Charts</h1>
        </div>
      </div>
    </AuthMiddleware>
  )
}
