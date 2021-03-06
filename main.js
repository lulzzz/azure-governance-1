// Program for Azure Resources
// Chris Joakim, Microsoft, 2019/04/04

const fs = require("fs");
const util = require("util");

const msRestAzure = require('ms-rest-azure');
const resourceManagement = require("azure-arm-resource");

// Application code is in the lib/ directory
const App = require('./lib/app.js').App;
const Resource = require('./lib/resource.js').Resource;
const Requirement = require('./lib/requirement.js').Requirement;

// main() entry-point logic

if (process.argv.length < 3) {
    console.log("Invalid program args; please specify a runtime function as follows:");
    console.log("node main.js verify_application designs/app1.json data/resource-list.json");
    console.log("node main.js list_subscription_resources");
    console.log("");
    process.exit();
}
else {
    cli_function = process.argv[2];

    switch(cli_function) {

        case 'verify_application':
            var app_file = process.argv[3];
            var res_file = process.argv[4];
            verify_application(app_file, res_file);
            break; 

        case 'list_subscription_resources':
            list_subscription_resources();
            break; 

        default:
            console.log("error, unknown cli function: " + cli_function);
    }
}

// top level functions called from main

function verify_application(app_file, res_file) {
    console.log('verify_application: ' + app_file + ' from resources ' + res_file);
    var app = new App(app_file, res_file);
    app.verify();
}


function list_subscription_resources() {
    var subscr_id = process.env.AZURE_SUBSCRIPTION_ID;
    console.log("list_subscription_resources; subscription: " + subscr_id);

    // Interactive Login at https://microsoft.com/devicelogin with given code 
    msRestAzure.interactiveLogin(function(err, credentials) {
        console.log('credentials: ' + credentials);
        var client = new resourceManagement.ResourceManagementClient(credentials, subscr_id);
        client.resources.list(function(err, result) {
        if (err) console.log(err);

        var jstr = JSON.stringify(result, null, 2);
        console.log(jstr);
        var outfile = 'tmp/subscr_' + subscr_id + '.json';
        fs.writeFileSync(outfile, jstr);
        console.log('file written: ' + outfile);
        });
    });
}

function list_resource_group_resources(rg) {
    var subscr_id = process.env.AZURE_SUBSCRIPTION_ID;
    console.log("list_resource_group_resources; subscription: " + subscr_id + "  rg: " + rg);

    msRestAzure.interactiveLogin().then((credentials) => {
        let client = new SearchManagement(credentials, subscr_id);
        return client.services.listByResourceGroup(rg);
    }).then((services) => {
       console.log('List of services:');
       console.dir(services, {depth: null, colors: true});
    }).catch((err) => {
        console.log('An error ocurred');
        console.dir(err, {depth: null, colors: true});
    });
}
