import axios from 'axios';
// import { Sound } from './types';

// TODO: convert this back to typescript

class SoundService {

    /*public */async getAllSounds()/*: Promise<Sound[] | null>*/ {
        try {
            const result = await axios.get('http://localhost:3000/all-sounds');
            if (result.status === 200) {
                const sounds/*: Sound[]*/ = result.data.map(sound => ({
                    id: sound.id,
                    name: sound.name,
                    location: sound.source,
                    isFavorite: sound.isFavorite
                }));
                    return sounds;
            } else {
                console.log("Error");
                return null;
            }

        } catch (error) {
            console.error("Could not get sounds from database.", error);
            return null;
        }
    }

    /*public */async getAllFavorites(token/*: string*/, sounds/*: Sound[]*/)/*: Promise<Sound[] | null>*/ {

        try {
            const result = await axios.get('http://localhost:3000/all-favorites', {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
            
                if(result.data.length > 0) {
                    const favorites/*: Sound[]*/ = result.data.map(sound => ({
                        id: sound.id,
                        name: sound.name,
                        location: sound.source,
                        isFavorite: sound.isFavorite
                    }));

                    for(let i = 0; i < sounds.length; i++) {
                        const matchingFavorite = favorites.find(favorite => favorite.id === sounds[i].id);

                        if(matchingFavorite) {
                            sounds[i].isFavorite = true;
                        }
                    }
                }
                return sounds;
        } catch (error/*:any*/) {
            if (error.status === 403 || error.status === 401) {
                console.log("Unauthorized to load samples");
            } else {
                console.log("No favorites to show.");
            }
            return sounds;
        }
    }

    /*public */async addFavorite(token/*: string*/, soundName/*: string*/, sounds/*: Sound[] | null*/)/*: Promise<Sound[] | null>*/ {
        try {

            if(!sounds) {
                return null;
            }
            const response = await axios.post(`http://localhost:3000/add-favorite/${soundName}`, null, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log(response);
    
            for (let i = 0; i < sounds.length; i++) {
                if (sounds[i].name === soundName) {
                    sounds[i].isFavorite = true;
                    break; // Once found, exit the loop
                }
            }    
        } catch (error) {
            console.log(error);
        } finally {
            return sounds;
        }
    }

    /*public */async removeFavorite(token/*: string*/, soundName/*: string*/, sounds/*: Sound[] | null*/)/*: Promise<Sound[] | null>*/ {
        try {

            if(!sounds) {
                return null;
            }
            const response = await axios.post(`http://localhost:3000/add-favorite/${soundName}`, null, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log(response);
    
            for (let i = 0; i < sounds.length; i++) {
                if (sounds[i].name === soundName) {
                    sounds[i].isFavorite = false;
                    break; // Once found, exit the loop
                }
            }    
        } catch (error) {
            console.log(error);
        } finally {
            return sounds;
        }
    }
}

export default SoundService;