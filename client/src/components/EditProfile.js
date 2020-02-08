import React, {useState, useEffect} from 'react'
import {SERVER_URL} from '../config'
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import CustomAlert from './CustomAlert'

export default function EditProfile (props) {

    const [fName, setFName] = useState(props.user.fName);
    const [lName, setLName] = useState(props.user.lName);

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const editFNameUser = React.createRef();
    const editLNameUser = React.createRef();

    useEffect(() => {
        checkLogin();
        if (props.user == undefined) {
            props.history.push('/');
        }
        editFNameUser.current.value = props.user.fName;
        editLNameUser.current.value = props.user.lName;
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

    const handleSubmit = e => {
        e.preventDefault();

        let url = `${SERVER_URL}/api/users/update/${props.user.id}`;
        let settings = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + props.user.token
            },
            
            body: JSON.stringify({
                firstName: fName,
                lastName: lName
            })
        }

        console.log(fName + "   "+lName);

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error('No jala');
            })
            .then(responseJSON => {
                console.log(responseJSON);
                props.updateUserNames(fName, lName);
                props.history.push('/');
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleCancel = e => {
        props.history.push('/');
    }

    const handleEditProfile = () => {
        props.history.push('/edit/profile');
    }

    return (
        <>
            <div className='app-container-x'>
            <Navigation {...props} user={props.user} handleLogout={handleLogout} handleEditProfile={handleEditProfile}/>
            <Container>
                <CustomAlert variant={alertVariant} message={alertMessage} show={showAlert} onClose={onCloseAlert}/>
                <h1 className="title">
                    Edit Profile
                </h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control ref={editFNameUser} type="text" placeholder="First Name" onChange={e => setFName(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control ref={editLNameUser} type='text' placeholder="Last Name" onChange={e => setLName(e.target.value)} required />
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
        </>
    )
}