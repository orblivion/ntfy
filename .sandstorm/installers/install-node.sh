#!/bin/bash
set -euox pipefail

# Not great perhaps that I'm running curl and npm as root but this is just for
# Sandstorm build and dev environments.
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs
apt install -y npm
npm -v   # verifies that it worked
