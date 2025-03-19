#!/bin/bash
set -euo pipefail

export NTFY_LISTEN_HTTP=:8080
CACHE_PATH=/var/lib/ntfy
mkdir -p $CACHE_PATH
export NTFY_CACHE_FILE=$CACHE_PATH/cache.db
export NTFY_LOG_LEVEL="trace" # TODO - remove this before launch! "info" is the default.

# See changes in web/src/components/routes.js
export NTFY_DISALLOWED_TOPICS="sandstorm-extra-89dfdbfd72e2ae64728dd"

# Default is 60. Increasing because we can't have per-visitor rate limiting.
# We could be subscribed to as many as 30 topics but I seriously doubt all
# 30 will be bursting at the same time. Let's say maybe as many as four are.
export NTFY_VISITOR_REQUEST_LIMIT_BURST=360

export PATH=$PATH:/opt/app/dist/ntfy_linux_amd64_linux_amd64_v1

cd /opt/app

ntfy serve
