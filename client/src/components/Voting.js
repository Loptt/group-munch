import React from 'react'
import Button from 'react-bootstrap/Button';

export default function Voting (props) {

    const [showNewVoting, setShowNewVoting] = useState(false);
    return (
        <div className='mb-4'>
            <h2>Voting</h2>
            <Button variant='flat' bg='flat' className='highlight-btn'>New Voting Event</Button>
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