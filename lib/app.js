'use strict';

// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

// Application code is in the lib/ directory
const Resource = require('./resource.js').Resource;
const Requirement = require('./requirement.js').Requirement;

class App extends events.EventEmitter {

    constructor(app_file, res_file) {
        super();
        this.app_file = app_file;
        this.res_file = res_file;
        this.name = null;
        this.rg   = null;
        this.requirements  = [];
        this.all_resources = [];
        this.rg_resources  = [];

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
            this.requirements.push(req);
            console.log(req.toString());
        }
        console.log('' + this.requirements.length + ' requirements loaded from file ' + this.app_file);
    
        jstr = fs.readFileSync(this.res_file).toString();
        data = JSON.parse(jstr);
        for (var i = 0; i < data.length; i++) {
            var res = new Resource(data[i]);
            this.all_resources.push(res);
        }
        console.log('' + this.all_resources.length + ' resources loaded from file ' + this.res_file);
    }

    verify() {
        this.filterResources();
        this.matchRequirements();
    }

    filterResources() {
        for (var i = 0; i < this.all_resources.length; i++) {
            var res = this.all_resources[i];
            if (res.filterRg(this.rg)) {
                this.rg_resources.push(res);
            }
        }
        console.log('' + this.rg_resources.length + ' filterd resources');
    }

    matchRequirements() {

        for (var q = 0; q < this.requirements.length; q++) {
            var req = this.requirements[q];
            for (var r = 0; r < this.rg_resources.length; r++) {
                var res = this.rg_resources[r];
                req.match(res);
            }

        }
    }

}

module.exports.App = App;
