import React, { Component } from 'react';

/**
 * Defines a sound object
 */
class Sound {
    constructor(id, name, location) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.isFavorite = false;
    }
}

export default Sound;