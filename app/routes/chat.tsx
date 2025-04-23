import { AuthMiddleware } from '../components/AuthMiddleware'
import { ChatPanel } from '../components/ChatPanel'
import { ChartCard } from '../components/ChartCard'
import { useDispatch, useSelector } from 'react-redux'
import { addChart } from '../store/chartSlice'
import { RootState } from '../store/store'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'
import { QuestionTabs } from '../components/QuestionTabs'

// Example data import - in production this would come from your API
import exampleLineData from '../../api/data/testdata/example-llm-line.json'
import exampleBarData from '../../api/data/testdata/example-llm-bar.json'
import { ChartData } from '../store/types'
import { Button } from '../components/ui/button'
import { addMessage, sendMessage } from '../store/chatSlice'

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
    dispatch({
      type: 'chat/sendToStream',
      payload: { text: question },
    })

    dispatch(
      addMessage({
        id: Date.now().toString(),
        content: question,
        role: 'user',
        timestamp: Date.now(),
      })
    )
  }

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

                <QuestionTabs
                  onTryQuestion={handleTryQuestion}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              </div>
            ) : (
              charts.reverse().map((chart: ChartData) => <ChartCard key={chart.id} chart={chart} />)
            )}
          </div>
        </div>
      </div>
    </AuthMiddleware>
  )
}
