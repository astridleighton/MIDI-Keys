import React, { Component } from 'react';
import { ListItem, ListItemIcon, FormControlLabel, Radio } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';



class SoundCard extends Component {

    handleSelect = (event) => {
        const { id, onSelect } = this.props;
        this.props.onSelect(this.props.name, this.props.location);
    }

    handleFavorite = (event) => {
        if (this.props.isFavorite) { // if already favorite, remove
            this.props.addFavorite(this.props.name);
        } else { // if not favorite, make favorite
            this.props.removeFavorite(this.props.name);
        }
    }

    render() {
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
                                {isFavorite ? <StarIcon /> : <StarIcon style={{ color: 'yellow' }} />} {/* Render filled star if favorited, otherwise render empty star */}
                        </IconButton>
                    )}
                </ListItemIcon>
            </ListItem> 
            
        );
    }

}

export default SoundCard;