import config from "../app/config";
import { shortUrl } from "../app/utils";

const routes = {
  // Sandstorm edit. make the url weird so it's unlikely to collide with anything.
  // Users won't see it in the URL bar because of how Sandstorm works.
  // Keep up-to-date with NTFY_DISALLOWED_TOPICS in launcher.sh.
  // Using one prefix because we want to be able to add more endpoints later
  // without banning topics that users end up using.
  allSubscriptions: "/sandstorm-extra-89dfdbfd72e2ae64728dd/all-subscriptions",
  missingFeatures: "/sandstorm-extra-89dfdbfd72e2ae64728dd/missing-features",
  privacySecurityFull: "/sandstorm-extra-89dfdbfd72e2ae64728dd/privacy-security-full",

  app: config.app_root,
  login: "/login",
  signup: "/signup",
  account: "/account",
  settings: "/settings",
  passwordResetRequest: "/reset-password",
  passwordReset: "/account/password/reset/:token",
  emailVerify: "/account/email/verify/:token",
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
