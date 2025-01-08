
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



# Changes - Summary

My notes on what can and should be done exploded. For most people I wanted to make a summary, but you can look at the accompanying sub-section under the "Lots of detail" section.


# Changes - Lots of detail

## Backend changes

### Connections

* Outbound requests: hopefully ntfy doesn't need to do any. If it does, we need to allow it (by default Sandstorm does not).
* Websockets: Currently websocket connection on phone doesn't seem to work. And if I do Caddy I especially need to consider this question: https://docs.ntfy.sh/config/#nginxapache2caddy
* Proxy config - `NTFY_BEHIND_PROXY` - confirm that `X-Forwarded-For` header comes through. DOS is more relevant here than most Sandstorm apps since we'll be necessarily be getting the outside world (albeit only a handful of services) pinging us.
* App is not very resilient to service disruption (though I haven't tried websockets, but it ought to work regardless). Is that the app's shortcoming, or is Sandstorm making the server worse? It seems that you want to subscribe to a new topic to restart the ntfy listener or whatever.

### Attachments

Attachments (`NTFY_ATTACHMENT_CACHE_DIR`) requires `BASE_URL`. I have to figure out what I should put for the latter, since the user's UI is a different domain than the API! Just how Sandstorm works.

Does `BASE_URL` relate to what gets displayed to the user? In what context?

### Headers vs JSON API

...

### Locking Down Topics

## WebUI

...

### Desktop Notifications

...

## Assorted

...
