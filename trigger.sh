#!/bin/bash

set -e
STATE_FILE="./userInfo.json";

token="$(jq -r '.user.accessToken' $STATE_FILE)";
endpoint="$(jq -r '.user.endpoints[-1].uri' $STATE_FILE)";

set -x

curl -H "Authorization: Bearer ${token}" "${endpoint}/toggle/$1";