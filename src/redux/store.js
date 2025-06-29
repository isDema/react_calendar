import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import eventsReducer from './eventSlice'
import aliasReducer from './aliasSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    alias: aliasReducer
  },
})

