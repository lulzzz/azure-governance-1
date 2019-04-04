'use strict';

// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

class Resource extends events.EventEmitter {

    constructor() {
        super();
    }

    create_container(cname) {

    }
}

module.exports.Resource = Resource;
