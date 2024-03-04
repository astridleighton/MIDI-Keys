import React, { Component } from 'react';
import { ListItem, ListItemIcon, FormControlLabel, Radio } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';

/**
 * Defines a sound on user interface
 */
class DeviceCard extends Component {

    /**
     * Handles user sound selection
     * @param {*} event 
     */
    handleSelect = (event) => {
        this.props.onSelect(this.props.name);
    }

    /**
     * Renders sound card by displaying radio and star icon
     * @returns 
     */
    render() {
        const { id, name } = this.props;

        return (
            <ListItem
                sx={{
                    borderRadius: '16px',
                    border: '1px solid #ccc',
                    margin: '15px',
                    backgroundColor: '#0C0C0C',
                    color: '#fff'
                }}>
                <FormControlLabel
                    value={id}
                    control={<Radio onClick={this.handleSelect}/>}
                    label={name}
                />
                <ListItemIcon>
                </ListItemIcon>
            </ListItem>
            
        );
    }

}

export default DeviceCard;