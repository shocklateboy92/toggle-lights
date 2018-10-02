#!/bin/bash

set -xe
STATE_FILE="./userInfo.json";

token="$(jq -r '.user.accessToken' $STATE_FILE)";
endpoint="$(jq -r '.user.endpoints[-1].uri' $STATE_FILE)";

function make_request() {
    method=${2:-GET};

    curl -s -X "${method}" -H "Authorization: Bearer ${token}" "${endpoint}/$1";
}

response=$(make_request "device/$1/attribute/switch");
state=$(echo "$response" | jq -r .value);

case $state in
    "on")
        command="off";
        ;;
    "off")
        command="on";
        ;;
    *)
        echo "ERROR: Unable to extract state from response: ";
        echo "$response";
        exit 3;
        ;;
esac

make_request "device/$1/command/${command}" "POST"