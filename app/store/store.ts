import { configureStore, ThunkAction, Action, EnhancedStore, Middleware } from '@reduxjs/toolkit'
import chartReducer from './chartSlice'
import chatReducer from './chatSlice'
import { chatMiddleware } from './chatMiddleware'
import keplerGlReducer, { enhanceReduxMiddleware, KeplerGlState } from '@kepler.gl/reducers'

// Create a specific instance for the map
const mapId = 'map'

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  return keplerGlReducer.initialState({
    uiState: {
      currentModal: null,
      activeSidePanel: null,
      mapControls: {
        splitMap: { show: false },
        toggle3d: { show: true },
        mapLegend: { show: true },
      },
    },
    mapState: {
      latitude: 25.2048,
      longitude: 55.2708,
      zoom: 12,
      bearing: 0,
      pitch: 0,
    },
  })
}

// Combine Kepler.gl middleware with our custom middleware
const keplerMiddlewares = enhanceReduxMiddleware([
  // Add other middlewares here
]) as Middleware[]

export const store = configureStore({
  reducer: {
    charts: chartReducer,
    keplerGl: getInitialState(),
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/setStream'],
        ignoredActionPaths: ['payload.stream'],
        ignoredPaths: ['chat.stream'],
      },
    })
      .concat(chatMiddleware)
      .concat(keplerMiddlewares), // Add Kepler.gl middlewares
}) as EnhancedStore

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
