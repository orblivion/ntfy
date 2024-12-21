#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here/..

export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:~/go/bin

make cli-deps-all # goreleaser comes from here, circa v2.13.0 and before
make web
make cli-linux-amd64
