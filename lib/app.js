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
            //console.log(req.toString());
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
        this.printSummaryReports();
    }

    filterResources() {
        for (var i = 0; i < this.all_resources.length; i++) {
            var res = this.all_resources[i];
            if (res.filterRg(this.rg)) {
                this.rg_resources.push(res);
            }
        }
        console.log('' + this.rg_resources.length + ' filtered resources in rg');
    }

    matchRequirements() {
        console.log('matching requirements to resources...');
        for (var q = 0; q < this.requirements.length; q++) {
            var req = this.requirements[q];
            for (var s = 0; s < this.rg_resources.length; s++) {
                var res = this.rg_resources[s];
                req.match(res);
            }
        }
    }

    printSummaryReports() {
        console.log("\n\n");
        console.log('Summary Report - Requirements to Resources');
        for (var i = 0; i < this.requirements.length; i++) {
            var req = this.requirements[i];
            var res = req.matchingResource();
            if (res != null) {
                console.log(`requirement ${req.seq()} ${req.type()} - matched to resource:`);
                console.log('              ' + res.id());
            }
            else {
                console.log(`requirement ${req.seq()} ${req.type()} - NOT matched to a resource`);
            }
        }

        console.log("\n\n");
        console.log('Summary Report - Resources to Requirements');
        for (var i = 0; i < this.rg_resources.length; i++) {
            var res = this.rg_resources[i];
            if (res.matched()) {
                console.log(`resource matched to a requirement: ` + res.matching_requirement_seq());
                console.log('              ' + res.id());
            }
            else {
                console.log(`resource NOT matched to a requirement:`);
                console.log('              ' + res.id());
            }
        }
        console.log("\n");
    }

}

module.exports.App = App;
