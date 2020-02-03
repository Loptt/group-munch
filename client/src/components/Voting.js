import React, {useState, useEffect} from 'react'
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import {SERVER_URL} from '../config'

export default function Voting (props) {

    const [showNewVoting, setShowNewVoting] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('00:00');
    const [group, setGroup] = useState(props.group);
    const [votingActive, setVotingActive] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({});
    const [anyEvent, setAnyEvent] = useState(true);
    const [places, setPlaces] = useState(props.places);
    const [winner, setWinner] = useState('');
    const [showVote, setShowVote] = useState(true);

    useEffect(() => {
        fetchRecentVotingEvent();
        fetchPlaces();
    }, [])

    useEffect(() => {
        setPlaces(props.places)
    }, [props.places]);

    const onNewVotingClick = (event) => {
        setShowNewVoting(!showNewVoting);
    }

    const fetchPlaces = () => {
        let url = `${SERVER_URL}/api/places/groups/${group._id}`;
        let settings = {
            method: 'GET'
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                console.log(responseJSON);
                setPlaces(responseJSON);
            })
            .catch(error => {
                props.voteAlert('danger', 'Error getting places');
                console.log(error);
            })
    }

    const getWinnerName = (place_id) => {
        let url = `${SERVER_URL}/api/places/${place_id}`;
        let settings = {
            method: 'GET'
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                console.log(responseJSON);
                setWinner(responseJSON.name);
            })
            .catch(error => {
                props.voteAlert('danger', 'Error getting winner');
                console.log(error);
            })
    }

    const handleFetchedVotingEvent = (fetchedEvent) => {
        if (fetchedEvent == null || fetchedEvent == undefined) {
            setVotingActive(false);
            setAnyEvent(false);
            return;
        }
        let currentDate = new Date();
        let votingDate = new Date(fetchedEvent.dateTimeEnd);

        if (votingDate > currentDate && !fetchedEvent.finished) {
            setVotingActive(true);

            fetchedEvent.votes.forEach(v => {
                if (v.user === props.user.id) {
                    setShowVote(false);
                }
            })
        } else {
            setVotingActive(false);
            if (fetchedEvent.winner) {
                getWinnerName(fetchedEvent.winner);
            }
        }

        setCurrentEvent(fetchedEvent);
    }

    const fetchRecentVotingEvent = () => {
        let url = `${SERVER_URL}/api/votingevents/groups/${group._id}/recent`;
        let settings = {
            method: 'GET'
        };

        
        fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }            
                throw new Error('PEEEP');
            })
            .then(responseJSON => {
                console.log(responseJSON);
                handleFetchedVotingEvent(responseJSON);
            })
            .catch(error => {
                props.voteAlert('danger', 'Error getting current voting event');
                console.log(error);
                setVotingActive(false);
            })
    }

    const handleNewVotingEvent = (event) => {
        let updatedDate = date;

        updatedDate.setHours(time.substring(0,2), time.substring(3));

        let currentDate = new Date();
        if (updatedDate < currentDate) {
            props.voteAlert('danger', 'Cannot create a voting event in the past!');
            return;
        }

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
                fetchRecentVotingEvent();
                setShowNewVoting(false);
                props.voteAlert('success', 'Voting event created');
                setAnyEvent(true);
                /*setShowNewVoting(false);
                setVotingActive(true);
                setCurrentEvent(responseJSON);*/
                console.log(responseJSON);
            })
            .catch(error => {
                setAnyEvent(false);
                props.voteAlert('danger', 'Error creating new voting event');
                console.log(error);
            })
    }

    const castVote = (event) => {
        let id = event.target.value;

        let date = new Date();

        console.log("voting");

        let url = `${SERVER_URL}/api/votingevents/${currentEvent._id}/cast_vote`;
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: props.user.id,
                place_id: id
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
                console.log('Voted');
                props.voteAlert('success', 'Vote casted successfully');
                fetchRecentVotingEvent();
            })
            .catch(error => {
                props.voteAlert('danger', 'Error casting vote');
                console.log(error);
            })
    }

    const newVoteForm = () => {
        return (
            <div className='mt-3 rounded border'>
                <div className='my-3'>
                    <Form.Label className='mr-3'>End date</Form.Label>
                    <DatePicker
                        onChange={(newDate) => setDate(newDate)}
                        value={date}
                    />
                </div>
                <div className='my-3'>
                    <Form.Label className='mr-3'>End Time</Form.Label>
                    <TimePicker
                        onChange={(newTime) => setTime(newTime)}
                        value={time}
                    />
                </div>
                <div>
                    <Button className='highlight-btn my-3' variant='flat' bg='flat' onClick={handleNewVotingEvent}>Create</Button>
                </div>
            </div>
        )
    }

    const noVoting = () => {
        return (
            <div>
                {!anyEvent ? <h4 className="my-4 py-4">No voting events yet</h4>
                :<div>
                    <p>Date: {currentEvent.dateTimeEnd}</p>
                    <p>Winner: {winner}</p>
                </div>
                }   
                <Button variant='flat'
                bg='flat' 
                className={(showNewVoting ? 'vote-btn' : 'highlight-btn') + ' mb-3'}
                onClick={onNewVotingClick}>
                        {showNewVoting ? "Hide" : "New Voting Event"}
                </Button>
                {showNewVoting ? newVoteForm() : null} 
            </div>
        )
    }

    const yesVoting = () => {
        return (
            <div>
                <ListGroup>
                    {places.map((place, i) => {
                        return (
                            <ListGroup.Item action>
                                <span className='mr-4'>{place.name}</span>
                                {showVote ?
                                <Button onClick={castVote} className='vote-btn ml-4'
                                    variant='flat' 
                                    bg='flat' 
                                    size='sm' 
                                    value={place._id}>
                                        Choose
                                </Button>
                                : null}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
        )
    }

    return (
        <div className='mb-4'>
            <h2>{votingActive ? "Vote Now!" : "Latest Vote"}</h2>
            {votingActive ? yesVoting() : noVoting()}
            
            <style type="text/css">
                {`
                .highlight-btn {
                    background-color: #30e3ca;
                }
                .vote-btn {
                    background-color: #e4f9f5;
                }
                `}
            </style>
        </div>
    )   
}