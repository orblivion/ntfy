# v2.13.0-sandstorm-11

Initial release of the Sandstorm fork.

* Adds onboarding
* Adds a whole bunch of caveats and warnings about the limitations of the Sandstorm fork
* Removes a handful of features from the UI that won't work well with the Sandstorm fork
* Adds "admin" permission for grain UI and "fullapi" permission for ntfy topic communication.

For now the permissions only show an error screen if you try to share the grain with an anon user. In the future it'll be used to guard admin features in the UI. I may also add read-only API URLs but that will require new permissions.
