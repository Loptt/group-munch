import React, {useState} from 'react'
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {SERVER_URL} from '../config'

export default function Voting (props) {

    const [showNewVoting, setShowNewVoting] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('00:00');
    const [group, setGroup] = useState(props.group);

    const onNewVotingClick = (event) => {
        setShowNewVoting(!showNewVoting);
    }

    const handleNewVotingEvent = (event) => {
        let updatedDate = date;

        updatedDate.setHours(time.substring(0,2), time.substring(3));

        let url = `${SERVER_URL}/api/votingevents/create`;
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                group: group._id,
                dateTimeEnd: updatedDate
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
            })
            .catch(error => {
                console.log(error);
            })
    }

    const newVoteForm = () => {
        return (
            <div className='mt-3'>
                <div>
                    <Form.Label className='mr-3'>End date</Form.Label>
                    <DatePicker
                        onChange={(newDate) => setDate(newDate)}
                        value={date}
                    />
                </div>
                <div>
                    <Form.Label className='mr-3'>End Time</Form.Label>
                    <TimePicker
                        onChange={(newTime) => setTime(newTime)}
                        value={time}
                    />
                </div>
                <div>
                    <Button onClick={handleNewVotingEvent}>Create</Button>
                </div>
            </div>
        )
    }

    return (
        <div className='mb-4'>
            <h2>Voting</h2>
            <Button variant='flat' bg='flat' className='highlight-btn' onClick={onNewVotingClick}>New Voting Event</Button>
            {showNewVoting ? newVoteForm() : null}
            <style type="text/css">
                {`
                .highlight-btn {
                    background-color: #30e3ca;
                }
                `}
            </style>
        </div>
    )   
}