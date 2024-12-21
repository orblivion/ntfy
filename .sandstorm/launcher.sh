#!/bin/bash
set -euo pipefail


# TODO - maybe consider other useful configs: https://docs.ntfy.sh/config/

# export NTFY_BASE_URL=http://ntfy.example.com # (TODO: hopefully can leave blank)
export NTFY_CACHE_FILE=/var/lib/ntfy/cache.db
export NTFY_CACHE_DURATION=48h # Default 12h
#export NTFY_AUTH_DEFAULT_ACCESS=... (TODO: I think default of read-write all is fine)
export NTFY_BEHIND_PROXY=true # (TODO: Hopefully Sandstorm uses X-Forwarded-For header)
#export NTFY_ATTACHMENT_CACHE_DIR=/var/lib/ntfy/attachments (TODO: Seems to require BASE_URL for some reason)
# export NTFY_ENABLE_LOGIN=true (TODO: default seems to have me just logged in anyway?)

export NTFY_LISTEN_HTTP=:8080

# Gets everything underneath as well
mkdir -p /var/lib/ntfy/attachments

export PATH=$PATH:/opt/app/dist/ntfy_linux_amd64_linux_amd64_v1

# TODO - Caddy config. Put web root in a separate box that is not accessible via the API endpoint

cd /opt/app
ntfy serve
