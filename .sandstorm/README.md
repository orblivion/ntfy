# Overview

This is the Sandstorm fork of ntfy. These READMEs are the result of pondering how ntfy works and how it can be integrated into Sandstorm. This is the overview, and it has links to the respective [details](README_DETAILS.md) (which may be a bit discombobulated, pardon the dust).

The **initial release** of this ntfy Sandstorm app will have some advantages and some disadvantages compared to the normal ntfy app. I am going to cut down the work I have to do as much as I can to make it a passable release (one which I am comfortable using myself).

These docs describe what I can and can't do. These notes are for my future self, and for others who are particularly interested. I will *probably hold off on implementing anything past the initial version* until I hear from a potential user that they are interested in it. So please, speak up if that is you.

You can [try it out the demo](https://apps.sandstorm.io/app/pxm3ugzn7sfhtw4kz9ktdfkyphdq0qa1y2n1g0yfnzkn0mqcszhh?experimental=true). Here are the [changes I've made](https://github.com/binwiederhier/ntfy/compare/v2.11.0...orblivion:ntfy:sandstorm) on top of the latest tag of ntfy. Some are changes to ntfy itself, some are sandstorm-specific stuff on top.

If you are interested in helping, particularly if you know something about ntfy and/or could review code, I'd love to hear from you. Find me on [Mastodon](https://mastodon.social/@ill_logic) or [Zulip](https://sandstorm.zulipchat.com/#narrow/channel/476196-app-updates/topic/ntfy.3A.20a.20UnifiedPush.20app.20for.20Sandstorm). Or my email address which is on my website which is on my Github profile.

# [Changes and Issues](README_DETAILS.md#changes-and-issues)

The details for this section is for:

* What to change in this version and why
* What to change in future versions and why
* What not to do, and why

This overview will try to stick to what to do for the initial release.

## [Backend changes](README_DETAILS.md#backend-changes)

### [Attachments](README_DETAILS.md#attachments)

Make attachments work.

#### [Headers vs JSON API](README_DETAILS.md#headers-vs-json-api)

Sandstorm blocks non-standard headers. This may break some services that rely on the standard headers-based ntfy API. It will also break some features, such as authentication (i.e. protecting topics).

Fixing this would require a fundamental change to Sandstorm platform. We may be better to wait for [Tempest](https://github.com/sandstorm-org/tempest).

#### [Locking Down Topics](README_DETAILS.md#locking-down-topics)

Because Sandstorm uses auth headers for its own purposes, we can't "log in" and thus we cannot have private topics. Thus, just as with a free ntfy.sh account, the user should always pick randomly generated topics. Thankfully the API endpoint given my Sandstorm is random and revokable. However services (Mastodon, etc) that send notifications will see the endpoint, so it won't be totally secret.

Because this is Sandstorm, we still want to make ntfy a single-user app and give the user as much ownership over it as possible. We can probably give users the ability to monitor which topics are being used, and even get a notification when a new topic is being used.

In the medium run we could add an approval process in the Web UI (requiring an "Extra API"). In the long run we might be able to change Sandstorm to carve out a way for us to authenticate after all.

For the **initial release**, we're just going to release this as-is. No ability to protect topics, no special monitoring features.

## [Web UI](README_DETAILS.md#web-ui)

For the **initial release** we will:

- [x] Add the API URL (the "offer template" described below) to settings for smooth onboarding
- [ ] Remove features that won't work or are confusing for Sandstorm
- [ ] List ntfy features that are missing from the Sandstorm version
- [ ] Add onboarding information and warnings

Anything related to the "Extra API" will be put off.

### [Security](README_DETAILS.md#security)

ntfy's web UI is just another dumb client. It looks like an admin (it fooled me at first), but all configurations and secrets you see are actually stored in the browser (which causes some new problems, see "Caveats about missing features" below)

For Sandstorm integration, we will offer extra functionality. We will make sure that none of this new functionality works over the API endpoint (i.e. via phone clients), only Sandstorm's web portal. One such item will be the "offer template" which gives the user a new API endpoint and shows them how to connect it to their phone. The other, which we will do later, will be an "Extra API" to facilitate features described in the Backend Changes section.

### [Link to URL to put into phone app](README_DETAILS.md#link-to-url-to-put-into-phone-app)

"Offer template" that has API URL and instructions for phone setup.

### [Remove Features](README_DETAILS.md#remove-features)

Inapplicable features such as logging in should be removed from the UI to avoid confusing the user.

### [Info in the UI](README_DETAILS.md#info-in-the-ui)

Actually explain this stuff to the user

#### [Caveats about missing features](README_DETAILS.md#caveats-about-missing-features)

Some apps and services may not work due to how Sandstorm handles headers. Crossing our fingers that it's not very many (and that the ones that do will not stop working).

Since Sandstorm rotates ui subdomains, none of the data saved locally to the browser (such as topic subscriptions and notifications) will stick around. We need to explain to the user what will and won't work.

Other features will be missing as well, such as Desktop Notifications, protected topics, and the Progressive Web App.

#### [Caveats about reliability](README_DETAILS.md#caveats-about-reliability)

Warn users about some reliability issues that may be inherent to this Sandstorm version.

#### [Caveats about privacy](README_DETAILS.md#caveats-about-privacy)

Explain to user that the server will be not be totally private because of the services that will ping it. Explain how to rotate the API key in case they suspect unwanted use. Make sure they don't share grains with other users.

#### [Missing instructions](README_DETAILS.md#missing-instructions)

Usage instructions that ought to have been in ntfy regardless. (How UnifiedPush setup works, etc)

## [Assorted](README_DETAILS.md#assorted)

Various other TODO items. Most of these are probably prudent to do for the **initial release**.

# [Validate](README_DETAILS.md#validate)

What to validate before any major release.

# [Research](README_DETAILS.md#research)

What to learn about the system. Maybe we need to fix things or add more warnings, in which case we'll move it to one of the above sections.

## [Connections](README_DETAILS.md#connections)

- [ ] Confirm we don't need outbound requests
- [x] Confirm websockets work
- [ ] Confirm proxy config is right

## [Other](README_DETAILS.md#other)

- [ ] Which Android apps (Tusky, Element, etc) and related services (Mastodon, Matrix, etc) successfully work via the Sandstorm ntfy app?
- [ ] Some security checks
- [ ] Does private info get sent to the ntfy server?
- [ ] See what happens if I use multiple API URLs
- [ ] Try moving to a new ntfy grain, see how Android apps respond

# [Future](README_DETAILS.md#future)

Some ideas for future versions if we get this off the ground. They may or may not work. See [README_FUTURE.md](README_FUTURE.md) for details.

* Molly support via Mollysocket
* Zulip partial support via a Zulip bot
* Action buttons on phone notifications that perform ntfy-related tasks
* Build into Tempest's notification system
* GUI-based ntfy configs (as opposed to env vars) in the Sandstorm portal via Extra API
