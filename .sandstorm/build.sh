#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here/..

#make web
make cli-linux-amd64

goreleaser -v || go install github.com/goreleaser/goreleaser@latest
goreleaser -v   # verifies that it worked
