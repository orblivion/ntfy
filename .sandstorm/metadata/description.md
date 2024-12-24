# NOTE: This is not ready for regular use!

This is in the proof-of-concept phase.

In particular I suspect that it's insecure until I fix something in particular. And, if you connect your Android ntfy app to this Sandstorm app, Android apps such as Tusky may *automatically* configure itself to use your server. Which means hypothetically your push notification data could be exposed.

So please use with these concerns in mind!

# What is this

It's a push notification service. See here for the [main project](https://ntfy.sh). It seems that a decent number of apps use it. You can host it yourself. And hopefully we can make it available for Sandstorm. But, it needs a few touches before it's ready to go.

Right now it seems to work with Tusky, and you can use curl to trigger push notifications on your phone. But you have to set it up right.

# Want to help?

Check out the [README](https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm) in the Sandstorm directory for what's on the agenda. I'm still learning about this, so if you're well versed and are interested, even being around to answer questions would be very helpful!
