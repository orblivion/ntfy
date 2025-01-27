# Changes and Issues - Lots of detail

(summary in [README.md](README.md))

## Backend changes

### Connections

* Outbound requests: hopefully ntfy doesn't need to do any. If it does, we need to allow it (by default Sandstorm does not).
* Websockets: Currently websocket connection on phone doesn't seem to work. And if I do Caddy I especially need to consider this question: https://docs.ntfy.sh/config/#nginxapache2caddy Check how resilient the app is after this.
* Proxy config - `NTFY_BEHIND_PROXY` - confirm that `X-Forwarded-For` header comes through. DOS is more relevant here than most Sandstorm apps since we'll be necessarily be getting the outside world (albeit only a handful of services) pinging us.

### Attachments

Attachments (`NTFY_ATTACHMENT_CACHE_DIR`) requires `BASE_URL`. I have to figure out what I should put for the latter, since the user's UI is a different domain than the API! Just how Sandstorm works.

Does `BASE_URL` relate to what gets displayed to the user? In what context?

### Headers vs JSON API

#### Explanation

The ntfy API has a "headers" version (i.e. fields are set in custom headers) and a JSON version. Sandstorm is very selective about the headers it accepts. Until and unless we update the Sandstorm platform, the headers version of the API is expected not to work. This will break any components (clients or services) that rely on them.

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

The best way to implement private topics is for all topics to be have a policy of being write-only, and give the user's ntfy app (and scripts) full read/write access (i.e. ntfy's "admin" role, not the same as the "Admin API" mentioned elsewhere). https://docs.ntfy.sh/config/#access-control That way only the user's clients can read all of the messages, and all services can only write them.

The first benefit is that it will disuade malicious services you've connected to (i.e. a bad Mastodon server) from piggybacking on your grain for its own purposes. They can still write to arbitrary channels, but they can't read any of the messages that they wrote. This would make it pretty useless to them, and hopefully remove any incentive to bother writing.

The second benefit is that the user would be safe to use easy-to-guess channel names ("alerts", "camera", etc) for their scripts. (Though, bad actors could still write to them, but they'd have no idea if you're subscribed to them.)

To give the client full permission, we would need to set it up with a password or a token. For convenient ntfy client setup, we could present a token to users along with API key in the offer template. Ntfy seems to store tokens in cleartext anyway (you can query for them), so we can generate it once and show it to the user as many times as we need. For the web UI to read topics, we could just automatically log in with the same token (though maybe that's less secure than the original ntfy). We could maybe just write the token to a tmp folder and use Caddy's file_server to avoid writing a whole new server for the Admin API (unless we're writing one anyway for other reasons). We should probably disable any special endpoints that use the token though, such as password changing.

But there are two fatal problems with this:

Firstly, there are two ways to pass passwords and tokens in with requests: auth header or auth GET parameter. https://docs.ntfy.sh/subscribe/api/#authentication Since we can't pass auth headers into Sandstorm, we'd need our clients to go with the auth parameter. However, it seems like our main client, the Android app, [goes with the header](https://github.com/binwiederhier/ntfy-android/blob/f70c000b5615c52b3afaf3fb165cbead68ef2e4f/app/src/main/java/io/heckel/ntfy/msg/ApiService.kt#L187). While there may be other clients (and users might write their own), the benefit of private topics would be very limited.

Secondly, while we could log in via the web interface, the subscribed topics are stored client side, which will get periodicaly wiped due to how Sandstorm works. Though, we could perhaps persist the topic subscriptions as well using the Admin API, though again maybe that's less secure than the original ntfy.

For now I am skipping this. If users are interested in *limited* private topics for use with other clients (including home-made ones), let me know and I can try to figure that out.

QUESTIONS

* "Sign In Sign Up" on ntfy.sh is the "allow signups" config option? What would that even do without the ability to set ACL'd topics? Does it relate to Base URL?

See:

* `NTFY_ENABLE_LOGIN`, `NTFY_AUTH_DEFAULT_ACCESS`, and other related configs

#### Option: monitor currently used topics

Give the user some stats about how their grain is being used so they can catch unwanted users. There will be only one user per ntfy grain (see "Web UI"/"Caveats about privacy"). This means that, unlike with other ntfy installations, there should be no problem putting information in the Web UI about the whole system using a new "Admin API" (accessible only via the web), provided that this doesn't somehow introduce a new vulnerability.

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

#### Option: approve new topics in the admin

Adding to the monitoring feature, we could require the user to approve new topics that appear in the admin. However, it may be a bad user experience, and not trivial to implement.

Also note that this will *not alert you* if anyone is snooping on or posting to a topic (perhaps you used an easy-to-guess topic name for a script). It will merely alert you to unwanted users publishing to new topics.

But, if enough people want it, it might be a viable optional feature.

## Web UI

### Security

For the Sandstorm version of ntfy, use Caddy to have a special "Admin API" path that is only accessible via the Sandstorm web portal (i.e. not under the API path which Android/iOS clients use). Since each grain is meant for one user, we treat that user as an admin. We use this to add the extra functionality mentioned in the Backend Changes section.

In normal ntfy, the Web UI is just a dumb client. For this Sandstorm app, this is true other than the Admin API that we are adding. The Web UI saves all of its data in browser local storage, which, as a Sandstorm app, gets periodically wiped due to how Sandstorm rotates subdomains. On the bright side, this means that the UI is harmless. It's a client like any other client. Even if a bad actor sees it via the API endpoint, they can't change anything because they shouldn't have access to the Admin API (and we should make sure they don't). However, this means that any settings (other than "Admin API" related things) will not survive long term. Language choice, subscribed topics, etc.

Separate from the Admin API, we will make use of the "offer template" which is a facility from the Sandstorm platform. I don't think Sandstorm exposes this via the API path, so this is again only via the Sandstorm web portal.

### Link to URL to put into phone app

The URL we give to the user to connect to their phone is not the Web UI URL. We need a special "API URL" that Sandstorm facilitates. We provide it to the user using something called the "offer template" in Sandstorm parlance.
* Offer Template text should include something like "put this into the 'default server' option in your ntfy Android app and you'll be connected!"
* Regarding the URL format: I'm assuming that `https://domain/path/` works across UnifiedPush. And I'm assuming that `https://basic:auth@domain` does not. So I went with the former format. I wonder if these assumptions are wrong, in which case we may consider changing the format given here. But for simplicity and laziness I'll probably stick to what I have, it's just a bit ugly.
* Make sure that the offer template API doesn't work over API endpoint!

### Remove features

We should figure out what everything in the UI does, and remove things we don't want (such as the User/Password thing).

* Hide "URL" fields in forms? Since we can't ping outside servers anyway.
* Docs
	* Link to ntfy.sh/documentation. Or should we just build docs locally if it's not too hefty?
	* Warn the user that it may not 100% reflect the Sandstorm implementation
* "Logging in"
* Etc.

### Info in the UI

Actually explain this stuff to the user

#### Caveats about missing features

In the UI and package description:

* Note that the custom Sandstorm code will only be in English. We should still use translation codes, and could solicit translations.
* Warn the user that their web-based configs will not be saved.
	* By the language picker so they're not confused about it later.
	* Topic subscriptions should only be used for testing, and maybe we should rename them accordingly. "Send test notification" "Test topics".
		* Though we may be giving the web UI access to topics via the "Admin API" we're adding. So perhaps we could go ahead and subscribe it to all topics. This is a possibility, but it may not be worth the security risk.
	* Give a link to "learn more" about why it's different from ntfy, perhaps, or just say to read the description of the project in the market.
* Note that the Sandstorm version of ntfy may not work for certain services.
	* It works so for:
		* Tusky on Mastodon.
	* Help us test more:
		* https://docs.ntfy.sh/integrations/
		* https://unifiedpush.org/users/apps/
* Explain that the Desktop PWA will not work with the Sandstorm version. (In the far future, PWAs would be great for Sandstorm)
* We can't support Desktop Notifications out of the box.
	* Reasons
		* Sandstorm changes subdomains for grains regularly. ntfy stores its information in the browser, tied to the subdomain. So any subscriptions would be lost.
		* Grains may fall asleep.
		* The UI says "notifications not supported" in UI. (Perhaps because the reverse proxy is http? We'd need to look into it.)
	* If you're a user and Desktop notifications are a priority, we can look at working around these issues. One odd idea is that we could look into users opening an API endpoint in the browser. That would at least be a consistent domain.

#### Caveats about reliability

In the UI and package description:

Warn users that notifications disappear after 12 hours.

"Convenience, not mission critical" - particularly the Sandstorm version. it's got a lot of caveats for techincal reasons.

#### Caveats about privacy

Put it in the web UI somewhere, and package description. Summarised nicely, bolded sections, with links or dropdowns for more info. Or perhaps, by the relevant sections in a rectangle with a warning icon?:

Unlike most Sandstorm apps, ntfy is meant to receive updates from services on the open Internet. Any service that sends you notifications will have access to your API Key, and can thus publish or subscribe to notifications.

For this reason, you should treat your topic names like passwords, so other services can't read them. UnifiedPush-enabled apps pick good topics automatically. If someone gets access to your web interface (assuming we show topic names there, which we probably won't) or otherwise sees your topic names, you may want to change them. As of now, you cannot use the ntfy user accounts to protect your topics. (see here for why [link to locking down topics in the readme?])

The API URL will be secret and randomized, and can be revoked, but the services you get notifications from will necessarily be able to contact your ntfy grain. Furthermore, if you install ntfy and Tusky, Tusky will configure itself with ntfy **without prompting you**, giving your API URL to your Mastodon servers. This is very slick UI-wise, but be warned that it exposes your API key to the Mastodon servers where you have an account. This may way apply to other apps and services as well.

The Sandstorm version of ntfy is made for one **user per** grain. It is not advised share this with friends nor to use it to broadcast messages to them. The web interface in the Sandstorm version will have extra data about the topics.

(This sucks but I want to warn ntfy users somehow) Note for normal ntfy users: Unlike normal ntfy, we are adding a special "Admin API" path only accessible via Sandstorm's web portal. [See h
ere](TODO) for more.

Warn users that stick around for 12 hours.

#### Missing instructions

(IMHO this would be good to put into the normal ntfy UI. Maybe I could upstream it.)

How to use it for UnifiedPush, and that it's a separate thing from scripts that message it. Have a link to the "publish" doc. Maybe this is a section called "setup" or "configure" or "send messages" or "how to use" or "how to connect" or "how to send messages" or whatever to get people to look. And maybe have this be a section instead of "docs", but it should have the "docs" link here, which will go to official ntfy docs with the caveat that it doesn't strictly apply to the Sandstorm version.

## Assorted

* Figure out why go.sum changed when I ran `make` for linux?
* Make a version for my release - v2.11.0~s1 - As a git tag along my Sandstorm fork, and in pkgdef.
* Server security and performance testing (mostly not necessary until we add the Admin API)
	* Make sure API response time from a sleeping grain is still low now that I'm using Caddy
	* Make sure curl $API/$ADMIN URLS don't give me the admin
	* Make sure I can't somehow get the offer template via the API. Try opening it in a browser to see.
		* Don't forget that we're not calling Sandstorm at the root URL. Does that matter though?
		* I think it makes requests to parent though.
* Block all access for shared grains.
    * If need be, only create one sharing profile and one permission, and don't include the permission?
    * Can't rely on checking X-Sandstorm-User because they might share with an authenticated user.
    * Or see how other apps do it.
* Maybe consider other useful configs: https://docs.ntfy.sh/config/
* Check out server/types.go:publishMessage
    * see if anything else looks like it should be checked?
    * Maybe some aspects of it won't work with the connections available with Sandstorm?
    * Why isn't UnifiedPush a parameter here?
* Check out `sandstorm-files.list`. A few things in there maybe don't belong. But also maybe some things we want to add more of, like timezones? But also - is the Python used? Is the node used? Why aren't they in there?
* Confirm licenses for everything I use
* Ntfy - Put Sandstorm ntfy on the ntfy page next to cloudtron! Merge into ntfy?
* Describe the limitations and warnings in description.md - see "Caveats about missing features" "Remove Features" etc
* Read? https://docs.ntfy.sh/config/#behind-a-proxy-tls-etc
* Put data retention back to 12 hours
