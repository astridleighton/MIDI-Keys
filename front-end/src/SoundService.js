"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class SoundService {
    getAllSounds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield axios_1.default.get('http://localhost:3000/all-sounds');
                if (result.status === 200) {
                    const sounds = result.data.map(sound => ({
                        id: sound.id,
                        name: sound.name,
                        location: sound.source,
                        isFavorite: sound.isFavorite
                    }));
                    console.log(sounds);
                    /* if(isAuthenticated) {
                        return getAllFavorites(sounds);
                    } else { */
                    return sounds;
                    // }
                }
                else {
                    console.log("Error");
                    return null;
                }
            }
            catch (error) {
                console.error("Could not get sounds from database.", error);
                return null;
            }
        });
    }
    getAllFavorites(token, sounds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield axios_1.default.get('http://localhost:3000/all-favorites', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (result.data.length > 0) {
                    const favorites = result.data.map(sound => ({
                        id: sound.id,
                        name: sound.name,
                        location: sound.source,
                        isFavorite: sound.isFavorite
                    }));
                    for (let i = 0; i < sounds.length; i++) {
                        const matchingFavorite = favorites.find(favorite => favorite.id === sounds[i].id);
                        if (matchingFavorite) {
                            sounds[i].isFavorite = true;
                        }
                    }
                }
                return sounds;
            }
            catch (error) {
                if (error.status === 403 || error.status === 401) {
                    console.log("Unauthorized to load samples");
                }
                else {
                    console.log("No favorites to show.");
                }
                return sounds;
            }
        });
    }
    addFavorite(token, soundName, sounds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sounds) {
                    return null;
                }
                const response = yield axios_1.default.post(`http://localhost:3000/add-favorite/${soundName}`, null, {
                    headers: {
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
            }
            catch (error) {
                console.log(error);
            }
            finally {
                return sounds;
            }
        });
    }
    removeFavorite(token, soundName, sounds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sounds) {
                    return null;
                }
                const response = yield axios_1.default.post(`http://localhost:3000/add-favorite/${soundName}`, null, {
                    headers: {
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
            }
            catch (error) {
                console.log(error);
            }
            finally {
                return sounds;
            }
        });
    }
}
exports.default = SoundService;
