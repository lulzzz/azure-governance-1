#!/bin/bash

# Bash shell script using the Azure CLI to obtain deployed resource information.
# Chris Joakim, Microsoft, 2019/04/04

echo 'removing output files...'
rm data/*.json

fakeSubId='11111111-d222-3333-44c4-a12345e8888z'

# az resource list --help

echo 'listing resources in subscription...'
az resource list > data/resource-list-unsubscrubbed.json

echo 'listing resources in rg cjoakim-core ...'
az resource list --resource-group cjoakim-core > data/rg-cjoakim-core-unsubscrubbed.json

echo 'listing resources in rg cjoakim-cosmos ...'
az resource list --resource-group cjoakim-cosmos > data/rg-cjoakim-cosmos-unsubscrubbed.json

echo 'scrubbing the subscription Id...'
sed 's/'$AZURE_SUBSCRIPTION_ID'/'$fakeSubId'/g ' data/resource-list-unsubscrubbed.json     > data/resource-list.json
sed 's/'$AZURE_SUBSCRIPTION_ID'/'$fakeSubId'/g ' data/rg-cjoakim-core-unsubscrubbed.json   > data/rg-cjoakim.json
sed 's/'$AZURE_SUBSCRIPTION_ID'/'$fakeSubId'/g ' data/rg-cjoakim-cosmos-unsubscrubbed.json > data/rg-cjoakim-cosmos.json

echo 'deleting unscrubbed files...'
rm data/*unsubscrubbed.json

echo 'done'

