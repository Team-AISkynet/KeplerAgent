import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
