#!/usr/bin/env bash

set -euo pipefail

day="${1:-}"
input_file="${2:-input}"

[ -z "$day" ] && {
    echo "Usage: init.sh <day> [input-file]"
    exit 1;
}

DAY=$day FILE=$input_file yarn run ts-node "src/day$day/main.ts"
