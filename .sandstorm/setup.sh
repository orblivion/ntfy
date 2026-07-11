#!/usr/bin/bash

set -euo pipefail

here="$(dirname "$(readlink -f "$0")")"
cd $here

apt install -y \
    build-essential \
    libsqlite3-dev \
    python3-pip

export PATH=$PATH:/usr/local/go/bin

./installers/install-node.sh
go version || ./installers/install-go.sh
