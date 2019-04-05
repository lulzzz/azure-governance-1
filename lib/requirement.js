'use strict';

// Instances of this class represent an "Architecture Blueprint Requirement"
// that looks like this:
// {
//     "type": "Microsoft.ContainerRegistry/registries",
//     "location": "eastus",
//     "sku_tier": "Standard",
//     "tags": {"app": "app1"}
// }
//
// Chris Joakim, Microsoft, 2019/04/04

const fs     = require('fs');
const events = require('events');

class Requirement extends events.EventEmitter {

    constructor(data) {
        super();
        this.data = data;
        this.data['matching_resource'] = null;
    }

    // Setter methods

    setSeq(n) {
        this.data['seq'] = n;
    }

    setAppName(name) {
        this.data['app_name'] = name;
    }

    setAppRg(rg) {
        this.data['app_rg'] = rg;
    }

    setMatchingResource(res) {
        this.data['matching_resource'] = res;
    }

    // Getter methods

    seq() {
        return this.data['seq'];   
    }

    type() {
        return this.data['type'];
    }

    location() {
        return this.data['location'];
    }

    sku_tier() {
        return this.data['sku_tier'];
    }

    tags() {
        return this.data['tags'];  // an object with key-value pairs like {"app": "app1"}
    }
    
    matchingResource() {
        return this.data['matching_resource'];
    }

    // main matching logic

    match(res) {
        if (res.matched()) {
            // it already matches a previous requirement, so don't match it to another requirement
            //console.log('resource already matched to requirement ' + res.matching_requirement_seq());
        }
        else {
            if (this.matchType(res)) {
                if (this.matchLocation(res)) {
                    if (this.matchSkuTier(res)) {
                        if (this.matchTags(res)) {
                            // match the requirement and the resource to each other
                            this.setMatchingResource(res);
                            res.setMatchingRequirement(this);
                            console.log(`req ${this.seq()} - matched to resource; ${res.id()}`);
                        }
                    }
                }
            }
        }
    }

    matchType(res) {
        if (this.type() === res.type()) {
            console.log(`requirement ${this.seq()} - matched type; ${this.type()}`);
            return true;
        }
        else {
            return false;
        }
    }

    matchLocation(res) {
        if (this.location() === res.location()) {
            console.log(`requirement ${this.seq()} - matched location; ${this.location()}`);
            return true;
        }
        else {
            return false;
        }
    }

    matchSkuTier(res) {
        if (this.sku_tier() === res.sku_tier()) {
            console.log(`requirement ${this.seq()} - matched sku_tier; ${this.sku_tier()}`);
            return true;
        }
        else {
            return false;
        }
    }

    matchTags(res) {
        var tag_names = Object.keys(this.tags());
        var matched = true;
        for (var i = 0; i < tag_names.length; i++) {
            var tag_name = tag_names[i];
            var tag_value = this.tags()[tag_name];
            if (res.hasTag(tag_name, tag_value)) {
                // matched
            }
            else {
                matched = false;
            }

        }
        if (matched) {
            console.log(`requirement ${this.seq()} - matched tags; ${JSON.stringify(this.tags())}`);
        }
        else {
            console.log(`requirement ${this.seq()} - tags NOT matched; ${JSON.stringify(this.tags())} -> ${JSON.stringify(res.tags())}`); 
        }
        return matched;
    }

    // representation methods

    toString() {
        return JSON.stringify(this.data, null, 2);
    }
}

module.exports.Requirement = Requirement;
