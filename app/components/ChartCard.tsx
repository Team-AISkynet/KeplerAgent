import { useDispatch } from 'react-redux'
import { removeChart } from '../store/chartSlice'
import type { ChartData } from '../store/types'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from 'recharts'
import { Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction, CardFooter } from './ui/card'

interface ChartCardProps {
  chart: ChartData
}

export function ChartCard({ chart }: ChartCardProps) {
  const dispatch = useDispatch()

  const handleRemove = () => {
    dispatch(removeChart(chart.id))
  }

  const chartData = chart.labels.map((label, index) => ({
    name: label,
    value: chart.data[index],
  }))

  const chartConfig: ChartConfig = {
    data: {
      label: chart.title || 'Chart',
    },
  }

  return (
    <Card className='group'>
      <CardHeader>
        <CardTitle>{chart.title || 'Chart'}</CardTitle>
        <CardAction>
          <button
            onClick={handleRemove}
            className='text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity dark:text-red-400 cursor-pointer'
          >
            <Trash2 className='h-5 w-5' />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {chart.type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='value' radius={4} fill='var(--color-chart-1)' />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type='monotone' dataKey='value' strokeWidth={2} dot={false} stroke='var(--color-chart-1)' />
            </LineChart>
          )}
        </ChartContainer>
        <CardFooter className='flex-col items-start text-sm px-0 my-2 py-2'>
          <div className='flex text-muted-foreground leading-none w-10/12'>{chart.answer}</div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
