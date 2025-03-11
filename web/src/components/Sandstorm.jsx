import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { WavingHand, AppSettingsAlt, MobileFriendly, InstallMobile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import routes from "./routes";
import { requestSandstormIframeURL } from "../app/sandstorm";
import { useEffect } from "react";

const readmeMissingFeatures = "https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md#caveats-about-missing-features";
const readme = "https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md";

export const DocsHeadsup = ({open, setOpen}) => (
  <Modal
      open={open}
      onBackdropClick={() => setOpen(false)}
  >
    <Box
      loading="lazy"
      sx={{
        maxWidth: 1,
        maxHeight: 1,
        position: "absolute",
        bgcolor: "background.paper",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 4,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Documentation
      </Typography>
      <p>
        Note that you are currently using the <b>Sandstorm version of ntfy</b>, which has some changes which may not be reflected in the standard ntfy documentation.
      </p>
      <Button href="https://docs.ntfy.sh" target="_blank">See ntfy documentation</Button>
    </Box>
  </Modal>
);

export const Welcome = () => (
  <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
    <Stack spacing={3}>
      <Intro/>
      <SupportedApps/>
      <ConnectingYourPhone/>
      <Scripts/>
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
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Welcome to ntfy for Sandstorm">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Welcome to ntfy for Sandstorm
        </Typography>
        <p>
          <b>ntfy</b> is a notification service. It integrates with many services and open source Android applications. You can easily send notifications from your own custom scripts and applications too!
        </p>
        <p>
          Please read on to learn about how to use ntfy for Sandstorm, as well as some security and privacy considerations and differences from standard ntfy.
        </p>
      </CardContent>
    </Card>
  )
};

const SupportedApps = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Supported Apps and Integrations">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Supported Apps and Integrations
        </Typography>
        <p>
          <b>ntfy</b> implements <Link href="https://unifiedpush.org/" target="_blank">UnifiedPush</Link>, which gives you push notifications for many of your open source Android apps without requiring Google services. Additionally, there are a number of other integrations that work with ntfy.
        </p>
        <p>
          <ul> {/* TODO emoji? */}
            <li><Link href="https://unifiedpush.org/users/apps/" target="_blank"><b>UnifiedPush-enabled applications</b></Link></li>
            <li><Link href="https://docs.ntfy.sh/integrations/" target="_blank"><b>Other integrations</b></Link></li>
          </ul>
        </p>
        <Alert severity="warning">
          <AlertTitle>Incomplete Support</AlertTitle>
          <p>
            Due to some techincal hurdles, a handful of <b>features are missing</b> in the Sandstorm version of ntfy. Some applications or integrations <b>may not work as expected</b>.
          </p>
          <p>
            Notably, <b>"Do Not Cache"</b> directives may not work reliably. In general, relying on ntfy for Sandstorm for <b>"mission critical"</b> needs is not recommended.
          </p>
          <Button>
            <Link onClick={() => navigate(routes.missingFeatures)} style={{cursor: "pointer"}}>Learn More</Link>
          </Button>
        </Alert>
      </CardContent>
    </Card>
  )
};

const ConnectingYourPhone = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Connecting Your Phone">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Connecting Your Phone
        </Typography>
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

export const MissingFeatures = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }} aria-label="Missing Features">
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Missing Features
            </Typography>
            <p>
              If you're familiar with <b>ntfy</b>, there are a handful of features that have been left out of this version of ntfy for Sandstorm due to <Link href={readmeMissingFeatures} target="_blank">technical hurdles</Link>.
            </p>
            <p>
              I'd <Link href={readme} target="_blank">love to hear from you</Link> if:
            </p>
            <ul>
              <li>You find yourself missing one of these features <i>(I have some ideas to make it work)</i></li>
              <li>You would like to report on which integrations are working for you <i>(I may compile a list)</i></li>
              <li>You would like to help with translations</li>
            </ul>
            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
              Web App
            </Typography>
            <ul>
              <li>Desktop Notifications</li>
              <li>Progressive Web App (PWA)</li>
              <li>Translations for Sandstorm-specific text</li>
              <li>Persistent Subscriptions and other Settings (changes will be lost on page refresh)</li>
              <li>Sending Notifications to Other Servers</li>
            </ul>
            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
              Other Features
            </Typography>
            <ul>
              <li>Certain Integrations (ntfy-enabled apps or services that depend on HTTP headers)
              <ul>
                <li>Some may not work at all</li>
                <li>Some may be degraded (missing tags or title, etc)</li>
              </ul>
              </li>
              <li>Protected Topics</li>
              <li>Message Attachments</li>
              <li>Upstream Servers</li>
              <li>Sending Email</li>
              <li>Matrix Gateway (for self-hosted Matrix home servers)</li>
              <li>Web Push</li>
              <li>Per-Visitor rate limiting (Sandstorm still provides a per-<i>user</i> limit)</li>
            </ul>
            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
              API
            </Typography>
            <ul>
              <li>API calls that use HTTP headers (JSON only)</li>
              <li>ntfy Command-Line Tool</li>
            </ul>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
};

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
          <iframe id="offer-iframe-full" scrolling="no" style={{
            "background-color": "#ffffff",
            height: "15px",
            width: "100%",
            "margin-left": 0,
            "margin-top": "15px",
            "margin-bottom": "15px",
            border: 0,
            overflow: "hidden"
          }}>
          </iframe>
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
