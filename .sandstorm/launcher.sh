#!/bin/bash
set -euo pipefail


# TODO - maybe consider other useful configs: https://docs.ntfy.sh/config/

# export NTFY_BASE_URL=http://ntfy.example.com # (TODO: hopefully can leave blank)
export NTFY_CACHE_FILE=/var/lib/ntfy/cache.db
export NTFY_CACHE_DURATION=48h # Default 12h
#export NTFY_AUTH_DEFAULT_ACCESS=... (TODO: I think default of read-write all is fine)
export NTFY_BEHIND_PROXY=true # (TODO: Hopefully Sandstorm uses X-Forwarded-For header. Check this actually, it uses it for rate limiting.)
#export NTFY_ATTACHMENT_CACHE_DIR=/var/lib/ntfy/attachments (TODO: Seems to require BASE_URL for some reason)
# export NTFY_ENABLE_LOGIN=true (TODO: default seems to have me just logged in anyway?)

export NTFY_LISTEN_HTTP=:8081

export ADMIN_ROOT="/admin-0a5c4ea29f899c0c55316201ea96b1646f26a2d444c9e9ce904ae24f65c96f00/"
export API_ROOT="/api-b7b2014f6534a7cba6d57dfe4d20be0352f5f23689d1ea187453bab65f97638b/"

# Confirm that it's the same one in our pkgdef
grep apiPath /opt/app/.sandstorm/sandstorm-pkgdef.capnp | grep $API_ROOT > /dev/null || (echo "API_ROOT does not match sandstorm-pkgdef"; exit 1)

# Gets everything underneath as well
mkdir -p /var/lib/ntfy/attachments

export PATH=$PATH:/opt/app/dist/ntfy_linux_amd64_linux_amd64_v1

cd /opt/app

ntfy serve&

python3 .sandstorm/password.py&

# Caddy likes to save stuff in the home directory that we don't care about
FAKE_CADDY_HOME=/tmp/fake-caddy-home
mkdir $FAKE_CADDY_HOME
HOME=$FAKE_CADDY_HOME caddy run --config .sandstorm/Caddyfile
