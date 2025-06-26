import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  events: [],
  lenght: 0
}

export const eventSlice = createSlice(
    {
        name: 'event',
        initialState,
        reducers: {
          addEvent: (state, action) =>{
            state.events.push(action.payload);
            state.lenght = state.lenght+1;
          },
          removeEvent: (state, action) => {
            state.events = state.events.filter((item) => item.id !== action.payload.id)
            state.lenght = state.lenght-1;
          },
          setEvents: (state, action) => {
            state.events = action.payload
          }
  
        }
        
    }
)

export const {addEvent, removeEvent, setEvents} = eventSlice.actions

export default eventSlice.reducer;