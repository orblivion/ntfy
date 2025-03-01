#!/bin/bash
set -euo pipefail

# export NTFY_BASE_URL=http://ntfy.example.com # (TODO: hopefully can leave blank)
#   Check the uses of it in code to make sure that having it change is safe, since we change the ui-subdomain all the time.

export NTFY_LISTEN_HTTP=:8080
export NTFY_CACHE_FILE=/var/lib/ntfy/cache.db

# TODO: Hopefully Sandstorm uses X-Forwarded-For header. Check this actually, it uses it for rate limiting.
# TODO Check that this proxy thing actually is necessary for it to work behind Sandstorm, I'm curious.
export NTFY_BEHIND_PROXY=true

# See changes in web/src/components/routes.js
export NTFY_DISALLOWED_TOPICS="all-subscriptions-89dfdbfd72e2ae64728dd,docs-89dfdbfd72e2ae64728dd"

# If I want rate limiting, see the various options with NTFY_VISITOR_*

# Gets everything underneath as well
mkdir -p /var/lib/ntfy/attachments

export PATH=$PATH:/opt/app/dist/ntfy_linux_amd64_linux_amd64_v1

cd /opt/app

ntfy serve
