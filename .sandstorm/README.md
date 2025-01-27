# Overview

These READMEs are the result of pondering how ntfy works and how it can be integrated into Sandstorm. I confused myself multiple times in the process. I've put some effort into cleaning it all up but that itself has been an endeavor.

The bottom line is this: The **initial release** of this ntfy Sandstorm app will have some advantages and some disadvantages compared to the normal ntfy app. I am going to cut down the work I have to do as much as I can to make it a passable release (one which I am comfortable using myself).

These docs describe what I can and can't do. These notes are for my future self, and for others who are particularly interested. I will *probably hold off on implementing anything past the initial version* until I hear from a potential user that they are interested in it. So please, speak up if that is you. And if you are interested in helping, I'd love to hear from you as well.

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

# Changes and Issues - Summary

My notes on what can and should be done exploded. For most readers here, I wanted to make a summary, but you can look at the accompanying sub-section in [README_DETAILS.md](README_DETAILS.md)

## Backend changes

### Connections

Confirm we don't need outbound requests, fix websockets, confirm proxy config is right.

### Attachments

Make attachments work

### Headers vs JSON API

Sandstorm blocks non-standard headers. This will break services unless they use json instead. Crossing our fingers that it's not very many (and that the ones that do will not change).

Let's keep a list of services that are known to work, for the app description. Android app, iOS app, and Mastodon work for now, at least.

### Locking Down Topics

Because Sandstorm uses auth headers for its own purposes, we can't "log in" and thus we cannot have private topics. Thus, just as with a free ntfy.sh account, the user should always pick randomly generated topics. Thankfully the API endpoint given my Sandstorm is random and revokable. However services (Mastodon, etc) that send notifications will see the endpoint, so it won't be totally secret.

Because this is Sandstorm, we still want to make ntfy a single-user app and give the user as much ownership over it as possible. We can probably give users the ability to monitor which topics are being used, and even get a notification when a new topic is being used.

In the medium run we could add an approval process in the admin. In the long run we might be able to change Sandstorm to carve out a way for us to authenticate after all.

For the **initial release**, we're just going to release this as-is. No ability to protect topics, no special monitoring features.

## Web UI

For the **initial release** we will only do the "offer template" (described below) because it is necessary for smooth onboarding. We should also do all of the removal of features and explanation to users because it avoids confusion and it's easy enough to do. Anything related to the "Admin API" will be put off.

### Security

ntfy's web UI is just another dumb client. It looks like an admin (it fooled me at first), but all configurations and secrets you see are actually stored in the browser (which causes some new problems, see "Caveats about missing features" below)

For Sandstorm integration, we will offer extra functionality. We will make sure that none of this new functionality works over the API endpoint (i.e. via phone clients), only Sandstorm's web portal. One such item will be the "offer template" which gives the user a new API endpoint and shows them how to connect it to their phone. The other, which we will do later, will be an "Admin API" to facilitate features described in the Backend Changes section.

### Link to URL to put into phone app

"Offer template" that has API URL and instructions for phone setup.

### Remove Features

Inapplicable features such as logging in should be removed from the UI to avoid confusing the user.

### Info in the UI

Actually explain this stuff to the user

#### Caveats about missing features

Since Sandstorm rotates ui subdomains, none of the data saved locally to the browser will stick around. We need to explain to the user what will and won't work.

Other features will be missing as well, such as Desktop Notifications and the Progressive Web App.

#### Caveats about reliability

Warn users about some reliability issues that may be inherent to this Sandstorm version.

#### Caveats about privacy

Explain to user that the server will be not be totally private because of the services that will ping it. Explain how to rotate the API key in case they suspect unwanted use. Make sure they don't share grains with other users.

#### Missing instructions

Usage instructions that ought to have been in ntfy regardless. (How UnifiedPush setup works, etc)

## Assorted

Various other TODO items. Most of these are probably prudent to do for the **initial release**.

# Future

Some ideas for future versions if we get this off the ground. They may or may not work. See [README_FUTURE.md](README_FUTURE.md) for details.

* Molly support via Mollysocket
* Zulip partial support via a Zulip bot
* Action buttons on phone notifications that perform ntfy-related tasks
* Build into Tempest's notification system
* GUI-based ntfy configs (as opposed to env vars) in the Sandstorm portal via Admin API
