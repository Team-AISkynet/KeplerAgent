import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Flame } from 'lucide-react'

interface Question {
  text: string
  isChartQuery: boolean
  isHot?: boolean
}

interface QuestionCategory {
  id: string
  name: string
  chartQuestions: Question[]
  textQuestions: Question[]
}

interface QuestionTabsProps {
  onTryQuestion: (question: string) => void
  hoveredCard: number | null
  setHoveredCard: (index: number | null) => void
}

const questionCategories: QuestionCategory[] = [
  {
    id: 'trendspotter',
    name: 'TrendSpotter',
    chartQuestions: [
      {
        text: 'Plot the monthly rental-price change (%) for Downtown Dubai over the past 12 months.',
        isChartQuery: true,
        isHot: true,
      },
      { text: 'Show a time-series of vacancy-rate trends for Business Bay during Q1 2025.', isChartQuery: true },
      {
        text: 'Display days-on-market trends for 3BR listings in Dubai Marina over the last 6 months.',
        isChartQuery: true,
      },
      {
        text: 'Compare new-listing velocity vs. vacancy-rate change for Al Barsha and JLT on one chart.',
        isChartQuery: true,
      },
    ],
    textQuestions: [
      {
        text: 'Which neighborhoods had the highest rental-price growth last quarter?',
        isChartQuery: false,
        isHot: true,
      },
      { text: 'What areas are currently emerging as rental-hotspots?', isChartQuery: false },
      { text: 'How have citywide vacancy rates shifted over the past month?', isChartQuery: false },
      { text: "What's driving the fastest changes in days-on-market trends?", isChartQuery: false },
    ],
  },
  {
    id: 'priceadvisor',
    name: 'PriceAdvisor',
    chartQuestions: [
      {
        text: 'Bar chart of comparable rents for 2BR apartments in Palm Jumeirah.',
        isChartQuery: true,
        isHot: true,
      },
      {
        text: 'Side-by-side comparison of average rents for units with vs. without balconies in JLT.',
        isChartQuery: true,
      },
      {
        text: 'Scatterplot of neighborhood rental-demand (leads) vs. rent levels for 1BR in Downtown.',
        isChartQuery: true,
      },
      { text: 'Rent distribution percentiles (10th, 50th, 90th) for 3BR in Business Bay.', isChartQuery: true },
    ],
    textQuestions: [
      {
        text: 'What is the optimal rent recommendation for a 2BR in Dubai Marina right now?',
        isChartQuery: false,
        isHot: true,
      },
      { text: 'Which property features yield the greatest rent uplift in Al Barsha?', isChartQuery: false },
      { text: 'How is neighborhood rental demand trending in JLT?', isChartQuery: false },
      { text: 'What value-add suggestions would boost my rent by at least 5%?', isChartQuery: false },
    ],
  },
  {
    id: 'comparablesbot',
    name: 'ComparablesBot',
    chartQuestions: [
      {
        text: 'Plot top 10 similar rental comps around my JBR property, showing rent vs. days-on-market.',
        isChartQuery: true,
      },
      {
        text: 'Map view of recent rental comps within 500 m of Business Bay, color-coded by rent level.',
        isChartQuery: true,
        isHot: true,
      },
      { text: 'Histogram of rent prices for comparable 1BR units in Downtown Dubai.', isChartQuery: true },
      { text: 'Radar chart of feature-match scores (beds, sqm, amenities) for nearby comps.', isChartQuery: true },
    ],
    textQuestions: [
      { text: 'List the three most similar properties to my 3BR in Al Barsha.', isChartQuery: false },
      { text: 'What is the average rent achieved by comparables in Jumeirah Village Circle?', isChartQuery: false },
      { text: "How does my property's days-on-market compare to local comps?", isChartQuery: false },
      { text: 'Which amenities are most common among top-performing comparables?', isChartQuery: false },
    ],
  },
  {
    id: 'roiforecaster',
    name: 'ROI Forecaster',
    chartQuestions: [
      {
        text: 'IRR curve over 1-5 year hold periods for a purchase at 1.2 M AED with 80 K AED annual rent.',
        isChartQuery: true,
        isHot: true,
      },
      {
        text: 'Overlay of gross vs. net yield trends over the past 5 years for Downtown apartments.',
        isChartQuery: true,
      },
      { text: 'Sensitivity chart of IRR under varying rent-growth rates (0-5%).', isChartQuery: true },
      {
        text: 'Line chart of cost-to-income ratio changes for different purchase-price scenarios.',
        isChartQuery: true,
      },
    ],
    textQuestions: [
      { text: 'What is the projected net yield if maintenance fees increase by 1%?', isChartQuery: false },
      { text: 'How does historical rent growth impact my expected return over 3 years?', isChartQuery: false },
      { text: 'What cap-rate trend should I expect for a property in Business Bay?', isChartQuery: false },
      { text: 'Which hold period maximizes IRR for a 1.5 M AED investment?', isChartQuery: false },
    ],
  },
  {
    id: 'neighbourhoodpulse',
    name: 'Neighbourhood Pulse',
    chartQuestions: [
      {
        text: 'Bar chart comparing median sale vs. rent prices across the top 5 Dubai neighborhoods.',
        isChartQuery: true,
      },
      {
        text: 'Timeline of infrastructure-project completions vs. median-rent growth in Downtown.',
        isChartQuery: true,
      },
      { text: 'Dual-axis chart of development-potential index vs. rent-change % for Al Barsha.', isChartQuery: true },
      {
        text: 'Scatter of infrastructure CapEx per km² vs. vacancy rate for JLT and Business Bay.',
        isChartQuery: true,
      },
    ],
    textQuestions: [
      {
        text: 'Which neighborhood has the highest infrastructure development potential?',
        isChartQuery: false,
        isHot: true,
      },
      { text: 'What is the current median rent price in Al Barsha?', isChartQuery: false },
      { text: 'How many major infrastructure projects are planned for Business Bay in 2025?', isChartQuery: false },
      { text: 'What factors contribute most to area development potential in JLT?', isChartQuery: false },
    ],
  },
  {
    id: 'riskradar',
    name: 'RiskRadar',
    chartQuestions: [
      {
        text: 'Heatmap of current vacancy rates by Dubai district.',
        isChartQuery: true,
        isHot: true,
      },
      { text: 'Oversupply-index trendline for Business Bay and JLT over the past year.', isChartQuery: true },
      { text: 'Comparison chart of vacancy rate vs. market-saturation indicator for Al Barsha.', isChartQuery: true },
      { text: 'Timeline of regulatory-change alerts (e.g. rent caps) alongside vacancy spikes.', isChartQuery: true },
    ],
    textQuestions: [
      { text: 'Which areas currently have the highest vacancy rates?', isChartQuery: false },
      { text: 'What regulatory considerations should I watch for in Downtown?', isChartQuery: false },
      { text: 'How saturated is the rental market in Dubai Marina?', isChartQuery: false },
      { text: 'Which districts are at risk of oversupply based on permit-to-supply ratios?', isChartQuery: false },
    ],
  },
]

export function QuestionTabs({ onTryQuestion, hoveredCard, setHoveredCard }: QuestionTabsProps) {
  return (
    <Tabs defaultValue='trendspotter' className='w-full'>
      <TabsList className='grid grid-cols-6 mb-8'>
        {questionCategories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className='text-sm'>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {questionCategories.map((category) => (
        <TabsContent key={category.id} value={category.id} className='space-y-8'>
          <div className='space-y-4'>
            <h3 className='text-lg font-medium px-2'>📊 Chart + Explanation Queries</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {category.chartQuestions.map((question, index) => (
                <Card
                  key={index}
                  className='relative group cursor-pointer'
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className='pt-6'>
                    <div className='relative'>
                      <p className='font-medium group-hover:opacity-50 transition-opacity pr-8'>{question.text}</p>
                      {question.isHot && (
                        <div className='absolute top-0 right-0'>
                          <Flame className='w-6 h-6 text-orange-500' />
                        </div>
                      )}
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-all ${
                        hoveredCard === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Button variant='secondary' className='z-10' onClick={() => onTryQuestion(question.text)}>
                        Try this
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium px-2'>💬 Text-Only Queries</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {category.textQuestions.map((question, index) => (
                <Card
                  key={index}
                  className='relative group cursor-pointer'
                  onMouseEnter={() => setHoveredCard(index + category.chartQuestions.length)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className='pt-6'>
                    <div className='relative'>
                      <p className='group-hover:opacity-50 transition-opacity pr-8'>{question.text}</p>
                      {question.isHot && (
                        <div className='absolute top-0 right-0'>
                          <Flame className='w-6 h-6 text-orange-500' />
                        </div>
                      )}
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-all ${
                        hoveredCard === index + category.chartQuestions.length ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Button variant='secondary' className='z-10' onClick={() => onTryQuestion(question.text)}>
                        Try this
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
