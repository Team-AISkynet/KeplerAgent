/**
 * Represents the data structure for a chart visualization
 * @example
 * ```typescript
 * const barChart: ChartData = {
 *   id: "chart-1",
 *   type: "bar",
 *   labels: ["Jan", "Feb", "Mar"],
 *   data: [10, 20, 15],
 *   title: "Monthly Sales",
 *   answer: "Sales peaked in February with 20 units"
 * }
 * ```
 */
export interface ChartData {
  /** Unique identifier for the chart */
  id: string

  /**
   * Type of chart visualization
   * - 'bar': Displays data as vertical bars
   * - 'line': Displays data as a continuous line
   */
  type: 'bar' | 'line'

  /**
   * Labels for each data point on the x-axis
   * @example ["Jan", "Feb", "Mar"]
   */
  labels: string[]

  /**
   * Numerical values for each data point
   * @example [10, 20, 15]
   */
  data: number[]

  /**
   * Optional title displayed at the top of the chart
   * If not provided, defaults to "Chart" in the UI
   */
  title?: string

  /**
   * Optional description or analysis of the chart data
   * Displayed below the chart visualization
   */
  answer?: string
}

export interface ChartState {
  charts: ChartData[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  isConnected: boolean
  error: string | null
  stream: ReadableStream | null
}
