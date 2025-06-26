import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import eventsReducer from './eventSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer
  },
})

