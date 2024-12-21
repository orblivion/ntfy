#!/usr/bin/bash

# Develop web. It's much, much faster turnaround than build.sh

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here/../web

npm start
