import React, { Component } from 'react';
import { ListItem, ListItemIcon, FormControlLabel, Radio, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';

/**
 * Defines a sound on user interface
 */
const SoundCard = (props) => {

    /**
     * Handles user sound selection
     * @param {*}  
     */
    const handleSelect = () => {
        props.onSelect(props.name, props.location);
    }

    /**
     * Handles user favorite selection (add/remove)
     * @param {*} 
     */
    const handleFavorite = () => {
        if (props.isFavorite) { // if already favorite, remove
            props.removeFavorite(props.name);
        } else { // if not favorite, make favorite
            props.addFavorite(props.name);
        }
    }

    /**
     * Renders sound card by displaying radio and star icon
     * @returns 
     */
    return (
            <MenuItem value={'hello'}>
                {props.isLoggedIn && (
                    <IconButton
                        color="white"
                        onClick={handleFavorite}>
                            {props.isFavorite ? <StarIcon style={{ color: 'yellow' }} /> : <StarIcon />}
                    </IconButton>
                )}
            </MenuItem> 
        );
    }

export default SoundCard;