import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from 'react-router'
import { MapIcon, MessageSquareIcon, LineChartIcon, SearchIcon, ZapIcon } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../components/ui/carousel'
import { useEffect, useState } from 'react'

export function meta() {
  return [{ title: 'KeepItReal' }, { name: 'description', content: 'Real Estate Chat and Analytics Platform' }]
}

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 pt-20 pb-8 text-center'>
        <h1 className='text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-primary to-blue-500 bg-clip-text text-transparent leading-normal py-2'>
          Real Estate Intelligence
        </h1>
        <p className='text-xl text-foreground/80 mb-8 max-w-2xl mx-auto'>
          Analyze properties, visualize market trends, and make data-driven decisions with our AI-powered platform.
        </p>
        <div className='flex gap-4 justify-center mb-8'>
          <SignedOut>
            <SignInButton mode='modal'>
              <button className='px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold'>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <button className='px-4 py-2 rounded-lg bg-black/10 backdrop-blur-[1px] hover:bg-black/20 font-semibold border border-border/30'>
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              to='/chat'
              className='px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold'
            >
              Start Chatting
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Features Carousel */}
      <div className='container mx-auto px-4 mb-24'>
        <Carousel className='w-full max-w-5xl mx-auto' setApi={setApi}>
          <CarouselContent>
            {/* Analyze Section */}
            <CarouselItem>
              <div className='p-4'>
                <h2 className='text-4xl font-bold mb-12 text-center'>Analyze</h2>
                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='p-6 rounded-2xl bg-black/5 backdrop-blur-[1px] border border-border/30 flex flex-col items-center text-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <MessageSquareIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>AI Chat Analysis</h3>
                    <p className='text-foreground/80'>
                      Chat with our AI to analyze properties, get market insights, and make informed decisions.
                    </p>
                  </div>

                  <div className='p-6 rounded-2xl bg-black/5 backdrop-blur-[1px] border border-border/30 flex flex-col items-center text-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <MapIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>Interactive Maps</h3>
                    <p className='text-foreground/80'>
                      Visualize property locations, market hotspots, and neighborhood analytics.
                    </p>
                  </div>

                  <div className='p-6 rounded-2xl bg-black/5 backdrop-blur-[1px] border border-border/30 flex flex-col items-center text-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <LineChartIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>Market Trends</h3>
                    <p className='text-foreground/80'>
                      Track price trends, market dynamics, and investment opportunities in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* React Section */}
            <CarouselItem>
              <div className='p-4'>
                <h2 className='text-4xl font-bold mb-12 text-center'>React</h2>
                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='p-6 rounded-2xl bg-black/5 backdrop-blur-[1px] border border-border/30 flex flex-col items-center text-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <ZapIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>Automated Strategy</h3>
                    <p className='text-foreground/80'>
                      Automatically adjust your properties on the market according to a strategy that suits you.
                    </p>
                  </div>

                  <div className='p-6 rounded-2xl bg-black/5 backdrop-blur-[1px] border border-border/30 flex flex-col items-center text-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <SearchIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>Flexible Control</h3>
                    <p className='text-foreground/80'>
                      Choose between fully automated or human-in-the-loop operation for peace of mind.
                    </p>
                  </div>

                  <div className='p-6 rounded-2xl bg-black/5 backdrop-blur-[1px] border border-border/30 flex flex-col items-center text-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <LineChartIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>Optimization Goals</h3>
                    <p className='text-foreground/80'>
                      Maximize return, optimize occupancy, or find the perfect balance in between.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
