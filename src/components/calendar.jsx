import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import enUS from 'date-fns/locale/en-US'
import { useEffect, useState } from 'react'
import './calendar.css'
import { useSelector, useDispatch } from 'react-redux'
import { addEvent, removeEvent, setEvents} from '../redux/eventSlice'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DnDCalendar = withDragAndDrop(BigCalendar)


export default function MyCalendar() {

  const events = useSelector((state) => state.events.events);
  const lenght = useSelector((state) => state.events.lenght);
  const dispatch = useDispatch();
  const [newEvent, setNewEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = (slotInfo) => {
    
    const tmp = {
        id: lenght,
        title: '',
        start: slotInfo.start,
        end: slotInfo.end,
        desc: ''
    };

    setNewEvent(tmp);
  };

  const titleChange = (e) => {

    setNewEvent(prev => ({...prev, title: e.target.value}));
    
  }

  const descChange = (e) => {
    setNewEvent(prev => ({...prev, desc: e.target.value}));
  }

  const serializeDate = (e) => {
    setNewEvent(prev => ({
      ...prev, 
      start: newEvent.start.toISOString(), 
      end: newEvent.end.toISOString()
    }));
  }


  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end }
    const nextEvents = events.map(ev =>
      ev.id === event.id ? updatedEvent : ev
    )
    dispatch(setEvents(nextEvents))
  }

  const handleEventResize = ({ event, start, end }) => {
    const nextEvents = events.map(ev =>
      ev.id === event.id ? { ...event, start, end } : ev
    )
    dispatch(setEvents(nextEvents))
  }

  return (
    <div className="h-screen p-4">
      <DnDCalendar 
        
        localizer={localizer}
        selectable
        events={events}
        defaultView='week'
        onSelectSlot={handleSelectSlot}
        onSelectEvent={event => setSelectedEvent(event)}
        startAccessor="start"
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable
        endAccessor="end"
        style={{ height: 700 }}
      />

      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          <h3>{selectedEvent.title}</h3>
          <p><strong>Inizio:</strong> {selectedEvent.start.toLocaleString()}</p>
          <p><strong>Fine:</strong> {selectedEvent.end.toLocaleString()}</p>
          <p><strong>Descrizione:</strong> {selectedEvent.desc}</p>
          <button onClick={() => setSelectedEvent(null)}>Chiudi</button>
          <button onClick={() => {
            dispatch(removeEvent(selectedEvent));
            setSelectedEvent(null);
          }}>Rimuovi</button>
        </div>
      )}

       {newEvent && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          background: '#170122',
          color: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          <h3>Titolo</h3>
          <input type='text' placeholder="..." value={newEvent.title} onChange={titleChange}></input>
          <br></br>
          <h3>Descrizione</h3>
          <input type='text' placeholder="..." value={newEvent.desc} onChange={descChange}></input>
          <br></br>
          <h3>Inizio</h3>
          <input
          type="time"
          value={newEvent.start ? newEvent.start.toTimeString().slice(0,5) : ''}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':');
            const newStart = new Date(newEvent.start);
            newStart.setHours(hours);
            newStart.setMinutes(minutes);
            setNewEvent(prev => ({ ...prev, start: newStart }));
          }}
          />

        <h3>Fine</h3>
        <input
          type="time"
          value={newEvent.end ? newEvent.end.toTimeString().slice(0,5) : ''}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':');
            const newEnd = new Date(newEvent.end);
            newEnd.setHours(hours);
            newEnd.setMinutes(minutes);
            setNewEvent(prev => ({ ...prev, end: newEnd }));
          }}
        />
        <br></br>
        <br></br>
          <button onClick={() => {
            dispatch(addEvent(newEvent));
            setNewEvent(null);
            }}>Aggiungi</button>
          <br></br>
          <br></br>
          <button onClick={() => setNewEvent(null)}>Chiudi</button>
        </div>
      )}
    </div>
  )
}

