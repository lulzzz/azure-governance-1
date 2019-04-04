'use strict';

// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

class Resource extends events.EventEmitter {

    constructor(data) {
        super();
        this.data = data;
    }

    toString() {
        return JSON.stringify(this.data, null, 2);
    }
}

module.exports.Resource = Resource;
