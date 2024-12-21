#!/bin/bash
set -euo pipefail

export NTFY_LISTEN_HTTP=:8080
CACHE_PATH=/var/lib/ntfy
mkdir -p $CACHE_PATH
export NTFY_CACHE_FILE=$CACHE_PATH/cache.db
#export NTFY_LOG_LEVEL="trace" # If I uncomment, add a TO-DO to remove this before launch! "info" is the default.

# NOTE: If I ever set the data retention to other than 12h, update the security section accordingly.

# See changes in web/src/components/routes.js
export NTFY_DISALLOWED_TOPICS="sandstorm-extra-89dfdbfd72e2ae64728dd"

# NTFY_VISITOR_REQUEST_LIMIT_BURST
#
# "Rate limiting: Allowed GET/PUT/POST requests per second, per visitor.
# This setting is the initial bucket of requests each visitor has"
#
# Default is 60. So each visitor can make 60 requests per second. Users
# are still subject to other limits such as daily limits; this is for
# occasional "bursts" of requests.
#
# For ntfy for Sandstorm, we can't do per-visitor rate limiting.
# Everybody who requests to this grain is treated as the same
# visitor. This is greatly mitigated by the fact that only one
# user is using each grain.
#
# However each user will be subscribed to as many as 30 topics. They
# might all "burst" at some point, but I seriously doubt they'd all go
# at once. Let's assume as many as 4 might. So we'll take the usual
# limit (60) and multiply it by 4 to get a burst limit of 360.
export NTFY_VISITOR_REQUEST_LIMIT_BURST=360

export PATH=$PATH:/opt/app/dist/ntfy_linux_amd64_linux_amd64_v1

cd /opt/app

ntfy serve
