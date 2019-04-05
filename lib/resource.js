'use strict';

// Instances of this class represent a Resource in Azure, represented by
// JSON from the CLI that looks like this:
// {
//     "id": "/subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ContainerRegistry/registries/cjoakimacr",
//     "identity": null,
//     "kind": null,
//     "location": "eastus",
//     "managedBy": null,
//     "name": "cjoakimacr",
//     "plan": null,
//     "properties": null,
//     "resourceGroup": "cjoakim-core",
//     "sku": {
//       "capacity": null,
//       "family": null,
//       "model": null,
//       "name": "Standard",
//       "size": null,
//       "tier": "Standard"
//     },
//     "tags": {
//       "app": "app1"
//     },
//     "type": "Microsoft.ContainerRegistry/registries"
//   },
//
// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

class Resource extends events.EventEmitter {

    constructor(data) {
        super();
        this.data = data;
        this.data['in_rg'] = false;
        this.data['matching_requirement'] = null;
        this.data['matching_requirement_seq'] = 0;
    }

    // Setter methods

    setMatchingRequirement(req) {
        this.data['matching_requirement'] = req;
        this.data['matching_requirement_seq'] = req.seq();
    }

    // Getter methods

    matched() {
        return this.matching_requirement_seq() > 0;
    }

    matching_requirement_seq() {
        return this.data['matching_requirement_seq']; 
    }

    id() {
        return this.data['id'];
    }

    type() {
        return this.data['type'];
    }

    location() {
        return this.data['location'];
    }

    sku_tier() {
        return this.data['sku']['tier'];
    }

    tags() {
        return this.data['tags'];
    }

    rg() {
        return this.data['resourceGroup'] 
    }

    // logic 

    hasTag(req_name, req_value) {
        var tag_names = Object.keys(this.tags());
        for (var i = 0; i < tag_names.length; i++) {
            var tag_name = tag_names[i];
            var tag_value = this.tags()[tag_name];
            if (tag_name === req_name) {
                if (tag_value === req_value) {
                    return true;
                }
            }
        }
        return false;
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

    // representation methods

    toString() {
        return JSON.stringify(this.data, null, 2);
    }
}

module.exports.Resource = Resource;
