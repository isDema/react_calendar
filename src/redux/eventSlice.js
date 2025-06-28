import { createSlice, isDraft } from '@reduxjs/toolkit'

const initialState = {
  events: [],
}

export const eventSlice = createSlice(
    {
        name: 'event',
        initialState,
        reducers: {
          addEvent: (state, action) =>{
            state.events.push(action.payload);
          },
          removeEvent: (state, action) => {
            state.events = state.events.filter((item) => item.id !== action.payload.id)
          },
          setEvents: (state, action) => {
           
            state.events = action.payload.map(ev => ({
              ...ev,
              start: ev.start instanceof Date ? ev.start.toISOString() : ev.start,
              end: ev.end instanceof Date ? ev.end.toISOString() : ev.end
            }));
          },
          modifyEvent: (state, action) => {
            const updatedEvent = action.payload;
            state.events = state.events.map(ev =>
              ev.id === updatedEvent.id ? updatedEvent : ev
            );
          }
        }
        
    }
)

export const {addEvent, removeEvent, setEvents, modifyEvent} = eventSlice.actions

export default eventSlice.reducer;