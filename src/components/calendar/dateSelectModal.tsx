import { Modal, Button } from 'react-bootstrap'

/**
 * Formats the Date-object to a human readable format.
 * @param date Date to show in the modal window.
 * @returns String formatted date using the options provided.
 * @author Sebastian Ledung
 */
function getDateString(date: Date) : string {
  const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };

  return date.toLocaleDateString(undefined, FORMAT_OPTIONS);
}

/**
 * Up-shifts the useState to the component using this object,
 * the component importing controls the date & state of the modal.
 * @author Sebastian Ledung
 */
interface Props {  
  modalShow: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setModalShow: (show: boolean) => void;
}

function DateSelectModal(props: Props) {

  function toggleModal() {
    props.setModalShow(!props.setModalShow);
  }

  return (
    <Modal show={props.modalShow} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{"Tider för " + getDateString(props.selectedDate)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, youre reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Close
        </Button>
        <Button variant="primary" onClick={toggleModal}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DateSelectModal;