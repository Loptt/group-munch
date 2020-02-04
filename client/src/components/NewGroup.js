import React, {useState, useEffect} from 'react';
import './css/NewGroup.css'
import {SERVER_URL} from '../config'
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import CustomAlert from './CustomAlert'

export default function NewGroup (props) {

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = () => {
        if (!props.loggedIn) {
            props.history.push("/login");
        }
    }

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    const handleLogout = () => {
        props.logout();
    }
    
    const handleSubmit = event => {
        event.preventDefault();

        let url = `${SERVER_URL}/api/groups/create`;
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + props.user.token
            },
            body: JSON.stringify({
                name: name,
                description: desc,
                manager_id: props.user.id
            })
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error();
            })
            .then(responseJSON => {
                console.log(responseJSON);
                props.history.push('/');
            })
            .catch(error => {
                console.log(error);
            })
    }

    const onNameChange = event => {
        setName(event.target.value);
    }

    const onDescChange = event => {
        setDesc(event.target.value);
    }

    const handleCancel = event => {
        props.history.push('/view/group');
    }

    return (
        <div className='app-container-x'>
            <Navigation user={props.user} handleLogout={handleLogout}/>
            <Container>
                <CustomAlert variant={alertVariant} message={alertMessage} show={showAlert} onClose={onCloseAlert}/>
                <h1 className="title">
                    Create new Group
                </h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Name" onChange={onNameChange} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="textarea" placeholder="Description" rows="3" onChange={onDescChange} required />
                    </Form.Group>
                    <Button variant="flat" bg="flat" type="submit">
                        Create
                    </Button>
                </Form>
                <p className="cancel-group-edit cancel-member" onClick={handleCancel}>Cancel</p>
            </Container>
            <style type="text/css">
                {`
                .btn-flat {
                    background-color: #30e3ca;
                }
                `}
            </style>
        </div>
    )
}