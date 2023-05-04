import { Modal, Button } from 'react-bootstrap'

function getDateString(date: Date) : string {
  const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };

  return date.toLocaleDateString(undefined, FORMAT_OPTIONS);
}

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