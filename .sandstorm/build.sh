#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here/..

# TODO - this is really annoying, I shouldn't have to do this everywhere
export PATH=$PATH:/usr/local/go/bin
# TODO - is there a better place for this?
export PATH=$PATH:~/go/bin

which goreleaser || go install github.com/goreleaser/goreleaser@latest
goreleaser -v   # verifies that it worked

make web
make cli-linux-amd64
