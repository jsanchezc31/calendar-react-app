import { addHours } from 'date-fns/esm';
import { useEffect, useMemo, useState } from 'react';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'

import Modal from 'react-modal'

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es'
import { differenceInSeconds } from 'date-fns';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';

registerLocale('es', es)

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

  // * Usando nuestro custom hook que llama al store
  const { isDateModalOpen, closeDateModal } = useUiStore();
  // 
  const { activeEvent, startSavingEvent } = useCalendarStore();

  // * Controlar estado del submit
  const [formSubmitted, setformSubmitted] = useState(false)

  // * Formulario manual
  const [formValues, setformValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 2),
  })

  // * Añadiendo clase al input siempre y cuando se haya hecho el submit
  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';
    return (formValues.title.length > 0)
      ? 'is-valid'
      : 'is-invalid'
  }, [formValues.title, formSubmitted])

  // * Set valores al modal del evento que damos click 
  useEffect(() => {
    if (activeEvent !== null) {
      setformValues({ ...activeEvent });
    }

  }, [activeEvent])


  // * Eventos
  const onInputChanged = ({ target }) => {
    setformValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const onDateChanged = (event, changing) => {
    setformValues({
      ...formValues,
      [changing]: event
    })
  }

  const onCloseModal = () => {
    console.log("Cerrando Modal");
    closeDateModal();
  }

  //* Envio de formulario
  const onSubmit = async (event) => {
    event.preventDefault();
    setformSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start)
    console.log(difference)

    if (isNaN(difference) || difference <= 0) {
      Swal.fire('Fechas incorrectas', 'Revisar fechas ingresadas', 'error')
      return;
    }

    if (formValues.title.length <= 0) return;

    console.log(formValues);

    await startSavingEvent(formValues);
    closeDateModal();
    setformSubmitted(false);

  }

  // ***
  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>

        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          <DatePicker
            selected={formValues.start}
            className="form-control"
            onChange={(event) => onDateChanged(event, 'start')}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption='Hora'
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            minDate={formValues.start}
            selected={formValues.end}
            className="form-control"
            onChange={(event) => onDateChanged(event, 'end')}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption='Hora'

          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChanged}
          />
          <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={onInputChanged}

          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>

      </form>
    </Modal>

  )
}
