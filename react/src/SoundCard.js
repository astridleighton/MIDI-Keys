import React, { Component } from 'react';
import { ListItem, ListItemIcon, FormControlLabel, Radio } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';



class SoundCard extends Component {

    handleSelect = (event) => {
        const { id, onSelect } = this.props;
        onSelect(id, event.target.value);
    }

    handleFavorite = (event) => {
        const { id, onFavorite } = this.props;
        onFavorite(id, event.target.value);
    }

    render() {
        const { name, id } = this.props;

        return (
            <ListItem>
                <FormControlLabel
                    value={id}
                    control={<Radio onClick={this.handleSelect}/>}
                    label={name}
                />
                <ListItemIcon>
                    <IconButton
                        color="white"
                        onClick={() => this.handleFavorite}>
                            <StarIcon />
                        </IconButton>
                    
                </ListItemIcon>
            </ListItem> 
            
        );
    }

}

export default SoundCard;