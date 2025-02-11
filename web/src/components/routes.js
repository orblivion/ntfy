import config from "../app/config";
import { shortUrl } from "../app/utils";

const routes = {
  login: "/login",
  signup: "/signup",
  app: config.app_root,
  allSubscriptions: "/all-subscriptions-89dfdbfd72e2ae64728dd", // Sandstorm edit. make it unlikely to collide with anything. Users won't see it.
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
