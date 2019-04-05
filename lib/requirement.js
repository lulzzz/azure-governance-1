'use strict';

// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

class Requirement extends events.EventEmitter {

    constructor(data) {
        super();
        this.data = data;
    }

    setSeq(n) {
        this.data['seq'] = n;
    }

    setAppName(name) {
        this.data['app_name'] = name;
    }

    setAppRg(rg) {
        this.data['app_rg'] = rg;
    }

    match(res) {
        
    }

    toString() {
        return JSON.stringify(this.data, null, 2);
    }
}

module.exports.Requirement = Requirement;
