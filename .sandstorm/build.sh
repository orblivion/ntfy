#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here/..

export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:~/go/bin

which goreleaser || go install github.com/goreleaser/goreleaser@latest
goreleaser -v   # verifies that it worked

make web
make cli-linux-amd64
