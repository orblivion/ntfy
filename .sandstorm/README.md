# Hi

This is **sntfy**, i.e. **ntfy** for [Sandstorm](https://sandstorm.org). If you're familiar with **ntfy**, there are a handful of features that have been left out of this version of ntfy for Sandstorm due to technical hurdles. Again, it recommended to use **sntfy** only for convenience, not for anything "mission critical". When [Tempest](https://github.com/sandstorm-org/tempest) arrives, we may be able to support ntfy fully.

Feel free to reach out (contact points below) if:

* Something stops working after an upgrade
* You would like to help with translations

What follows was an attempt to document everything that doesn't work (particularly [here](#caveats-about-missing-features)). At some point in 2025 I stopped keeping it up to date, but it will probably be mostly relevant for a while.

---

# Overview

This is ntfy for Sandstorm, a fork of [ntfy](https://github.com/binwiederhier/ntfy). You can [install it](https://apps.sandstorm.io/app/pxm3ugzn7sfhtw4kz9ktdfkyphdq0qa1y2n1g0yfnzkn0mqcszhh) from the Sandstorm App Market (or just try the demo).

Ntfy for Sandstorm has some advantages over standard ntfy, and there is some exciting potential for integrating it with other Sandstorm applications in the future. However, there are some **missing features** for reasons explained below. In future versions I could try to find a way to add some of them back, especially if you reach out and let me know that you'd like to see them!

If you are interested in helping, particularly if you know something about ntfy and/or could review code, or translate text that I've added to the UI, or report success/failure with specific integrations, I'd love to hear from you. Find me on [Mastodon](https://mastodon.social/@ill_logic) or [Zulip](https://sandstorm.zulipchat.com/#narrow/channel/476196-app-updates/topic/ntfy.3A.20a.20UnifiedPush.20app.20for.20Sandstorm). Or my email address which is on my website which is on my Github profile.

These READMEs are the result of pondering how ntfy works and how it can be integrated into Sandstorm. Right now they focus on the **initial version** of ntfy for Sandstorm. This is the overview, and it has links to the respective [details](README_DETAILS.md). Here are the [changes I've made](https://github.com/binwiederhier/ntfy/compare/v2.13.0...orblivion:ntfy:sandstorm) on top of v2.13.0 of ntfy. Some are changes to ntfy itself, some are Sandstorm-specific stuff on top.

# [Changes and Issues](README_DETAILS.md#changes-and-issues)

The details for this section is for:

* What to change / was changed in this version and why
* What to change in future versions and why
* What not to do, and why

## [Backend changes](README_DETAILS.md#backend-changes)

### [Headers vs JSON API](README_DETAILS.md#headers-vs-json-api)

**For the initial release**, some features, and possibly some apps and services, will not work.

Sandstorm blocks non-standard headers. This may break some services that rely on the standard headers-based ntfy API (which passes fields such as `Title` as a header). It will also break some features, such as authentication (i.e. locking down topics, below).

Fixing this would require a fundamental change to Sandstorm platform. We may be better to wait for [Tempest](https://github.com/sandstorm-org/tempest).

### [Locking Down Topics](README_DETAILS.md#locking-down-topics)

**For the initial release** users will not be able to protect topics with username/password (due to needing auth headers, see above). As with free ntfy.sh accounts, please treat topics like passwords!

Note that the API URL is (thanks to Sandstorm) random and revokable, which can help you hide your ntfy grain, limiting potential bad actors. However services (Mastodon, etc) that send notifications will see the endpoint, so it won't be totally secret.

This relies on you not sharing your grain with other users. Because this is Sandstorm, we still want to make ntfy a single-user app and give the user as much ownership over it as possible. For future versions we might add the ability to monitor or approve topics in the web UI.

## [Web UI](README_DETAILS.md#web-ui)

**For the initial release we**:

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

**For the initial release we**

- [x] Add a Sandstorm "offer template" to settings page, which generates API URL for users
- [x] Include instructions on how users can configure their phone with it
- [x] *more...* (see link)

### [Remove Features](README_DETAILS.md#remove-features)

**For the initial release we remove** these features from the UI to avoid confusing the user:

- [x] Embedded docs
- [x] "Logging in" for protected topics
- [x] "Service URL" field for sending notifications, and similar. For simplicity, just assume we're referring to the given grain.
- [x] "Forward to email" - I'm assuming this won't work without outgoing connections (though we could add it with some work).
- [x] Web-based subscriptions (they won't persist a page reload anyway)

### [Info in the UI](README_DETAILS.md#info-in-the-ui)

**For the initial release we**:

- [x] Create a welcome screen to explain this stuff to the user

#### [Caveats about missing features](README_DETAILS.md#caveats-about-missing-features)

**For the initial release we have**:

- [x] Mention of major missing features in Welcome Screen, with link to here(?) for details and additional features.
- [x] Reference to missing features in description.md, and say that details are in the app.
- [x] Also callouts for help w/ listing bad apps and translations in description.md.
- [x] Caveats in appropriate places (i.e. mention that settings [language preference, etc] changes are temporary, etc)

Some details:

##### Rotating Subdomains

Since Sandstorm rotates ui subdomains, none of the data saved locally to the browser will stick around long term. It also means it's harder to set a "base-url". This breaks:

* Web Interface:
    * Topic subscriptions
    * Other configurations (language, etc)
    * Desktop notifications
    * Progressive Web App
* API:
    * Attachments (But, I have a backup plan for later)
    * Web Push
    * Matrix Gateway (for easier self-hosted Matrix home server)

##### Headers

Sandstorm blocks a lot of headers (see above). This breaks:

* [Protected topics](#locking-down-topics) (via auth headers)
* Possibly some apps/services, depending on how they choose to communicate with ntfy (Crossing our fingers that it's not very many, and that the ones that do will not stop working).
    * The ones that work may work in a degraded fashion (missing tags, titles, "do not cache" (`X-Cache`), delay (`X-Delay`))
* *Per-visitor* rate limiting. (Each grain is for one user, so that's still a *per-user* rate limit, and we can adjust the limit.)
* ntfy cli - seems to always send auth headers
* The "normal" publishing examples using curl. [Publish as JSON](https://docs.ntfy.sh/publish/#publish-as-json) instead.

##### Other

We want to keep it simple for Sandstorm. Also these things require additional effort to implement in Sandstorm:

* Sending emails (requires extra work)
* "Service URL" field for sending notifications in the web interface (breaks Sandstorm's front end container model)
* Upstream servers (requires extra work, probably not a great fit for Sandstorm anyway)
* iOS push notifications ([requires upstream server](https://blog.ntfy.sh/2023/12/06/138-lines-of-code/#ios-app))
* Translations for Sandstorm-specific copy edits - Just a matter of time. But you can help! Reach out (see contacts above) to let me know if you'd like to help.

#### [Caveats about reliability](README_DETAILS.md#caveats-about-reliability)

**For the initial release we**:

- [x] Warn users about some reliability issues that may (or may not?) be inherent to this Sandstorm version (in the welcome screen).

#### [Caveats about privacy](README_DETAILS.md#caveats-about-privacy)

**For the initial release we**:

- [x] Explain to user that the server will be not be totally private (unlike most Sandstorm apps) because of the services that will ping it.
- [x] Low key mention this in description.md as well
- [x] Explain how to rotate the API URL in case they suspect unwanted use.
- [x] Make sure they don't share grains with other users.

#### [Missing instructions](README_DETAILS.md#missing-instructions)

**For the initial release we add:**

Usage instructions that ought to have been in ntfy regardless. (How UnifiedPush setup works, etc)

- [x] Unified Push description and instructions
- [x] Home-made scripts/apps description and instructions

## [Assorted](README_DETAILS.md#assorted)

- [x] Various other TODO items for initial release.

See link for details.

# [Validate](README_DETAILS.md#validate)

What to validate before any major release.

- [x] Validate before initial release.

# [Research](README_DETAILS.md#research)

What to learn about the system before initial release.

## [Connections](README_DETAILS.md#connections)

- [x] Confirm we don't need outbound requests
- [x] Confirm websockets work
- [x] Confirm proxy config is right (skipping it; no per-visitor rate limiting, but grain is limited to one user which is limited visitors)

## [Ntfy API](README_DETAILS.md#ntfy-api)

- [x] What is the "Admin API"?
- [x] What is a ntfy "account signup" and "account subscription" and "prefs"?
- [x] Does the ntfy CLI use json or headers? (It actually uses auth headers all the time, which is a dealbreaker)

## [Other](README_DETAILS.md#other)

- [x] Which integrations successfully work via the Sansdtorm ntfy app?
    * For initial release, I'm satisfied enough to think that most integrations will at least mostly work. I give caveats in the UI.
    * For future releases we can accumulate a list of "known works". (let me know if you'd like to report any successes/failures here)
- [x] Some security checks
- [x] Does private info get sent to the ntfy server for UnifiedPush messages?
    * Maybe. Some binary data comes through for Mastodon, not sure if encrypted or what. For Matrix it's some nondescript data comes with some IDs.
    * I'm gonna say, this has to be better than a public ntfy server. This should be as trusted as Sandstorm itself.
- [x] See what happens if I use multiple API URLs (nevermind; just tell them not to do this)
- [x] Try moving to a new ntfy grain, see how Android apps respond
- [x] Do UnifiedPush messages get cached? Are there any other differences with UP?

# Future

Some ideas for future versions if this gets traction. They may or may not work. See [README_FUTURE.md](README_FUTURE.md) for details.

* Molly support via Mollysocket
* Zulip partial support via a Zulip bot
* Action buttons on phone notifications that perform ntfy-related tasks
* Build into Tempest's notification system
* GUI-based ntfy configs (as opposed to env vars) in the Sandstorm portal via Extra API
* *More...*
