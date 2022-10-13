import { createSlice } from '@reduxjs/toolkit';

import { addHours } from "date-fns";


const tempEvent = {
  _id: new Date().getTime(),
  title: 'Cumple',
  notes: 'Hay que comprar la tarta',
  start: new Date(),
  end: addHours(new Date(), 2),
  bgColor: '#fafafa',
  user: {
    _id: '1234',
    name: 'Jesus'
  }
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    events: [
      tempEvent
    ],
    activeEvent: null
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map(event => {
        if (event._id === payload._id) {
          return payload;
        }
        return event;
      })
    },
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        // Se devuelve todos los events que no sea la nota activa
        state.events = state.events.filter(event => event._id !== state.activeEvent._id);
        state.activeEvent = null;
      }
    }
  }
});


// Action creators are generated for each case reducer function
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent } = calendarSlice.actions;