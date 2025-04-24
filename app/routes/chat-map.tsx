import { AuthMiddleware } from '../components/AuthMiddleware'
import { ChatPanelMap } from '../components/ChatPanelMap'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import KeplerGl from '@kepler.gl/components'

const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN

export default function ChatPage() {
  return (
    <AuthMiddleware>
      <div className='flex h-screen relative'>
        {/* Left side panel */}
        <div className='fixed top-16 left-4 w-[400px] border-r border-border/30 bg-black/5 backdrop-blur-[1px] z-10 rounded-2xl h-[calc(100vh-5rem)]'>
          <ChatPanelMap />
        </div>

        {/* Main content area */}
        <div className='flex-1 p-6 relative z-10 ml-[432px]'>
          <AutoSizer>
            {({ height, width }) => (
              <KeplerGl
                mapboxApiAccessToken={MAPBOX_TOKEN} // Replace with your mapbox token
                id='map'
                width={width}
                height={height}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    </AuthMiddleware>
  )
}
