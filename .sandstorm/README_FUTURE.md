# Future

## Molly

Check out Molly support via Mollysocket? Can I bundle this with ntfy? Would be super dope. But it has challenges. Supposedly it doesn't need your decryption key but how does it become a connected device? You'd need to trust it. I don't think Signal users should just trust my code, though again they can see if I'm exfiltrating.

https://github.com/mollyim/mollysocket

Anything else like this that I could bundle?

## Zulip

Zulip doesn't support UnifiedPush. Could we make it work with a bot? For channels, yes. Or (much more dangerous) having credential access to your very account for IMs. Maybe could give it just read-only access?

Filters for things to notify on, etc. Total hack! But it's something. eh? Likely confusing since Zulip has its own notification settings.

Make it clear that this is a temporary thing until they add actual support.

Also multiple Zulip accounts, sheesh.

"If you trust the Sandstorm platform, you'll know that we're not exfiltrating data".

## Action buttons

See here: https://docs.ntfy.sh/publish/#action-buttons

The System Topic that I have in mind would send alerts about new topics being subscribed. It would be awesome if we could add a couple actions to it:

* Subscribe to this topic (if it's not a UnifiedPush topic)
	* For subscribing, we can do a "view" action with a ntfy link (https://docs.ntfy.sh/subscribe/phone/#ntfy-links)
* Approve this topic (if we decide to require approval for new topics)
	* We can do a POST request action.

The reason this is not possible now is that for both of these, we need the full domain, i.e. the API endpoint. As of now this info is not available to Sandstorm apps.

Another cool thing we could do is for any Sandstorm apps that send notifications via the ntfy app, is to have action buttons that open the notifying app's grain. But again, that would require the grain's URL (not just the ui-domain), or a share URL. Again AFAIK these are not available to any apps. Similarly, we could have the action button send a POST request to the notifying app, to trigger some action. But again, that would require an API key.

The one thing we could do today is use the "view" to open a normal https URL, or perhaps trigger an an Android "broadcast" (to apps on the phone). But that's more for the user's scripts to use, not something we need to think about as we develop and package this app.

## Build into Tempest's notification system

Let's say a sandstorm app wants to send a notification and you want it on your phone via ntfy. Instead of needing to do a powerbox connection to a ntfy grain, let's have ntfy be a "system grain" with special privileges to read notifications on Tempest itself and propagate them to the user's phone. That way apps need only trigger normal Tempest (Sandstorm) notifications. Perhaps we add some extra metadata.

## GUI-based configs

Cache lifetime, private topics (if we find a way to do this), other env vars.
