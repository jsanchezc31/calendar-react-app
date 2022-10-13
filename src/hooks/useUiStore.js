import { useDispatch, useSelector } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store/ui/uiSlice";


// * hook para no tener que importar los dispatch o los useSelector desde diferentes sitios
export const useUiStore = () => {

  const dispatch = useDispatch();

  const { isDateModalOpen } = useSelector(state => state.ui);

  const openDateModal = () => {
    dispatch(onOpenDateModal());
  }

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  const toggleDateModal = () => {
    (isDateModalOpen)
      ? openDateModal()
      : closeDateModal();
  }

  return {
    // Propiedades
    isDateModalOpen,
    // Metodos
    openDateModal,
    closeDateModal
  }
};