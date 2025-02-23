# [Overview](README_DETAILS.md#overview)

These READMEs are the result of pondering how ntfy works and how it can be integrated into Sandstorm. I confused myself multiple times in the process. I've put some effort into cleaning it all up but that itself has been an endeavor.

The bottom line is this: The **initial release** of this ntfy Sandstorm app will have some advantages and some disadvantages compared to the normal ntfy app. I am going to cut down the work I have to do as much as I can to make it a passable release (one which I am comfortable using myself).

These docs describe what I can and can't do. These notes are for my future self, and for others who are particularly interested. I will *probably hold off on implementing anything past the initial version* until I hear from a potential user that they are interested in it. So please, speak up if that is you.

And if you are interested in helping, I'd love to hear from you as well. Find me on [Mastodon](https://mastodon.social/@ill_logic) or [Zulip](https://sandstorm.zulipchat.com/#narrow/channel/476196-app-updates/topic/ntfy.3A.20a.20UnifiedPush.20app.20for.20Sandstorm). Or my email address which is on my website which is on my Github profile. I can start to put this stuff into Github issues.

# [Changes and Issues - Summary](README_DETAILS.md#changes-and-issues)

My notes on what can and should be done exploded. For most readers here, I wanted to make a summary, but you can look at the accompanying sub-section in [README_DETAILS.md](README_DETAILS.md)

## [Backend changes](README_DETAILS.md#backend-changes)

### [Connections](README_DETAILS.md#connections)

Confirm we don't need outbound requests, fix websockets, confirm proxy config is right.

### [Attachments](README_DETAILS.md#attachments)

Make attachments work

### [Headers vs JSON API](README_DETAILS.md#headers-vs-json-api)

Sandstorm blocks non-standard headers. This will break services unless they use json instead. Crossing our fingers that it's not very many (and that the ones that do will not change).

Let's keep a list of services that are known to work, for the app description. Android app, iOS app, and Mastodon work for now, at least.

### [Locking Down Topics](README_DETAILS.md#locking-down-topics)

Because Sandstorm uses auth headers for its own purposes, we can't "log in" and thus we cannot have private topics. Thus, just as with a free ntfy.sh account, the user should always pick randomly generated topics. Thankfully the API endpoint given my Sandstorm is random and revokable. However services (Mastodon, etc) that send notifications will see the endpoint, so it won't be totally secret.

Because this is Sandstorm, we still want to make ntfy a single-user app and give the user as much ownership over it as possible. We can probably give users the ability to monitor which topics are being used, and even get a notification when a new topic is being used.

In the medium run we could add an approval process in the admin. In the long run we might be able to change Sandstorm to carve out a way for us to authenticate after all.

For the **initial release**, we're just going to release this as-is. No ability to protect topics, no special monitoring features.

## [Web UI](README_DETAILS.md#web-ui)

For the **initial release** we will only do the "offer template" (described below) because it is necessary for smooth onboarding. We should also do all of the removal of features and explanation to users because it avoids confusion and it's easy enough to do. Anything related to the "Admin API" will be put off.

### [Security](README_DETAILS.md#security)

ntfy's web UI is just another dumb client. It looks like an admin (it fooled me at first), but all configurations and secrets you see are actually stored in the browser (which causes some new problems, see "Caveats about missing features" below)

For Sandstorm integration, we will offer extra functionality. We will make sure that none of this new functionality works over the API endpoint (i.e. via phone clients), only Sandstorm's web portal. One such item will be the "offer template" which gives the user a new API endpoint and shows them how to connect it to their phone. The other, which we will do later, will be an "Admin API" to facilitate features described in the Backend Changes section.

### [Link to URL to put into phone app](README_DETAILS.md#link-to-url-to-put-into-phone-app)

"Offer template" that has API URL and instructions for phone setup.

### [Remove Features](README_DETAILS.md#remove-features)

Inapplicable features such as logging in should be removed from the UI to avoid confusing the user.

### [Info in the UI](README_DETAILS.md#info-in-the-ui)

Actually explain this stuff to the user

#### [Caveats about missing features](README_DETAILS.md#caveats-about-missing-features)

Since Sandstorm rotates ui subdomains, none of the data saved locally to the browser (such as topic subscriptions and notifications) will stick around. We need to explain to the user what will and won't work.

Other features will be missing as well, such as Desktop Notifications and the Progressive Web App.

#### [Caveats about reliability](README_DETAILS.md#caveats-about-reliability)

Warn users about some reliability issues that may be inherent to this Sandstorm version.

#### [Caveats about privacy](README_DETAILS.md#caveats-about-privacy)

Explain to user that the server will be not be totally private because of the services that will ping it. Explain how to rotate the API key in case they suspect unwanted use. Make sure they don't share grains with other users.

#### [Missing instructions](README_DETAILS.md#missing-instructions)

Usage instructions that ought to have been in ntfy regardless. (How UnifiedPush setup works, etc)

## [Assorted](README_DETAILS.md#assorted)

Various other TODO items. Most of these are probably prudent to do for the **initial release**.

# [Test](README_DETAILS.md#test)

To learn about the system and/or to validate before release.

# [Future](README_DETAILS.md#future)

Some ideas for future versions if we get this off the ground. They may or may not work. See [README_FUTURE.md](README_FUTURE.md) for details.

* Molly support via Mollysocket
* Zulip partial support via a Zulip bot
* Action buttons on phone notifications that perform ntfy-related tasks
* Build into Tempest's notification system
* GUI-based ntfy configs (as opposed to env vars) in the Sandstorm portal via Admin API
