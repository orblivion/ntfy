Temporary README as we scrape this together. If this takes off we can move to Github Issues.

----

# TODO

## Backend changes

### Security

Because of how Sandstorm works, we don't want anything like a login UI in between the user and the app. Because ntfy as of yet has no "API Root" feature, the API needs to access the root path of the URL. This leaves the web interface wide open. So we need to add a way to stop anything with API access from accessing the web interface.

Options (in order of preference):

* Check for Sandstorm auth headers for Web URLs. (hopefully not too hard! look for how the options to protect the web interface work, and stick in the header check. But then, make sure the API requests don't set the headers!)
* Caddy reverse proxy, URL rewrites. Add a Web Root to ntfy and put it in a separate box that is not accessible via the API endpoint. (Heavy handed, probably slower executing)
* Add an "API Root" - like "Web Root" - to the server, and restrict API access to it. (probably not, this looks like it will be a lot of work)

See:

* `NTFY_ENABLE_LOGIN`, `NTFY_AUTH_DEFAULT_ACCESS`, and other related configs

### Connections

* Outbound requests: hopefully ntfy doesn't need to do any. If it does, we need to allow it (by default Sandstorm does not).
* Websockets: Currently websocket connection on phone doesn't seem to work. And if I do Caddy I especially need to consider this question: https://docs.ntfy.sh/config/#nginxapache2caddy
* Proxy config - `NTFY_BEHIND_PROXY` - confirm that `X-Forwarded-For` header comes through. DOS is more relevant here than most Sandstorm apps since we'll be necessarily be getting the outside world (albeit only a handful of services) pinging us.

### Attachments

Attachments (`NTFY_ATTACHMENT_CACHE_DIR`) requires `BASE_URL`. I have to figure out what I should put for the latter, since the user's UI is a different domain than the API! Just how Sandstorm works.

Does `BASE_URL` relate to what gets displayed to the user? In what context?

## UI Changes

### Add "copy api URL" to ui

The URL we pass to apps (and thus to UnifiedPush-enabled servers) is not the same as the web URL. With Sandstorm, the web URL requires that you be logged into Sandstorm. However you can create (and revoke) "API keys" that have their own subdomain, and bypass the auth. Sandstorm has its own UI for generating these API keys, but the format it gives, I think, is not in a format that would be usable.

So, we should add a UI that makes it easy to copy the API key in the right format.

#### How to try it for now

Until we add the above UI, here's what to do. Go to the Sandstorm UI above and click the key icon. You'll be able to create an API key that will be in this format:

`https://api-ABC.YOURSUBDOMAIN.sandcats.io#XYZ`

Take this and rearrange it in the following way:

`https://api-ABC.YOURSUBDOMAIN.sandcats.io/.sandstorm-token/XYZ`

Put this into the "default server" option in your ntfy Android app and you'll be connected!

#### Details

Maybe even a QR code for easy phone transfer? (In the far future, this should be built into Sandstorm)

Maybe we should create an API key automatically and display it right away.

Regarding the URL format: I'm assuming that `https://domain/path/` works across UnifiedPush. And I'm assuming that `https://basic:auth@domain` does not. So I went with the former format. I wonder if these assumptions are wrong, in which case we should change the format given here.

### Text changes

Explain that the Desktop PWA may not work so great (or at all) with the Sandstorm version. (In the far future, PWAs would be great for Sandstorm)

Ntfy - Get rid of docs? Or link to the public site? Or maybe not, if it's not too hefty?

Block other features that won't work with Sandstorm

## Assorted

Maybe consider other useful configs: https://docs.ntfy.sh/config/

Check out server/types.go:publishMessage - to see everything I need to... what? Why do I care, I got it working right? Maybe some aspects of the thing won't work with the connection I have I dunno.

# Notes

* It responds fast to requests, even if grain started as off, it looks like.
* We'll be having the outside world pinging us. Namely, services that we're subscribed to. In theory it could be a DOS problem.
* In the long run, Tempest should perhaps integrate with ntfy. Sandstorm has its own notification system that apps can trigger.
	* Perhaps we could have a "system app" hook for getting the notifications and pushing them to ntfy.
	* And/Or perhaps apps already have ntfy hooks. Maybe Tempest could read those and turn them into Tempest notifications (and then back into ntfy notifications, if applicable?)

# Learn

Some things I'd like to learn about ntfy in general which could help us develop.

* Does private info get sent to ntfy.sh ? When you let's say install ntfy, do all Tusky notification CONTENTS go to ntfy server (including DMs)? What about Element, etc? I could try to find a "verbose" mode for ntfy and just dump everything it's getting from the server. Hopefully just a "ping" to let it know to check.
* https://www.youtube.com/watch?v=XQ2jhqbDL6M&feature=youtu.be NextCloud Calendar -> notifications to "Your DAV app"? Any app? How?

# Confirm features

* Tusky Notifications seem to work! They are faster with everything connected (and ntfy is actually listening). But I don't see messages explicitly showing up in the ntfy UI or anything like that.
	* I see Tusky topics show up in my app (without me asking! which is neat):
	* Again, not sure if it's opting me into privacy issues, supposing it wasn't my own server
* Topic subscriptions keep disapperaing in the UI? Is that normal? Something to fix (if so move to appropriate part of this doc)?
