import React, {useState, useEffect} from 'react';
import './css/NewGroup.css'
import {SERVER_URL} from '../config'
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

export default function EditPlace (props) {

    const [place, setPlace] = useState(props.place);
    const [name, setName] = useState(props.place.name);
    const [price, setPrice] = useState(props.place.priceCategory);
    const [dist, setDist] = useState(props.place.distanceCategory);

    const editNamePlace = React.createRef();
    const editDistPlace = React.createRef();
    const editPricePlace = React.createRef();

    useEffect(() => {
        editNamePlace.current.value = place.name;
        editDistPlace.current.value = place.distanceCategory;
        editPricePlace.current.value = place.priceCategory;
    }, []);

    const onNameChange = event => {
        setName(event.target.value);
    }

    const onDistChange = event => {
        setDist(event.target.value);
    }

    const onPriceChange = event => {
        setPrice(event.target.value);
    }
   
    const handleSubmit = event => {
        event.preventDefault();

        let url = `${SERVER_URL}/api/places/update/${place._id}`;
        let settings = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + props.user.token
            },
            body: JSON.stringify({
                name: name,
                distanceCategory: dist,
                priceCategory: price,
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
                props.updatePlace();
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleDelete = event => {
        let url = `${SERVER_URL}/api/places/delete/${place._id}`;
        let settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + props.user.token
            },
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    console.log('Deleted..');
                    props.updatePlace();
                }

                throw new Error(response);
            })
            .catch(error => {
                console.log(error);
                console.log(error.statusText);
            })
    }

    const handleCancel = event => {
        props.cancelEditEvent();
    }

    return (
        <div>
            <Form className='add-place-form'>
                <Form.Group>
                    <Form.Control ref={editNamePlace} type="text" placeholder="Name" onChange={onNameChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Distance</Form.Label>
                    <Form.Control ref={editDistPlace} className='editDistPlace' as="select" onChange={onDistChange}>
                        <option value={1}>Close</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Far</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control ref={editPricePlace} className='editPricePlace' as="select" onChange={onPriceChange}>
                        <option value={1}>Cheap</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Expensive</option>
                    </Form.Control>
                </Form.Group>
                <Button onClick={handleSubmit} variant='flat' bg='flat' className='save-btn mx-4 mb-3'>Save place</Button>
                <Button onClick={handleDelete} variant='outline-danger' bg='flat' className="mx-4 mb-3">Delete</Button>
                <p className="cancel-member" onClick={handleCancel}>Cancel</p>
            </Form>
            <style type="text/css">
                {`
                .save-btn {
                    background-color: #30e3ca;
                }

                `}
            </style>
        </div>
    )
}