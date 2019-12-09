#!/usr/bin/env bash

set -euo pipefail

day="${1:-}"

[ -z "$day" ] && {
    echo "Usage: init.sh <day>"
    exit 1;
}

mkdir "src/day$day"
cp templates/main.ts "src/day$day"

mkdir "inputs/day$day"
touch "inputs/day$day/input.txt"
