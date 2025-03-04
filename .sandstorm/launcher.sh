#!/bin/bash
set -euo pipefail

export NTFY_LISTEN_HTTP=:8080
export NTFY_CACHE_FILE=/var/lib/ntfy/cache.db
export NTFY_LOG_LEVEL="trace" # TODO - remove this before launch! "info" is the default.

# See changes in web/src/components/routes.js
export NTFY_DISALLOWED_TOPICS="sandstorm-extra-89dfdbfd72e2ae64728dd"

export PATH=$PATH:/opt/app/dist/ntfy_linux_amd64_linux_amd64_v1

cd /opt/app

ntfy serve
