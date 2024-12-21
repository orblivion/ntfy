#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here/..

# TODO - is there a better place for this?
export PATH=$PATH:~/go/bin

goreleaser -v || go install github.com/goreleaser/goreleaser@latest
goreleaser -v   # verifies that it worked

make web
make cli-linux-amd64
