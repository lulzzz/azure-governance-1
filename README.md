# azure-governance

A utility to compare Application Design in Azure vs the actual Deployed Resources

## Application Design

This applicaton works as follows:

1) You define your application resource requirements in a JSON file
2) You obtain your actual deployed resources via the Azure CLI
3) This Node.js program compares the requirements vs the actual deployed resources
   - reports Requirements vs Resources
   - reports Resources vs Requirements



## Links

- https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
- https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest
- https://docs.microsoft.com/en-us/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest

## Sample Azure CLI Commands

```
# az --help

$ az login

$ az account list

$ az resource --help

$ az resource list > tmp/resource-list.json

$ az resource list --resource-group cjoakim-cosmos > tmp/rg-cjoakim-cosmos.json
```

## Example

### Application Definition

See file **designs/app1.json**, which defines the required resources for an application.

```
{
  "name": "Application 1",
  "resource_group": "cjoakim-core",
  "requirements": [
    {
      "type": "Microsoft.ContainerRegistry/registries",
      "location": "eastus",
      "sku_tier": "Standard",
      "tags": {"app": "app1"}
    },
    {
      "type": "Microsoft.EventHub/namespaces",
      "location": "eastus",
      "sku_tier": "Standard",
      "tags": {"app": "app1"}
    },
    {
      "type": "Microsoft.ServiceBus/namespaces",
      "location": "eastus",
      "sku_tier": "Standard",
      "tags": {"app": "app1"}
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "location": "eastus",
      "kind": "StorageV2",
      "sku_tier": "Standard",
      "tags": {"app": "app1"}
    }
  ]
}
```

### Obtain Actual Deployed Resources

See file **list-resources.sh**, which uses the Azure CLI to obtain a list of your
actual deployed resources in Azure.

The **az resource list** command is used in this script to list your resources in either
a subscription or a resource group.  The output can be redirected to a text/json file
for processing by the Node.js program.

```
az resource list > data/resource-list.json

az resource list --resource-group some_rg > ...some other output JSON file...
```

### Execute the Program to Compare an App Design vs Deployment

Run the following from your command line to compare the application design in **app1.json**
vs the resources in your subscription obtained by the **az resource list** command.

```
$ node main.js verify_application designs/app1.json data/resource-list.json
```

### Program Output

```
verify_application: designs/app1.json from resources data/resource-list.json
4 requirements loaded from file designs/app1.json
13 resources loaded from file data/resource-list.json
6 filtered resources in rg
matching requirements to resources...
requirement 1 - matched type; Microsoft.ContainerRegistry/registries
requirement 1 - matched location; eastus
requirement 1 - matched sku_tier; Standard
requirement 1 - matched tags; {"app":"app1"}
req 1 - matched to resource; /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ContainerRegistry/registries/cjoakimacr
requirement 2 - matched type; Microsoft.EventHub/namespaces
requirement 2 - matched location; eastus
requirement 2 - matched sku_tier; Standard
requirement 2 - matched tags; {"app":"app1"}
req 2 - matched to resource; /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.EventHub/namespaces/cjoakimeventhubs
requirement 3 - matched type; Microsoft.ServiceBus/namespaces
requirement 3 - matched location; eastus
requirement 3 - matched sku_tier; Standard
requirement 3 - matched tags; {"app":"app1"}
req 3 - matched to resource; /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ServiceBus/namespaces/cjoakimservicebus
requirement 4 - matched type; Microsoft.Storage/storageAccounts
requirement 4 - matched location; eastus
requirement 4 - matched sku_tier; Standard
requirement 4 - tags NOT matched; {"app":"app1"} -> {"app":"app2"}



Summary Report - Requirements to Resources
requirement 1 Microsoft.ContainerRegistry/registries - matched to resource:
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ContainerRegistry/registries/cjoakimacr
requirement 2 Microsoft.EventHub/namespaces - matched to resource:
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.EventHub/namespaces/cjoakimeventhubs
requirement 3 Microsoft.ServiceBus/namespaces - matched to resource:
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ServiceBus/namespaces/cjoakimservicebus
requirement 4 Microsoft.Storage/storageAccounts - NOT matched to a resource



Summary Report - Resources to Requirements
resource NOT matched to a requirement:
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.Cache/Redis/cjoakimredis
resource matched to a requirement: 1
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ContainerRegistry/registries/cjoakimacr
resource matched to a requirement: 2
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.EventHub/namespaces/cjoakimeventhubs
resource NOT matched to a requirement:
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.KeyVault/vaults/cjoakimkeyvault
resource matched to a requirement: 3
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.ServiceBus/namespaces/cjoakimservicebus
resource NOT matched to a requirement:
              /subscriptions/11111111-d222-3333-44c4-a12345e8888z/resourceGroups/cjoakim-core/providers/Microsoft.Storage/storageAccounts/cjoakimstdstorage
```
