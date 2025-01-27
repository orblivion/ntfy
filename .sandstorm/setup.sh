#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here

apt install -y \
    build-essential \
    libsqlite3-dev \
    python3-pip

# TODO - this is really annoying, I shouldn't have to do this everywhere
export PATH=$PATH:/usr/local/go/bin

node -v || ./installers/install-node.sh
go version || ./installers/install-go.sh
