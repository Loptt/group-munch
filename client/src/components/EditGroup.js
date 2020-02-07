import React, {useState, useEffect} from 'react';
import './css/NewGroup.css'
import {SERVER_URL} from '../config'
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import CustomAlert from './CustomAlert'

export default function EditGroup (props) {

    const [name, setName] = useState(props.group.name);
    const [desc, setDesc] = useState(props.group.description);
    const [group, setGroup] = useState(props.group);

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        checkLogin();
        document.getElementById('editName').value = group.name;
        document.getElementById('editDesc').value = group.description;
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
        props.history.push('/login');
        props.logout();
    }
    
    const handleSubmit = event => {
        event.preventDefault();

        let url = `${SERVER_URL}/api/groups/update/${group._id}`;
        let settings = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + props.user.token
            },
            
            body: JSON.stringify({
                name: name,
                description: desc,
                manager_id: group.manager
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
                props.group.name = name;
                props.group.description = desc;
                props.history.push('/view/group');
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleCancel = event => {
        props.history.push('/view/group');
    }

    const onNameChange = event => {
        setName(event.target.value);
    }

    const onDescChange = event => {
        setDesc(event.target.value);
    }

    const handleEditProfile = () => {
        props.history.push('/edit/profile');
    }

    return (
        <div className='app-container-x'>
            <Navigation {...props} user={props.user} handleLogout={handleLogout} handleEditProfile={handleEditProfile}/>
            <Container>
                <CustomAlert variant={alertVariant} message={alertMessage} show={showAlert} onClose={onCloseAlert}/>
                <h1 className="title">
                    Edit Group
                </h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control id='editName' type="text" placeholder="Name" onChange={onNameChange} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control id='editDesc' as="textarea" placeholder="Description" rows="3" onChange={onDescChange} required />
                    </Form.Group>
                    <Button variant="flat" bg="flat" type="submit">
                        Save
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