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
import { addEvent, removeEvent, setEvents, modifyEvent} from '../redux/eventSlice'
import EventModal from './eventModal';


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

  const notSerilizedEvents = useSelector((state) => state.events.events);
  const events = notSerilizedEvents.map(item => {
    return {
      ...item,
      start: new Date(item.start),
      end: new Date(item.end),
    }

  })
  
  const dispatch = useDispatch();
  const [newEvent, setNewEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function slotPropGetter(date) {
    const hour = date.getHours();
    if ((hour >= 0 && hour < 9) || hour === 13 || (hour >= 18 && hour <= 23)) 
    {
      return {
        style: {
          backgroundColor: 'rgba(224,224,224,0.3)',
          pointerEvents: 'none',
          opacity: 0.5,
        }
      };
    }
    return {};
  }


  function isTimeAllowed(start, end) {
    const isBlocked = (hour) => (hour >= 0 && hour < 9) || hour === 13 || (hour >= 18 && hour <= 23);
    let current = new Date(start);
    while (current < end) {
      if (isBlocked(current.getHours())) return false;
      current.setHours(current.getHours() + 1, 0, 0, 0);
    }
    return true;
  }

  const handleSelectSlot = (slotInfo) => {
    if (!isTimeAllowed(slotInfo.start, slotInfo.end)) return;
    const tmp = {
      id: Date.now(),
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

  function serializeEvent(ev) {
    return {
      ...ev,
      start: ev.start instanceof Date ? ev.start.toISOString() : ev.start,
      end: ev.end instanceof Date ? ev.end.toISOString() : ev.end,
    };
  }
  function serializeEvents(events) {
    return events.map(serializeEvent);
  }

  const handleEventDrop = ({ event, start, end }) => {
    if (!isTimeAllowed(start, end)) return;
    const updatedEvent = { ...event, start, end };
    const nextEvents = events.map(ev =>
      ev.id === event.id ? updatedEvent : ev
    );
    dispatch(setEvents(serializeEvents(nextEvents)));
  }

  const handleEventResize = ({ event, start, end }) => {
    if (!isTimeAllowed(start, end)) return;
    const nextEvents = events.map(ev =>
      ev.id === event.id ? { ...ev, start, end } : ev
    );
    dispatch(setEvents(serializeEvents(nextEvents)));
  }

  const onStartTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newStart = new Date(newEvent.start);
    newStart.setHours(hours);
    newStart.setMinutes(minutes);
    setNewEvent(prev => ({ ...prev, start: newStart }));
  };
  const onEndTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newEnd = new Date(newEvent.end);
    newEnd.setHours(hours);
    newEnd.setMinutes(minutes);
    setNewEvent(prev => ({ ...prev, end: newEnd }));
  };
  const onAdd = () => {
    if (!isTimeAllowed(newEvent.start, newEvent.end)) {
      alert('Orario non consentito!');
      return;
    }
    if(events.some(ev => ev.id === newEvent.id)) {
      dispatch(modifyEvent(serializeEvent(newEvent)));
    }else{
      dispatch(addEvent(serializeEvent(newEvent)));
    }
    setNewEvent(null);
  };
  const onCloseAdd = () => setNewEvent(null);

  const onCloseDetail = () => setSelectedEvent(null);
  const onRemove = () => {
    dispatch(removeEvent(serializeEvent(newEvent)));
    setNewEvent(null);
  };

  const handleSelectEvent = (event) => {
    setNewEvent(event);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessario per permettere il drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
      const alias = JSON.parse(data);
      // Imposta l'evento con start e end ora correnti, personalizza se vuoi usare slot
      const now = new Date();
      const end = new Date(now.getTime() + 60 * 60 * 1000); // +1 ora
      const newEv = {
        id: Date.now(),
        title: alias.title,
        desc: alias.desc,
        start: now,
        end: end
      };
      dispatch(addEvent(serializeEvent(newEv)));
    } catch (err) {
      // Gestione errori parsing
    }
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <DnDCalendar 
        
        localizer={localizer}
        selectable
        events={events}
        defaultView='week'
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable
        endAccessor="end"
        slotPropGetter={slotPropGetter}
        style={{ height: '100%', minHeight: 400, maxHeight: '95vh', width: '100%' }}
      />

      <EventModal
        newEvent={newEvent}
        onTitleChange={titleChange}
        onDescChange={descChange}
        onStartTimeChange={onStartTimeChange}
        onEndTimeChange={onEndTimeChange}
        onAdd={onAdd}
        onClose={onCloseAdd}
        onRemove={onRemove}
      />
    </div>
  )
}

