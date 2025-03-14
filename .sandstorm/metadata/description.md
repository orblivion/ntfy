With **ntfy**, you can get push notifications for many open source Android applications and other services without needing Google services. iOS support is limited.

Traditionally, push notifications for your Android apps are routed through Google services to save on bandwidth. ntfy replaces Google with something called [UnifiedPush](https://unifiedpush.org). Setup on your phone is done with the ntfy Android companion app, and is surprisingly simple!

ntfy supports [many apps](https://unifiedpush.org/users/apps/), like Tusky for Mastodon and Element for Matrix. Apart from apps, there are a number of [other integrations](https://docs.ntfy.sh/integrations/) that can send you notifications with ntfy. You can easily send notifications from your own custom scripts and applications too! The app will show you how.

*This app is recommended for convenience rather than "mission critical" applications.*

# ntfy for Sandstorm

The Sandstorm version of ntfy has some benefits and some drawbacks. For instance, the standard version of ntfy is built as a public server, whereas the Sandstorm version is built for a single user. This will give you more control over who is using your grain to relay notifications (hopefully only to you!). On the other hand, because of technical hurdles related to Sandstorm's strict security approach, ntfy's protected topics are not possible at this time.

There are a handful of other features that will not work quite the same here as in the standard version of ntfy. This is detailed in the app. If you find yourself missing one of them, please reach out, maybe it can be made it work. You can also look at the packager's tortured thoughts on all of this [here](https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md).
