import React, { Component } from 'react';
import { ListItemButton } from '@mui/material';

class SoundCard extends Component {

    render() {
        const { sound } = this.props;

        return (
            <ListItemButton>
                {/*<li key={sound.id} className="list-group-item list-group-item action d-flex justify-content-between flex-column align-items-start p-3 w-100" style={{ backgroundColor: 'black', padding: '5px', borderRadius: '5px' }}>
                <div className="form-check">
                    <input 
                        type="radio"
                        className="form-check-input"
                        name="soundSelection"
                        style={{ backgroundColor: 'grey', marginRight: '5px' }}
                    />
                    <label className="form-check-label text-white">[{sound.id}] {sound.name}, URL: {sound.location}</label>
                </div>
        </li>*/}
            </ListItemButton>
            
        );
    }

}

export default SoundCard;