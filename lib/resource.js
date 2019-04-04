'use strict';

// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

class Resource extends events.EventEmitter {

    constructor(data) {
        super();
        this.data = data;
        this.data['in_rg'] = false;
    }

    rg() {
        return this.data['resourceGroup'] 
    }

    filterRg(rg) {
        //console.log('filterRg: ' + rg + ' ' + this.rg());
        if (rg === this.rg()) {
            this.data['in_app_rg'] = true;
        }
        else {
            this.data['in_app_rg'] = false;
        }
        return this.data['in_app_rg'];
    }

    toString() {
        return JSON.stringify(this.data, null, 2);
    }
}

module.exports.Resource = Resource;
