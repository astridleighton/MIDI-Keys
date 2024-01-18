import React from 'react';
import { Card } from 'react-bootstrap';

/**
 * Not set up yet
 */
class SoundCard extends React.Component
{
    render()
    {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>{this.props.sound}</Card.Title>
                    <Card.Text>Text</Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default SoundCard;