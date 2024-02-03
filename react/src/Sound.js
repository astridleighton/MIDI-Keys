import React, { Component } from 'react';

class Sound {
    constructor(id, name, location) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.isFavorited = false;
    }
}

export default Sound;