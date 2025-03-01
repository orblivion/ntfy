import config from "../app/config";
import { shortUrl } from "../app/utils";

const routes = {
  // Sandstorm edit. make the url weird so it's unlikely to collide with anything.
  // Users won't see it because of how Sandstorm works.
  // Keep up-to-date in NTFY_DISALLOWED_TOPICS in launcher.sh.
  allSubscriptions: "/all-subscriptions-89dfdbfd72e2ae64728dd",
  docsHeadsup: "/docs-89dfdbfd72e2ae64728dd",

  login: "/login",
  signup: "/signup",
  app: config.app_root,
  account: "/account",
  settings: "/settings",
  subscription: "/:topic",
  subscriptionExternal: "/:baseUrl/:topic",
  forSubscription: (subscription) => {
    if (subscription.baseUrl !== config.base_url) {
      return `/${shortUrl(subscription.baseUrl)}/${subscription.topic}`;
    }
    return `/${subscription.topic}`;
  },
};

export default routes;
