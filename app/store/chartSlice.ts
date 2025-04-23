import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChartData, ChartState } from './types'

const initialState: ChartState = {
  charts: [],
}

export const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    addChart: (state, action: PayloadAction<ChartData>) => {
      state.charts.unshift(action.payload)
    },
    removeChart: (state, action: PayloadAction<string>) => {
      state.charts = state.charts.filter((chart) => chart.id !== action.payload)
    },
  },
})

export const { addChart, removeChart } = chartSlice.actions
export default chartSlice.reducer
