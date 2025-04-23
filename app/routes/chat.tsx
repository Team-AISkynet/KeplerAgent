import { AuthMiddleware } from '../components/AuthMiddleware'
import { ChatPanel } from '../components/ChatPanel'
import { ChartCard } from '../components/ChartCard'
import { useDispatch, useSelector } from 'react-redux'
import { addChart } from '../store/chartSlice'
import { RootState } from '../store/store'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'

// Example data import - in production this would come from your API
import exampleLineData from '../../api/data/testdata/example-llm-line.json'
import exampleBarData from '../../api/data/testdata/example-llm-bar.json'
import { ChartData } from '../store/types'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export default function ChatPage() {
  const dispatch = useDispatch()
  const charts = useSelector((state: RootState) => state.charts.charts)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const handleAddLineChart = () => {
    const visualization = exampleLineData.visualization
    if (visualization && visualization.args) {
      dispatch(
        addChart({
          id: uuidv4(),
          type: visualization.args.chart_type as 'line' | 'bar',
          labels: visualization.args.labels,
          data: visualization.args.data,
          title: visualization.args.title,
          answer: exampleLineData.answer,
        })
      )
    }
  }

  const handleAddBarChart = () => {
    const visualization = exampleBarData.visualization
    if (visualization && visualization.args) {
      dispatch(
        addChart({
          id: uuidv4(),
          type: visualization.args.chart_type as 'line' | 'bar',
          labels: visualization.args.labels,
          data: visualization.args.data,
          title: visualization.args.title,
          answer: exampleLineData.answer,
        })
      )
    }
  }

  const handleTryQuestion = (question: string) => {
    // Here you would dispatch an action to populate the chat input
    console.log('Trying question:', question)
    // TODO: Implement chat population logic
  }

  const starterQuestions = [
    'Plot the monthly rental-price change (%) for Downtown Dubai over the past 12 months.',
    'Show a time-series of vacancy-rate trends for Business Bay during Q1 2025.',
    'Display days-on-market trends for 3BR listings in Dubai Marina over the last 6 months.',
    'Compare new-listing velocity vs. vacancy-rate change for Al Barsha and JLT on one chart.',
    'Which neighborhoods had the highest rental-price growth last quarter?',
    'What areas are currently emerging as rental-hotspots?',
    'How have citywide vacancy rates shifted over the past month?',
    "What's driving the fastest changes in days-on-market trends?",
  ]

  return (
    <AuthMiddleware>
      <div className='flex h-screen relative'>
        {/* Left side panel */}
        <div className='fixed top-24 left-4 w-[400px] border-r border-border/30 bg-black/5 backdrop-blur-[1px] z-10 rounded-2xl h-[calc(100vh-8rem)]'>
          <ChatPanel />
        </div>

        {/* Main content area */}
        <div className='flex-1 p-6 relative z-10 ml-[432px]'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold'>Charts Dashboard</h1>
            <Button variant='outline' onClick={handleAddLineChart}>
              Add Line Chart
            </Button>
            <Button variant='outline' onClick={handleAddBarChart}>
              Add Bar Chart
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-6'>
            {charts.length === 0 ? (
              <div className='space-y-8'>
                <h2 className='text-xl font-semibold text-center'>
                  To get started you can ask any question you like, or try these starters:
                </h2>

                {/* TrendSpotter Section */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium px-2'>TrendSpotter</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {starterQuestions.map((question, index) => (
                      <Card
                        key={index}
                        className='relative group cursor-pointer'
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <CardContent className='pt-6'>
                          <p className={`${index < 4 ? 'font-medium' : ''} group-hover:opacity-50 transition-opacity`}>
                            {question}
                          </p>
                          <div
                            className={`absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-all ${
                              hoveredCard === index ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <Button variant='secondary' className='z-10' onClick={() => handleTryQuestion(question)}>
                              Try this
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              charts.map((chart: ChartData) => <ChartCard key={chart.id} chart={chart} />)
            )}
          </div>
        </div>
      </div>
    </AuthMiddleware>
  )
}
