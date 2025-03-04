# Changes and Issues

(summary in [README.md](README.md))

## Backend changes

### Headers vs JSON API

#### Explanation

The ntfy API has a "headers" version (i.e. fields are set in custom headers) and a JSON version. Sandstorm is very selective about the headers it accepts. Until and unless we update the Sandstorm platform, the headers version of the API is expected not to work. This will break any components (apps or services or some features) that rely on them.

But, as of now the system seems to work:

* Android UnifiedPush test Client can send notifications.
* Android and iOS ntfy clients can read notifications (It may be that subscribers do not need to send headers [unless we want auth]).
* Tusky/Mastodon sends timely notifications.
* For custom scripts, we can tell users to use the JSON version.

We can check a handful of popular services. If you've tested something that isn't on this list, please let us know!

However, we will need to maintain this list, as the services could always change to using the JSON api.

We might also be able to change Sandstorm to accept all these headers, but this seems like an extreme measure. A better idea IMO is to wait until Tempest, and add a pkgdef config to pass through specific headers.

#### Question

Why isn't UnifiedPush a json parameter? There is a X-UnifiedPush header after all. Are the servers (that are working thus far) using the query param thing instead? Hmm.

### Locking Down Topics

See the "Web UI"/"Caveats about privacy" section for details about why we want to lock this down. In short: while the domain (i.e., the API key) is randomized and can be revoked, this necessarily allows 3rd party services (Mastodon, etc) to see it when using UnifiedPush.

ntfy is by default a public website that multiple people use, where anybody can publish or subscribe to any topic. Privacy is generally maintained by creating random hard-to-guess topics, though there is an option to create an account and protect topics with a password. This being a Sandstorm port, we will do what we can to lock it down (even if we make it less flexible in the process; we are opinionated here). Unfortunately our options are limited, so we have to get creative.

In the below subsections, we explore our hypothetical options for locking down the ntfy instance:

* Fully public (i.e. not locking it down)
* Private topics (i.e. fully locked down, requiring authentication)
* Allowing monitoring activity on the server in the web interface, and send the user a notification when a new topic is created
* Requiring approval for new topics in the web interface

For now, we will settle for the monitoring option, assuming it's not deemed insecure. The reasons are given below.

#### Option: fully public server with no private topics

Give the user the same warning that ntfy.sh gives for free users: they should treat topic names as passwords to prevent snooping. If you choose a random enough topic, you should be safe from sooping.

Further, remind them that others may use your server for their own pub-sub, if they find your URL. That said, Sandstorm offers the mitigation is that your API URL is a secret between you and every service you use (Mastodon servers, Matrix servers, etc). The bad actors would be limited to those who operate those services.

The exception is if you *only* use it for notifications that you trigger yourself (via scripts, etc). But then, you have to be aware that the ntfy Android app will *automatically* give your URL to some services: If you have Tusky installed and you connect the ntfy Android app to your grain, it will subscribe you to Tusky *without asking you*. In my opinion, this makes it too much of a risk to recommend the script-only use case.

So, no other mitigations other than hard-to-guess topics. No private topics, no indication of who is using your grain, etc. I think we can do better than this.

#### Option: private topics

The best way to implement private topics is for all topics to be have a policy of being write-only, and give the user's ntfy app (and scripts) full read/write access (i.e. ntfy's "admin" role for users). https://docs.ntfy.sh/config/#access-control That way only the user's clients can read all of the messages, and all services can only write them.

The first benefit is that it will disuade malicious services you've connected to (i.e. a bad Mastodon server) from piggybacking on your grain for its own purposes. They can still write to arbitrary channels, but they can't read any of the messages that they wrote. This would make it pretty useless to them, and hopefully remove any incentive to bother writing.

The second benefit is that the user would be safe to use easy-to-guess channel names ("alerts", "camera", etc) for their scripts. (Though, bad actors could still write to them, but they'd have no idea if you're subscribed to them.)

To give the client full permission, we would need to set it up with a password or a token. For convenient ntfy client setup, we could present a token to users along with API key in the offer template. Ntfy seems to store tokens in cleartext anyway (you can query for them), so we can generate it once and show it to the user as many times as we need. For the web UI to read topics, we could just automatically log in with the same token (though maybe that's less secure than the original ntfy). We could maybe just write the token to a tmp folder and use Caddy's file_server to avoid writing a whole new server for the Extra API (unless we're writing one anyway for other reasons). We should probably disable any special endpoints that use the token though, such as password changing.

But there are two fatal problems with this:

Firstly, there are two ways to pass passwords and tokens in with requests: auth header or auth GET parameter. https://docs.ntfy.sh/subscribe/api/#authentication Since we can't pass auth headers into Sandstorm, we'd need our clients to go with the auth parameter. However, it seems like our main client, the Android app, [goes with the header](https://github.com/binwiederhier/ntfy-android/blob/f70c000b5615c52b3afaf3fb165cbead68ef2e4f/app/src/main/java/io/heckel/ntfy/msg/ApiService.kt#L187). While there may be other clients (and users might write their own), the benefit of private topics would be very limited.

Secondly, while we could log in via the web interface, the subscribed topics are stored client side, which will get periodicaly wiped due to how Sandstorm works. Though, we could perhaps persist the topic subscriptions as well using the Extra API, though again maybe that's less secure than the original ntfy.

For now I am skipping this. If users are interested in *limited* private topics for use with other clients (including home-made ones), let me know and I can try to figure that out.

QUESTIONS

* "Sign In Sign Up" on ntfy.sh is the "allow signups" config option? What would that even do without the ability to set ACL'd topics? Does it relate to Base URL?

See:

* `NTFY_ENABLE_LOGIN`, `NTFY_AUTH_DEFAULT_ACCESS`, and other related configs

#### Option: monitor currently used topics

Give the user some stats about how their grain is being used so they can catch unwanted users. There will be only one user per ntfy grain (see "Web UI"/"Caveats about privacy"). This means that, unlike with other ntfy installations, there should be no problem putting information in the Web UI about the whole system using a new "Extra API" (accessible only via the web), provided that this doesn't somehow introduce a new vulnerability.

Some ideas:

* Show recently used IP addresses, particularly for reads
* Show topic full info
	* Option 1) Recently used topics. Easier; can use notifications in cache
	* Option 2) All used topics. Harder; would need to keep a list additional to the cache
	* Possibly a security liability. Anybody with access to the server UI will be able to see topic names. Granted Sandstorm should protect you, but on the other hand this is something normal ntfy doesn't have.
		* If there is a breach and the user starts over with a new grain, any scripts that used ntfy should probably also use new topics to stay private. People may not think of this. Best to just not show topic names.
* Show topic partial info
	* No topic name, but give other info (Service type, whether it's UnifiedPush, last/first used, etc)
	* Again, either recently used or used across all time?
* Extra "System" topic: Give a notification when a new topic is subscribed/listened to.
	* Users can see unexpected activity right away. Give IP address etc if possible. "If you expected this, you can copy this topic and subscribe to it. If you did not expect this, you might consider resetting your API"
	* Have ntfy generate the topic for us for this, randomized for security, but also have a human readable part so users remember what it is and don't delete it. "system-hntuhitsh6th45" or something.
	* Start with a "welcome" message.
	* More uses for this topic over time
	* Showing the topic name has a breach risk similar to above. We could show "partial info" here instead, though then the user won't be able to conveniently copy/paste to subscribe from their client.

And then if they see something sketchy, we recommend that they rotate their credentials to boot off the unwanted users.

* Option 1) Encourage the user to delete the grain and start over
	* Easier option
	* If we ever do start using tokens, this will invalidate the token as well, which could make this a simple dual purpose "rotate keys" action
* Option 2) Show user how to delete API key, tell them to make a new one with the offer template
	* Doesn't delete other settings (if we have any, which is a big if)
	* In case the user has any notifications queued up, they won't accidentally lose them. (alternately we could just warn the user about this)

#### Option: approve new topics in the Web UI

Adding to the monitoring feature, we could require the user to approve new topics that appear in the Web UI. However, it may be a bad user experience, and not trivial to implement.

Also note that this will *not alert you* if anyone is snooping on or posting to a topic (perhaps you used an easy-to-guess topic name for a script). It will merely alert you to unwanted users publishing to new topics.

But, if enough people want it, it might be a viable optional feature.

#### Option: assorted hack ideas

I have other hack ideas that I kick around. I want to write them down so I don't forget them.

* What if we have two kinds of API keys. Only one can use "unified push" in the title? Or only long keys? (I don't think this works but maybe if I keep thinking down this path)
    * But then you'd need two "servers" in your Android app, which means it would make two separate connections. May as well just use a different grain.
* Could I have protected topics for POSTING that actually post to different topics? But then you have this stupid long password anyway. Pointless. Just use long topics.

## Web UI

### Security

For the Sandstorm version of ntfy, use Caddy to have a special "Extra API" path that is only accessible via the Sandstorm web portal (i.e. not under the API path which Android/iOS clients use). Since each grain is meant for one user, we treat that user effectively as an admin. We use this to add the extra functionality mentioned in the Backend Changes section.

In normal ntfy, the Web UI is just a simple client (i.e. no special permissions). For this Sandstorm app, this is true other than the Extra API that we are adding (and also ntfy's Admin API which might still be in beta?). The Web UI saves all of its data in browser local storage, which, as a Sandstorm app, gets periodically wiped due to how Sandstorm rotates subdomains. On the bright side, this means that the UI is harmless. It's a client like any other client. Even if a bad actor sees it via the API endpoint, they can't change anything because they shouldn't have access to the Extra API (and we should make sure they don't). However, this means that any settings (other than "Extra API" related things) will not survive long term. Language choice, subscribed topics, etc.

Separate from the Extra API, we will make use of the "offer template" which is a facility from the Sandstorm platform. I don't think Sandstorm exposes this via the API path, so this is again only via the Sandstorm web portal.

### Link to URL to put into phone app

The URL we give to the user to connect to their phone is not the Web UI URL. We need a special "API URL" that Sandstorm facilitates. We provide it to the user using something called the "offer template" in Sandstorm parlance.
* Offer Template text should include something like "put this into the 'default server' option in your ntfy Android app and you'll be connected!"
* Regarding the URL format: I'm assuming that `https://domain/path/` works across UnifiedPush. And I'm assuming that `https://basic:auth@domain` does not. So I went with the former format. I wonder if these assumptions are wrong, in which case we may consider changing the format given here. But for simplicity and laziness I'll probably stick to what I have, it's just a bit ugly.
* Make sure that the offer template API doesn't work over API endpoint!

### Remove features

We should figure out what everything in the UI does, and remove things we don't want (such as the User/Password thing).

Check out: public/config.js maybe this can do a lot of it for us

* Docs
	* Link to ntfy.sh/documentation. Or should we just build docs locally if it's not too hefty?
	* Open a dialog. Warn the user that it may not 100% reflect the Sandstorm implementation. Then give link.
    * Invite people to talk to us about it if they want help with Sandstorm-specific one.
* "Logging in"
* "Server" fields, for sending notifications, etc. Just assume this server.
    * It's a "power user" feature. This being Sandstorm, I'm going to be opinionated and just axe it.
    * What was that place in the UI where I saw the ui-* URL? Make sure that doesn't show up either.
* Etc.

### Info in the UI

Actually explain this stuff to the user

#### Caveats about missing features

In the UI and package description (Make a simple list, but link to the README):

* Note that the custom Sandstorm code will only be in English. We should still use translation codes, and could solicit translations.
* Warn the user that their web-based configs will not be saved.
	* By the language picker so they're not confused about it later.
	* Topic subscriptions should only be used for testing, and maybe we should rename them accordingly. "Send test notification" "Test topics".
		* Though we may be giving the web UI access to topics via the "Extra API" we're adding. So perhaps we could go ahead and subscribe it to all topics. This is a possibility, but it may not be worth the security risk.
	* Give a link to "learn more" about why it's different from ntfy, perhaps, or just say to read the description of the project in the market.
* Note that the Sandstorm version of ntfy may not work for certain services.
	* It works so for:
		* Tusky on Mastodon.
	* Help us test more:
		* https://docs.ntfy.sh/integrations/
		* https://unifiedpush.org/users/apps/
        * Mention that it's becasue of headers (maybe move most of the "Headers vs JSON API" section to here.)
* Explain that the Desktop PWA will not work with the Sandstorm version (due to rotating ui subdomains).
        * In the far future, PWAs would be great for Sandstorm, but it will probably need to wait for Tempest.
* We won't support Desktop Notifications out of the box.
	* Reasons
		* Sandstorm changes subdomains for grains regularly. ntfy stores its information in the browser, tied to the subdomain. So any subscriptions would be lost.
		* Grains may fall asleep so users might miss the notifications. (I'm not totally sure about this one. Maybe it'll stay awake if you just leave the tab open)
		* The UI says "notifications not supported" in UI. (Perhaps because the reverse proxy is http? We'd need to look into it.)
	* If you're a user and Desktop notifications are a priority, we can look at working around these issues. One odd idea is that we could look into users opening an API endpoint in the browser. That would at least be a consistent domain.
* Protected topics (again because of headers).
* "Forward to email"
        * Email might require outbound connections, which we could add.
* "Service URL"
        * Other servers would require making a request to a different domain from the browser. Not sure if this is allowable in the current Sansdtorm model.
        * I figured this feature would be overly complicated anyway
* Attachments
	* Attachments (`NTFY_ATTACHMENT_CACHE_DIR`) requires `BASE_URL`, I think because it's serving files at a full URL.
        * We can't have a `BASE_URL`
            * The ui subdomain (in Sandstorm) always changes
            * The API URL is bound to change and should not be made available to the application anyway
	* For the future we can perhaps employ static publishing which will have a steady subdomain.
            * So long as we can make it a directory that ntfy can still delete file that have left the cache expiry time.
	* Also, removing attachments reduces the attack surface for abusive behavior since the server is wide open.
            * We may wan to try to implement authentication (protected topics) first.
	* Be mindful of all configs with "attachment" in the name. They're not all in a row.
* Setting `NTFY_BEHIND_PROXY` - Sandstorm doesn't pass through `X-Forwarded-For`.
    * All visiors to a grain will be rate limited as if they are one visitor
    * Each grain is for one user, which is let's say 30 visitors (one per topic)
    * We can 30x the visitor rate limit instead.
        * One bad visitor could take out the grain but it's just one grain.
        * Thus, we effectively have a per-user rate limit.

#### Caveats about reliability

In the UI and package description:

Warn users that notifications disappear after 12 hours.

Missing messages:
* "Convenience, not mission critical" - Particularly the Sandstorm version. It's got a lot of caveats for techincal reasons. Things may even stop working (if they start using the headers API, etc).
* "when you upgrade, restart your Android app or you will lose messages". This is probably more on Android than the server but whatever.

#### Caveats about privacy

Put it in the web UI somewhere, and package description. Summarised nicely, bolded sections, with links or dropdowns for more info. Or perhaps, by the relevant sections in a rectangle with a warning icon?:

Unlike most Sandstorm apps, ntfy is meant to receive updates from services on the open Internet. Any service that sends you notifications will have access to your API Key, and can thus publish or subscribe to notifications.

For this reason, you should treat your topic names like passwords, so other services can't read them. UnifiedPush-enabled apps pick good topics automatically. If someone gets access to your web interface (assuming we show topic names there, which we probably won't) or otherwise sees your topic names, you may want to change them. As of now, you cannot use the ntfy user accounts to protect your topics. (see here for why [link to locking down topics in the readme?])

The API URL will be secret and randomized, and can be revoked, but the services you get notifications from will necessarily be able to contact your ntfy grain. Furthermore, if you install ntfy and Tusky, Tusky will configure itself with ntfy **without prompting you**, giving your API URL to your Mastodon servers. This is very slick UI-wise, but be warned that it exposes your API key to the Mastodon servers where you have an account. This may way apply to other apps and services as well.

The Sandstorm version of ntfy is made for one **user per** grain. It is not advised share this with friends nor to use it to broadcast messages to them. The web interface in the Sandstorm version will have extra data about the topics.

(This sucks but I want to warn ntfy users somehow, when it happens, assuming the built-in Accounts API isn't enough) Note for normal ntfy users: Unlike normal ntfy, we are adding a special "Extra API" path only accessible via Sandstorm's web portal. [See here](README LINK) for more.

Warn users that stick around for 12 hours.

Don't use the "webkey", use the API URL we give you. (I'm not sure yet if this matters. We might place special permissions restrictions on the API URL.)

#### Missing instructions

(IMHO this would be good to put into the normal ntfy UI. Maybe I could upstream it.)

How to use it for UnifiedPush, and that it's a separate thing from scripts that message it. Have a link to the "publish" doc. Maybe this is a section called "setup" or "configure" or "send messages" or "how to use" or "how to connect" or "how to send messages" or whatever to get people to look. And maybe have this be a section instead of "docs", but it should have the "docs" link here, which will go to official ntfy docs with the caveat that it doesn't strictly apply to the Sandstorm version.

## Assorted

* Figure out why go.sum changed when I ran `make` for linux?
* Make a version for my release - v2.11.0~s1 - As a git tag along my Sandstorm fork, and in pkgdef.
* Block all access for shared grains.
    * If need be, only create one sharing profile and one permission, and don't include the permission?
    * Can't rely on checking X-Sandstorm-User because they might share with an authenticated user.
    * Or see how other apps do it.
    * Since we're using `forSharing`, the API token can be used to create an anon share URL.
* Figure out the meaning of this: `"prefs_users_description_no_sync": "Users and passwords are not synchronized to your account."`
    * What's the difference between a "User" and an "Account"?
    * I thought "logging in as a user" was just for protected topics. But why does it have a server URL field, even in the web UI where the server should be implicit?
    * I think this is related to the Admin API (which ntfy released as beta in 2023)
        * Though it may be pretty much the same as my "Extra API", heh.
        * Make a note to use this API for the future perhaps.
        * Is this another security risk, leaving the web URL open?
            * I don't think so. Previously I was worried because you could "add and remove users" but that turned out to be client side only. In this case, whatever it is, I think it requires an admin user to log in first.
            * Just make sure we don't have a vulnerable admin account, or make sure to turn off admin in configs
            * Make sure we note to not use admin users as a shortcut for "all read access" in the future, since it could open the API inadvertently
* Check out server/types.go:publishMessage
    * see if anything else looks like it should be checked?
    * Maybe some aspects of it won't work with the connections available with Sandstorm?
    * Why isn't UnifiedPush a parameter here?
* Check out `sandstorm-files.list`. A few things in there maybe don't belong. But also maybe some things we want to add more of, like timezones? But also - is the Python used? Is the node used? Why aren't they in there?
* Confirm licenses for everything I use
* Ntfy - Put Sandstorm ntfy on the [ntfy integrations page](https://docs.ntfy.sh/integrations/) next to cloudtron! Merge into ntfy?
* Describe the limitations and warnings in description.md - see "Caveats about missing features" "Remove Features" etc
* Read? https://docs.ntfy.sh/config/#behind-a-proxy-tls-etc
* Think about upgrades - this is more vulnerable than most Sandstorm apps.
    * I can't make them upgrade. I have to be on top of building upgrades though! Make sure it's easy for me to build.
* What about "deleted" data in the browser UI? Does that use a browser cache that auto expires? or does ntfy handle the deletion?
    * If ntfy handles it, we're in trouble. Need to inform user I guess. Or, just axe the whole "test notifications" thing.
    * Maybe I could just turn off storing it in a cookie or local db. Just leave it in a "global variable"; something that doesn't survive a page reload.
* See if I can improve reliability of upgrades with `NTFY_KEEPALIVE_INTERVAL`
* See about increasing the per-visitor limits with `NTFY_VISITOR_*` to account for all the visitors that one user could use. 30x or something.

# Validate

To learn about the system and/or to validate before release. In particular, if we make a big change like starting to use Caddy, or adding Websocket support (assuming we don't have it on day one), that the behavior stays the same. And we should test these with websockets and with the other kind of connection.

* Test that known working apps still work
    * Tusky
    * (TODO - add to list - see research)
* Test that clients still work
    * Android
    * iOS
* Various connections work
    * Websocket
    * JSON stream over HTTP
    * Over a cell connection (for both of the above)
* Server security and performance testing
    * Make sure API response time from a sleeping grain is low
    * Make sure curl $API/$ADMIN/$EXTRA URLS (if/when we implement them) don't give admin/extra powers

# Research

## Connections

* Outbound requests: hopefully ntfy doesn't need to do any. If it does, we need to allow it (by default Sandstorm does not).
* Websockets: Currently websocket connection on phone doesn't seem to work (update: I was wrong?). And if I do Caddy I especially need to consider this question: https://docs.ntfy.sh/config/#nginxapache2caddy Check how resilient the app is after this.
* Proxy config - `NTFY_BEHIND_PROXY` - confirm that `X-Forwarded-For` header comes through. DOS is more relevant here than most Sandstorm apps since we'll be necessarily be getting the outside world (albeit only a handful of services) pinging us.
    * Answer: No `X-Forwarded-For` but it's fine. See `NTFY_BEHIND_PROXY` below.

## Ntfy API

* Make sure ntfy's Admin API doesn't somehow get activated for us
* What is a ntfy "account signup" and "account subscription"?
* Does the ntfy CLI use json or headers? (Recommend it or warn against using it)

## Other

* Which apps and services work?
    * [Android apps via UnifiedPush](https://unifiedpush.org/users/apps/) (Tusky, Element, etc) and related services (Mastodon, Matrix, etc)
        * Maybe it can actually handle WebPush point blank? In which case I don't need to test them all?
            * But WebPush seems to use an auth header. Which would mean it should never work, but it sometimes does. What's up?
                * https://codeberg.org/UnifiedPush/android-example
                * https://unifiedpush.org/
                * https://web.dev/articles/push-notifications-web-push-protocol
                * Check the WebPush go code!
            * If it turns out I do need WebPush, see all the `NTFY_WEB_PUSH_*` configs.
            * I was wondering why there is there a UnifiedPush header, but not a json field for the same purpose.
                * Is it because UnifiedPush is a different protocol altogether? After all it works for other servers, not just ntfy.
                * Is it WebPush (as per the diagram on UnifiedPush's website? Is this related to the WebPush go endpoint?
    * [Other integrations](https://docs.ntfy.sh/integrations/)
    * List them under Validate so we can keep testing them.
    * List them in description.md - useful for people considering using it
    * Watch the database. See if it sees notifications for those apps.
        * Try subscribing to the up* (unifiedpush) topics as if they're normal topics, while I'm at it. What shows up?
* Security
    * Make sure I can't somehow get the offer template via the API. Try opening it in a browser to see.
        * Don't forget that we're not calling Sandstorm at the root URL. Does that matter though?
        * I think it makes requests to parent though.
* Does private info get sent to the ntfy server?
    * When you let's say install ntfy, do all Tusky notification CONTENTS go to ntfy server (including DMs)?
        * And it's initially configured to ntfy.sh, before you even realize what's happening.
    * What about Element, etc?
    * I could try to find a "verbose" mode for ntfy and just dump everything it's getting from the server.
    * Hopefully ntfy just gets a "ping" to let it know to pull from the server.
    * Watch the database. See if it gets the contents of Matrix messages etc.
        * Try subscribing to the up* (unifiedpush) topics as if they're normal topics, while I'm at it. What shows up?
* See what happens if I use multiple API URLs.
    * If I use it on two different phones, will I get duplicate Mastodon (etc) notifications? Or will it be a different topic per phone?
        * Because the service sees two different ntfy servers to update. Even though it's actually the same server.
        * What about two phones with the same API key?
    * If I use it for scripts, will it be okay?
    * If I change the "default server" on Android to a new API URL, will all the topics (UnifiedPush and otherwise) continue to work okay? (This is sort of an Android app issue)
    * If it turns out that something goes wrong, we should put in some language that we should avoid using different API URLs (which SUCKS UI-wise since it never shows the same one twice)
* Try moving to a new grain?
    * See how fast that updates?
    * Do I keep all my existing topics? Or at least the same notification configs for UnifiedPush even if it changes topics?
    * If so, that makes the jettison-restart strategy (in case of compromise) fast.
* Do UnifiedPush messages get cached? Are there any other differences with UP?
* BaseURL - Can I leave blank? The grain URL only works with Sandstorm. The ui subdomains rotate. The API URL shouldn't be known to the app.
    * On the backend, it's used for a bunch of stuff that's not enabled anyway, and/or blank is fine.
        * I will miss it for attachments, but that is looking for a full URL. I can do static hosting for that in a future release.
    * On the frontend, it uses the ui subdomain, which is a bit disconcerting, but it's pretty much for identifying user accounts for subscriptions and stuff.
        * I confirmed that no base_url ends up getting passed to the backend and saved to the cache db (and cached messages would get auto-deleted anyway)
