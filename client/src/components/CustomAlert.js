import React, {useState, useEffect} from 'react'
import Alert from 'react-bootstrap/Alert'
import './css/CustomAlert.css'

export default function CustomAlert (props) {

    const [show, setShow] = useState(props.show);
    const [variant, setVariant] = useState(props.variant);
    const [message, setMessage] = useState(props.message);

    useEffect(() => {
        setShow(props.show);
        setVariant(props.variant);
        setMessage(props.message);
    }, [props.show, props.variant, props.message]);

    const closeAlert = () => {
        props.onClose();
        setShow(false);
    }
    
    if (show) {
    return (
        <div className='alert-container'>
            <Alert variant={props.variant} onClose={closeAlert}  dismissible>
                {props.message}
            </Alert>
        </div>
    );
    } else {
        return (null);
    }
}