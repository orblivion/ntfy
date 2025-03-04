# Overview

This is the Sandstorm fork of ntfy. These READMEs are the result of pondering how ntfy works and how it can be integrated into Sandstorm. This is the overview, and it has links to the respective [details](README_DETAILS.md) (which may be a bit discombobulated, pardon the dust).

The **initial release** of this ntfy Sandstorm app will have some advantages over normal ntfy, but there will be **missing features** for reasons explained below. I am going to cut down the work I have to do as much as I can to make it a passable release (one which I am comfortable using myself).

These docs describe what I can and can't do. These notes are for my future self, and for others who are particularly interested. I will *probably hold off on implementing anything past the initial version* until I hear from a potential user that they are interested in it. So please, speak up if that is you.

You can [try out the demo](https://apps.sandstorm.io/app/pxm3ugzn7sfhtw4kz9ktdfkyphdq0qa1y2n1g0yfnzkn0mqcszhh?experimental=true). Here are the [changes I've made](https://github.com/binwiederhier/ntfy/compare/v2.11.0...orblivion:ntfy:sandstorm) on top of the latest tag of ntfy. Some are changes to ntfy itself, some are sandstorm-specific stuff on top. *Note: I haven't documented all code changes in these READMEs*.

If you are interested in helping, particularly if you know something about ntfy and/or could review code, I'd love to hear from you. Find me on [Mastodon](https://mastodon.social/@ill_logic) or [Zulip](https://sandstorm.zulipchat.com/#narrow/channel/476196-app-updates/topic/ntfy.3A.20a.20UnifiedPush.20app.20for.20Sandstorm). Or my email address which is on my website which is on my Github profile.

# [Changes and Issues](README_DETAILS.md#changes-and-issues)

The details for this section is for:

* What to change in this version and why
* What to change in future versions and why
* What not to do, and why

This overview will try to stick to what to do for the initial release.

## [Backend changes](README_DETAILS.md#backend-changes)

### [Headers vs JSON API](README_DETAILS.md#headers-vs-json-api)

**For the initial release**, some features, and possibly some apps and services, will not work.

Sandstorm blocks non-standard headers. This may break some services that rely on the standard headers-based ntfy API. It will also break some features, such as authentication (i.e. locking down topics, below).

Fixing this would require a fundamental change to Sandstorm platform. We may be better to wait for [Tempest](https://github.com/sandstorm-org/tempest).

### [Locking Down Topics](README_DETAILS.md#locking-down-topics)

**For the initial release** users will not be able to protect topics with username/password (due to needing auth headers, see above). As with free ntfy.sh accounts, please treat topics like passwords!

Note that the API URL is (thanks to Sandstorm) random and revokable, which can help you hide your ntfy grain. However services (Mastodon, etc) that send notifications will see the endpoint, so it won't be totally secret.

Because this is Sandstorm, we still want to make ntfy a single-user app and give the user as much ownership over it as possible. For future versions we might add the ability to monitor or approve topics in the web UI.

## [Web UI](README_DETAILS.md#web-ui)

**For the initial release we will**:

* Add the API URL (the "offer template" described below) to settings for smooth onboarding
* Remove features that won't work or are confusing for Sandstorm
* List ntfy features that are missing from the Sandstorm version
* Add onboarding information and warnings

Anything related to the "Extra API" that I am considering (see link for details) will be put off.

### [Security](README_DETAILS.md#security)

ntfy's web UI is mostly a client like any other (i.e. no special permissions). Almost all configurations and secrets are actually stored in the browser. This simplifies security (though it causes some new problems, see "Caveats about missing features" below).

However there are a couple exceptions. **For the initial release**:

* We will make sure that ntfy's "Admin API" (possibly still in beta?) does not somehow affect us
* We will make sure that ntfy's "Account API" does not somehow affect us
* We will add a Sandstorm "offer template" (see below), which we will make sure only shows up in the Web UI (not via API URL)

For future versions we may add an "Extra API" for additional features.

### [Link to URL to put into phone app](README_DETAILS.md#link-to-url-to-put-into-phone-app)

**For the initial release we will**

- [x] Add a Sandstorm "offer template" to settings page, which generates API URL for users
- [x] Include instructions on how users can configure their phone with it

### [Remove Features](README_DETAILS.md#remove-features)

**For the initial release we will remove** these features from the UI to avoid confusing the user:

- [x] Embedded docs - maybe?
- [x] "Logging in" for protected topics
- [x] "Service URL" field for sending notifications, and similar. For simplicity, just assume we're referring to the given grain.
- [x] "Forward to email" - I'm assuming this won't work without outgoing connections (though we could add it with some work).

### [Info in the UI](README_DETAILS.md#info-in-the-ui)

**For the initial release we will explain this stuff to the user**:

- [x] Create a welcome screen to hold most of this info

#### [Caveats about missing features](README_DETAILS.md#caveats-about-missing-features)

**For the initial release we will have**:

- [ ] Complete list of missing features in Welcome Screen
- [ ] Complete list of missing features in description.md
- [ ] Caveats in appropriate places (i.e. rename "subscriptions" to "test subscriptions" or something, mention that language is temporary etc)
- [ ] Linked to here from both of the above

**Why are features missing?** (See link for more details)

Since Sandstorm rotates ui subdomains, none of the data saved locally to the browser will stick around long term. This breaks:

* Topic subscriptions
* Other configurations (language, etc)
* Desktop notifications
* Progressive Web App
* Attachments (But, I have a backup plan for later)

Sandstorm blocks a lot of headers (see above). This breaks:

* [Protected topics](#locking-down-topics) (via auth headers)
* Possibly some apps/services, depending on how they choose to communicate with ntfy (Crossing our fingers that it's not very many, and that the ones that do will not stop working).
* *Per-visitor* rate limiting. (Each grain is for one user, so that's still a *per-user* rate limit, and we can adjust the limit.)

We want to keep it simple for Sandstorm. Also these things require additional effort to implement in Sandstorm:

* Sending emails (requires extra work)
* "Service URL" field for sending notifications in the web interface (breaks Sandstorm's front end container model)
* Upstream servers (requires extra work)

#### [Caveats about reliability](README_DETAILS.md#caveats-about-reliability)

**For the initial release we will**:

- [ ] Warn users about some reliability issues that may (or may not?) be inherent to this Sandstorm version (in the welcome screen).

#### [Caveats about privacy](README_DETAILS.md#caveats-about-privacy)

**For the initial release we will**:

- [x] Explain to user that the server will be not be totally private (unlike most Sandstorm apps) because of the services that will ping it.
- [ ] Mention this in description.md as well
- [ ] Explain how to rotate the API URL in case they suspect unwanted use.
- [ ] Make sure they don't share grains with other users.
- [ ] *More?*

#### [Missing instructions](README_DETAILS.md#missing-instructions)

**For the initial release we will add:**

Usage instructions that ought to have been in ntfy regardless. (How UnifiedPush setup works, etc)

- [x] Unified Push description and instructions
- [x] Home-made scripts/apps description and instructions
    - [ ] Mention ntfy cli as well
- [ ] *More?*

## [Assorted](README_DETAILS.md#assorted)

Various other TODO items. See link for details. Most of these are probably prudent to do for the **initial release**.

# [Validate](README_DETAILS.md#validate)

What to validate before any major release.

- [ ] Validate before initial release.

# [Research](README_DETAILS.md#research)

What to learn about the system. Maybe we need to fix things or add more warnings, in which case we'll move it to one of the above sections.

## [Connections](README_DETAILS.md#connections)

- [ ] Confirm we don't need outbound requests
- [x] Confirm websockets work
- [x] Confirm proxy config is right (skipping it; no per-visitor rate limiting, but grain is limited to one user which is limited visitors)

## [Ntfy API](README_DETAILS.md#ntfy-api)

- [x] What is the "Admin API"?
- [x] What is a ntfy "account signup" and "account subscription" and "prefs"?
- [ ] Does the ntfy CLI use json or headers? (Recommend it or warn against using it)

## [Other](README_DETAILS.md#other)

- [ ] Which integrations successfully work via the Sansdtorm ntfy app? (This is where I could use a lot of help!)
    - [ ] [Android apps via UnifiedPush](https://unifiedpush.org/users/apps/) (Tusky, Element, etc) and related services (Mastodon, Matrix, etc)
        - Though, it seems like UnifiedPush is a separate protocol (WebPush?), so maybe it can be determined that it just works?
    - [ ] [Other integrations](https://docs.ntfy.sh/integrations/)
- [ ] Some security checks
- [ ] Does private info get sent to the ntfy server for UnifiedPush messages?
- [ ] See what happens if I use multiple API URLs
- [ ] Try moving to a new ntfy grain, see how Android apps respond
- [ ] Do UnifiedPush messages get cached? Are there any other differences with UP?

# Future

Some ideas for future versions if we get this off the ground. They may or may not work. See [README_FUTURE.md](README_FUTURE.md) for details.

* Molly support via Mollysocket
* Zulip partial support via a Zulip bot
* Action buttons on phone notifications that perform ntfy-related tasks
* Build into Tempest's notification system
* GUI-based ntfy configs (as opposed to env vars) in the Sandstorm portal via Extra API
* *More...*
