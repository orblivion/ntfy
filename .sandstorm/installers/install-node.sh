#!/bin/bash
set -euox pipefail

# Not great perhaps that I'm running curl and npm as root but this is just for
# Sandstorm build and dev environments.
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm -v   # verifies that it worked
