# v2.15.0-sandstorm-14

Upgrade to [ntfy v2.15.0](https://github.com/binwiederhier/ntfy/releases/tag/v2.15.0) (with Sandstorm changes on top). For ntfy-Sandstorm, this adds:

* Mitigation around "database locked" errors (probably not an issue for Sandstorm because it's low traffic anyway)
* Build with `nopayments`, `nofirebase`, and `nowebpush` in hopes of making a slightly smaller download (and hypothetically smaller attack surface)

# v2.14.0-sandstorm-12

Upgrade to [ntfy v2.14.0](https://github.com/binwiederhier/ntfy/releases/tag/v2.14.0) (with Sandstorm changes on top). For ntfy-Sandstorm, this adds:

* pre-defined templates (github, grafana, etc)
* sprig template functions

# v2.13.0-sandstorm-11

Initial release of the Sandstorm fork.

* Adds onboarding
* Adds a whole bunch of caveats and warnings about the limitations of the Sandstorm fork
* Removes a handful of features from the UI that won't work well with the Sandstorm fork
* Adds "admin" permission for grain UI and "fullapi" permission for ntfy topic communication.

For now the permissions only show an error screen if you try to share the grain with an anon user. In the future it'll be used to guard admin features in the UI. I may also add read-only API URLs but that will require new permissions.
