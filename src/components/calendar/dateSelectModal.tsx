import { Modal, Button } from 'react-bootstrap'
import { useState } from 'react'

function DateSelectModal() {

    function toggleModal() {
        SET_MODAL_SHOW(!MODAL_SHOW);
    }

    function selectDate(date: Date) {
        SET_SELECTED_DATE(date);
    }

    const [MODAL_SHOW, SET_MODAL_SHOW] = useState(false);
    const [SELECTED_DATE, SET_SELECTED_DATE] = useState(new Date());

    return (

    );
}

export default DateSelectModal;