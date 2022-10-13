import { useState } from 'react';

import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { addHours } from "date-fns";

import { Navbar } from '../components/Navbar'
import { localizer } from '../../helpers/calendarLocalizer';
import { getMessagesEs } from '../../helpers/getMessages';
import { CalendarEvent } from '../components/CalendarEvent';
import { CalendarModal } from '../components/CalendarModal';
import { useSelector } from 'react-redux';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';
import { FabAddNew } from '../components/FabAddNew';
import { FabDelete } from '../components/FabDelete';



export const CalendarPage = () => {

  // * Usando nuestro custom hook que llama al store
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();

  // * Vista por defecto
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')


  // * Estilo
  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event, start, end, isSelected);
    const style = {
      backgroundColor: '#347cf7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }
    return {
      style
    }
  }

  // * Eventos
  const onDoubleClick = (event) => {
    // console.log({ doubleClick: event })
    openDateModal();
  }

  const onSelect = (event) => {
    // console.log({ click: event })
    // añadimos el evento activo, sirve para luego darle valores al modal
    setActiveEvent(event)
  }

  const onViewChanged = (event) => {
    console.log({ viewChanged: event });
    localStorage.setItem('lastView', event);
    setLastView(event);
  }



  // ***
  return (
    <>
      <Navbar />
      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesEs()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal />
      <FabDelete />
      <FabAddNew />
    </>
  )
}
