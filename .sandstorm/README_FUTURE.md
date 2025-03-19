# Future

*(Should reorganize this into "quick followups" vs significant new features)*

## List of working / not working integrations

 (This is where I could use a lot of help!)

* [Android apps via UnifiedPush](https://unifiedpush.org/users/apps/) (Tusky, Element, etc) and related services (Mastodon, Matrix, etc)
    * I've been told that UnifiedPush may always use json actually, so maybe we can just guess that it all works and see what people report.
* [Other integrations](https://docs.ntfy.sh/integrations/)
* List them under Validate in README_DETAILS.md so we can keep testing them.
* List them in description.md - useful for people considering using it.

## Subscriptions on web, again

Put subscriptions back in the web UI if people want it for testing. I just don't want to worry about the old notifications being there as a liability, lost in the rotating ui subdomains.

## Better UI

Add some pictures to the onboarding to counteract all that text. Think of ways to remove more things.

## Molly

Check out Molly support via Mollysocket? Can I bundle this with ntfy? Would be super dope. But it has challenges. Supposedly it doesn't need your decryption key but how does it become a connected device? You'd need to trust it. I don't think Signal users should just trust my code, though again they can see if I'm exfiltrating.

https://github.com/mollyim/mollysocket

Anything else like this that I could bundle?

## Zulip

Zulip doesn't support UnifiedPush. Could we make it work with a bot? For channels, yes. Or (much more dangerous) having credential access to your very account for IMs. Maybe could give it just read-only access?

Filters for things to notify on, etc. Total hack! But it's something. eh? Likely confusing since Zulip has its own notification settings.

Make it clear that this is a temporary thing until they add actual support.

Make it clear that this won't be encrypted from Zulip server to phone. UnifiedPush might be?

Also multiple Zulip accounts, sheesh.

"If you trust the Sandstorm platform, you'll know that we're not exfiltrating data".

Also should I add this upstream? On the one hand, ntfy includes a Matrix bridge. On the other hand, they don't include Mollysocket.

## Integrations

### Write-only role

Have a separate UI for giving API URLs for Integrations. Since they won't be used for UnifiedPush, we can give write-only permissions for those URLs.

We can generate a topic for them (using the existing topic generation code). We can restrict those write-only permissions to that topic.

We do this by assigning a different Sandstorm role, via the offer template. If we want just one topic that they can write to, we could even have a different role for each integration.

The simple version, though, is just a single "integrations" role that is write-only, and expose the API URLs with that role in an "integrations" section of the UI.

### Pet Names and other parameters

We could let the user enter a "Pet name" in the UI, so it's easier to manage in Sandstorm's web key menu. We could encourage them to write in the integration that they're doing this for.

However, we could also have a dropdown menu with preset configurations. It pre-fills the pet name. Less thinking for them. Just need a "other" one where they put their own.

But the coolest part: For the "Zulip" integration, we add fields.

Problem would be is if we have multiple of the same integration. Two Zulips, etc. May want custom pet name or pet name parts.

In the far future "This Sandstorm App", "That Sandstorm App" become listed permissions.

And maybe "for your phone" / "Unified Push" just becomes part of this menu.

## Sandstorm App Notifications

Maybe we could have one randomly generated topic that all Sandstorm apps push to. To avoid a bunch of manual subscriptions. Send the new topic to the phone over the "System Topic" I suppose. Maybe this would be integrated somehow. Maybe it's just a suggestion given to the user.

MAYBE it's a different API URL with different permissions. Give it to Sandstorm apps, they don't need to find the Sandstorm topic, it is handed to them or something. You could even change it. I dunno if this would be useful in any way.

But really though, it should be a powerbox thing when we get around to figuring that out.

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

And/or perhaps some apps already have ntfy hooks. Maybe Tempest could read those and turn them into Tempest notifications (and then back into ntfy notifications, if applicable?). Though if they're UnifiedPush enabled, they have their own Android apps that will find the ntfy Androyd app and configure with the ntfy grain that way. It could get muddled.

## GUI-based configs

Cache lifetime, private topics (if we find a way to do this), other env vars.

## Group grains

Sandstorm lets you make multiple "types" of grains per app. We could make a "group" type grain if people keep using it for groups when they're not supposed to. It just removes any "admin" type capabilities etc.

HOPEFULLY IT WILL NOT COME TO THIS but I wanted to mark it down because I thought of it.

## QR code for generating random topics

In the Web UI there is a "Generate random topic" for subscribing. It would be nice if it was in a more general-purpose tabs than "subscribe to topic". I could imagine wanting a new topic to copy/paste into my script and not wanting to subscribe in the browser. Rather, I'd want to subscribe on my phone. In which case I'd want a QR code to pop up!

Could just as well be an upstream feature.

## Hosting Icons

There's an Icon field. It takes a URL. It would be nice if the image at the end of it were hostable as part of the app.
