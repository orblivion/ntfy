import {
  Typography,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Stack,
  Container,
  Link,
} from "@mui/material";
import { WavingHand, AppSettingsAlt, MobileFriendly, InstallMobile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import routes from "./routes";
import { requestSandstormIframeURL } from "../app/sandstorm";
import { useEffect } from "react";

export const DocsHeadsup = () => (
  <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
    <Stack spacing={3}>
      <Card sx={{ p: 3 }} aria-label="Welcome to ntfy for Sandstorm">
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Documentation
          </Typography>
          <Alert severity="info" sx={{ paddingTop: 2 }}>
            Note that you are currently using the Sandstorm version of ntfy, which has some changes which may not be reflected in the standard ntfy documentation.
          </Alert>
          <p>
	    <Link href="https://docs.ntfy.sh" target="_blank">See here</Link> for ntfy documentation.
	  </p>
        </CardContent>
      </Card>
    </Stack>
  </Container>
);

export const Welcome = () => (
  <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
    <Stack spacing={3}>
      <Intro/>
      <ConnectingApps/>
      <Scripts/>
      <MissingFeatures/>
    </Stack>
  </Container>
);

export const SettingsRefreshWarning = () => (
  <Alert severity="warning" sx={{ paddingTop: 2 }}>
    {/* TODO <Trans> */}
    <AlertTitle>Changes will be temporary</AlertTitle>
    In the Sandstorm version of ntfy, changes to settings in the web interface may be lost as soon as you refresh the page.
  </Alert>
);

const Intro = () => {
  const { t } = useTranslation(); // TODO
  return (
    <Card sx={{ p: 3 }} aria-label="Welcome to ntfy for Sandstorm">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Welcome to ntfy for Sandstorm
        </Typography>
        <p>
          <b>ntfy</b> is a notification service. It integrates with many open source Android applications, and lets you send notifications from your own custom scripts and applications.
        </p>
        <p>
          Read below to learn about:
        </p>
	<ul>
	  <li>How to use this app</li>
	  <li>How it differs from usual ntfy servers <i>and</i> usual Sandstorm apps</li>
	  <li>Some security and privacy considerations</li>
	</ul>
      </CardContent>
    </Card>
  )
};

const ConnectingApps = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Connecting Apps">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Connecting Apps
        </Typography>
        <p>
          <b>ntfy</b> implements <Link href="https://unifiedpush.org/" target="_blank">UnifiedPush</Link>, which gives you push notifications for your open source Android apps without requiring Google services.
        </p>
        <CardContent> {/* I wanted another indent */}
          <p><InstallMobile/> Install the ntfy Android app (available on <Link href="https://f-droid.org/en/packages/io.heckel.ntfy/" target="_blank">F-Droid</Link> and <Link href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank">Play Store</Link>).</p>
          <p><Link href="#" onClick={() => navigate(routes.settings)}><AppSettingsAlt/> Connect your ntfy Android app to this grain</Link>.</p>
          <p><MobileFriendly/> Set your ntfy-enabled apps to use ntfy for notifications.</p>
        </CardContent>
        <Alert severity="warning" sx={{ paddingTop: 2 }}>
          <AlertTitle>Privacy and Security</AlertTitle>
          Unlike most Sandstorm applications, ntfy-enabled apps will give your API URL to 3rd party services (Mastodon, Matrix, etc) in order to recieve push notifications. Some apps, such as Tusky, will <b>automatically configure themseles</b> to use ntfy. The server will get your API URL, and this grain will get your notifications from that service, which <b>may or may not be your intention</b>.
          <br/>
          <br/>
          If you are concerned that your API URL has been compromised, you can revoke it from the Sandstorm Webkeys menu (next to grain sharing, etc).
        </Alert>
      </CardContent>
    </Card>
  )
}

const Scripts = () => {
  return (
    <Card sx={{ p: 3 }} aria-label="Custom Scripts and Applications">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Custom Scripts and Applications
        </Typography>
	<p>
          You can use ntfy in your own <Link href="https://docs.ntfy.sh/publish/" target="_blank">scripts and applications
	  </Link> by sending a POST request. However, you must use the <Link href="https://docs.ntfy.sh/publish/#publish-as-json" target="_blank">
	  JSON request</Link> option
	  because of <Link href="https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md#headers-vs-json-api" target="_blank">
	  Sandstorm&apos;s restritions</Link>.
	</p>
	<p>
	  See some <Link href="https://docs.ntfy.sh/examples/" target="_blank">examples</Link>.
	</p>
        <Alert severity="warning" sx={{ paddingTop: 2 }}>
          <AlertTitle>Privacy and Security</AlertTitle>
          Treat topics like <b>passwords</b>. Any connected 3rd party services can read any topic from your grain if they know its name, so make it hard to guess!
        </Alert>
      </CardContent>
    </Card>
  )
}

const MissingFeatures = () => {
  return (
    <Card sx={{ p: 3 }} aria-label="Missing Features">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Missing Features
        </Typography>
        If you're familiar with <b>ntfy</b>, there are a handful of features that you might be missing in the Sandstorm version:
        <ul>
          <li>Some Android apps may not work with ntfy</li>
          <li>Connecting to other servers</li>
          <li>Sending email</li>
          <li>Protected Topics</li>
          <li>Desktop Notifications</li>
          <li>Progressive Web App (PWA)</li>
          <li>Web subscriptions (other than for testing purposes)</li>
          <li>Sending messages with headers (JSON only)</li>
        </ul>
        <Link href="https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md#caveats-about-missing-features" target="_blank">
          Learn More
        </Link>
      </CardContent>
    </Card>
  )
}

export const AppSetup = () => {
  const { t } = useTranslation(); // TODO
  useEffect(() => {
    requestSandstormIframeURL()
  })
  return (
    <Card sx={{ p: 3 }} aria-label="App Setup">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          App Setup
        </Typography>
	<p>
          Here you will set up your <b>API URL</b>. This is what you will use to connect to your ntfy app on your phone, as well as your custom scripts and applications.
	</p>
	<p>
          <AppSettingsAlt/>
          <b>On Android and iOS:</b> <span style={{ display: "inline-block" }}><i>Settings&rarr;General&rarr;Default Server</i></span>
	</p>
	<p>
          <iframe scrolling="no" style={{ "background-color": "#ffffff", height: "15px", width: "100%", "margin-left": 0, "margin-top": "15px", "margin-bottom": "15px", border: 0, overflow: "hidden" }} id="offer-iframe-full"></iframe>
	</p>
        <Alert severity="info" sx={{ paddingTop: 2 }}>
          <AlertTitle>In Case of Compromise</AlertTitle>
	  {/* TODO explain that you might end up with multiple API keys. And that this is probably not great for this app? You probably just want the "default server". Actually, maybe do this in the SecurityAndPrivacy thing. And maybe just make reference to that here to "make sure you see" it. */}
          If you are concerned that your API URL has been compromised, you can revoke it from the Sandstorm Webkeys menu (next to grain sharing, etc) and get a new one here.
        </Alert>
      </CardContent>
    </Card>
  )
}
