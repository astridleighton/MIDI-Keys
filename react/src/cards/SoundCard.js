/* import React, { Component } from 'react';
import { ListItem, ListItemIcon, FormControlLabel, Radio } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star'; */

/**
 * Defines a sound on user interface
 */
/* class SoundCard extends Component {

    /**
     * Handles user sound selection
     * @param {*}  
     */
    /* handleSelect = () => {
        this.props.onSelect(this.props.name, this.props.location);
    } */

    /**
     * Handles user favorite selection (add/remove)
     * @param {*} 
     */
    /* handleFavorite = () => {
        if (this.props.isFavorite) { // if already favorite, remove
            this.props.removeFavorite(this.props.name);
        } else { // if not favorite, make favorite
            this.props.addFavorite(this.props.name);
        }
    } */

    /**
     * Renders sound card by displaying radio and star icon
     * @returns 
     */
    /* render() {
        const { name, id, isLoggedIn, isFavorite } = this.props;

        return (
            <ListItem>
                <FormControlLabel
                    value={id}
                    control={<Radio onClick={this.handleSelect}/>}
                    label={name}
                />
                <ListItemIcon>
                    {isLoggedIn && (
                        <IconButton
                            color="white"
                            onClick={this.handleFavorite}>
                                {isFavorite ? <StarIcon style={{ color: 'yellow' }} /> : <StarIcon />} {/* Render filled star if favorited, otherwise render empty star */ /* }
                        </IconButton>
                    )}
                </ListItemIcon>
            </ListItem> 
            
        );
    }

}

export default SoundCard; */