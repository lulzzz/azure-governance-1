'use strict';

// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

// Application code is in the lib/ directory
const Resource = require('./resource.js').Resource;
const Requirement = require('./requirement.js').Requirement;

class App extends events.EventEmitter {

    constructor(app_file) {
        super();
        this.app_file = app_file;
        this.name = null;
        this.rg   = null;
        this.requirements = [];

        var jstr = fs.readFileSync(this.app_file).toString();
        var data = JSON.parse(jstr);

        // TODO - validation of the app_file json contents
        this.name = data['name'];
        this.rg = data['resource_group'];

        for (var i = 0; i < data['requirements'].length; i++) {
            var req = new Requirement(data['requirements'][i]);
            req.setSeq(i + 1);
            req.setAppName(this.name);
            req.setAppRg(this.rg);
            console.log(req.toString());
        }
    }

    create_container(cname) {

    }
}

module.exports.App = App;
