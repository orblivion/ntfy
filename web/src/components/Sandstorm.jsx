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
import { IntegrationInstructions, WavingHand, AppSettingsAlt, MobileFriendly, InstallMobile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import routes from "./routes";
import { requestSandstormIframeURL } from "../app/sandstorm";
import { useEffect, useState } from "react";

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
    /* TODO aria-label="Documentation"?*/
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

{/* TODO Pictures for the sections to make it friendly? */}
export const Welcome = () => {
  const [scriptsOpen, setScriptsOpen] = useState(false);
  return (
    <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
      <Stack spacing={3}>
        <Intro/>
        <SupportedApps setScriptsOpen={setScriptsOpen}/>
        <PrivacyAndSecurity/>
        <ConnectingYourPhone/>
        <Scripts open={scriptsOpen} setOpen={setScriptsOpen}/>
      </Stack>
    </Container>
  )
}

export const SettingsRefreshWarning = () => (
  <Alert severity="warning" sx={{ paddingTop: 2 }}>
    <AlertTitle>Changes will be temporary</AlertTitle>
    In the Sandstorm version of ntfy, changes to settings in the web interface may be lost as soon as you refresh the page.
  </Alert>
);

const Intro = () => {
  return (
    <Card sx={{ p: 3 }} aria-label="Welcome to ntfy for Sandstorm">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Welcome to ntfy for Sandstorm
        </Typography>
        <p>
          <b>ntfy</b> is a notification service. It integrates with many open source Android applications and other services (iOS support is limited). You can easily send notifications from your own custom scripts and applications too!
        </p>
        <p>
          Please read on to learn about how to use ntfy for Sandstorm, as well as some security and privacy considerations and differences from standard ntfy.
        </p>
      </CardContent>
    </Card>
  )
};

const SupportedApps = ({setScriptsOpen}) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Supported Apps and Integrations">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Supported Apps and Integrations
        </Typography>
        <p>
          <b>ntfy</b> implements <Link href="https://unifiedpush.org/" target="_blank">UnifiedPush</Link>, which gives you push notifications for many of your open source Android apps (Tusky for Mastodon, Element for Matrix, etc) without requiring Google services. Additionally, there are a number of other integrations that work with ntfy.
        </p>
        <ul> {/* TODO emoji? */}
          <li><Link href="https://unifiedpush.org/users/apps/" target="_blank"><b>UnifiedPush-enabled applications</b></Link></li>
          <li><Link href="https://docs.ntfy.sh/integrations/" target="_blank"><b>Other supported integrations</b></Link></li>
          <li><Link onClick={() => setScriptsOpen(true)} href="#" ><b>Make your own scripts and integrations</b></Link></li>
        </ul>
        <Alert severity="warning">
          <AlertTitle>Incomplete Support</AlertTitle>
          <p>
            Due to some techincal hurdles, a handful of <b>features are missing</b> in the Sandstorm version of ntfy. Some applications or integrations <b>may not work as expected</b>.
          </p>
          <p>
            Notably, <b>"Do Not Cache"</b> directives may not work reliably.
          </p>
          <p>
            Relying on ntfy for Sandstorm for <b>"mission critical"</b> needs is not recommended.
          </p>
          <Button>
            <Link onClick={() => navigate(routes.missingFeatures)} style={{cursor: "pointer"}}>Learn More</Link>
          </Button>
        </Alert>
      </CardContent>
    </Card>
  )
};

const PrivacyAndSecurityBasic = () => (
  <>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      This grain is for you only
    </Typography>
    <p>
      This is not a public ntfy instance. Future versions may display private information. If you want to host a friend on your server, invite them to create their own grain.
    </p>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      Topic names are secret
    </Typography>
    <p>
      For each integration, you will choose a "topic" to send and receive notifications (UnifiedPush-enabled apps will do this automatically). <b>Treat your topics like passwords</b> so that misbehaving services can't read each other's notifications.
    </p>
  </>
);

const PrivacyAndSecurityMore = () => (
  <>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      API URLs are semi-secret
    </Typography>
    <p>
      Limited 3rd parties will have access to your grain via the API URL you give it. If you notice a service misbehaving (writing unwanted data to your grain, etc), <b>you can revoke its API URL</b> using the Sandstorm Webkeys menu (next to grain sharing, etc). Note: for security reasons, do not use this menu to generate API URLs.
    </p>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      Your phone
    </Typography>
    <p>
      Unfortunately, UnifiedPush integrations need to share the same API URL that you use on your phone (which complicates revoking). Beware that certain apps such as Tusky configure themselves and pass on your API URL <b>without asking you</b>. Also note that by default (before you set up your API URL), your ntfy app connects to a <b>public</b> ntfy server.
    </p>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      Upgrading this app
    </Typography>
    <p>
      Since this has 3rd parties accessing it, try to upgrade this app up to date. I'll do my best to keep this app up to date with ntfy security updates. If in doubt, you can just delete your grain and start over (and create new topics), since it's not meant to hold data long term, though this may complicate configuration.
    </p>
  </>
);

const PrivacyAndSecurity = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Privacy and Security">
      <CardContent>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Privacy and Security
      </Typography>
      <PrivacyAndSecurityBasic/>
      <Button>
        <Link onClick={() => navigate(routes.privacySecurityFull)} style={{cursor: "pointer"}}>Additional Concerns</Link>
      </Button>
      </CardContent>
    </Card>
  )
};

export const PrivacyAndSecurityFull = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }} aria-label="Privacy and Security">
          <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Privacy and Security
          </Typography>
          <PrivacyAndSecurityBasic/>
          <PrivacyAndSecurityMore/>
          <Button>
            <Link onClick={() => navigate(routes.app)} style={{cursor: "pointer"}}>Go Back</Link>
          </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
};

const ConnectingYourPhone = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Connecting Your Phone And Other Integrations">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Connecting Your Phone And Other Integrations
        </Typography>
        <CardContent> {/* I wanted another indent */}
          <p><InstallMobile/> Install the ntfy Android app (available on <Link href="https://f-droid.org/en/packages/io.heckel.ntfy/" target="_blank">F-Droid</Link> and <Link href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank">Play Store</Link>) or <Link href="https://apps.apple.com/us/app/ntfy/id1625396347" target="_blank">iOS App</Link></p>
          <p><Link href="#" onClick={() => navigate(routes.settings)}><AppSettingsAlt/> Connect your ntfy Android app to this grain.</Link></p>
          <p><MobileFriendly/> Set your UnifiedPush-enabled apps to use ntfy for notifications. (Android only)</p>
          <p><IntegrationInstructions/> Set up your other integrations (with specific instructions) or custom scripts and <Link href="#" onClick={() => navigate(routes.settings)}>connect them to this grain.</Link></p>
        </CardContent>
      </CardContent>
    </Card>
  )
}

const Scripts = ({open, setOpen}) => {
  return (
    <Modal
        open={open}
        onBackdropClick={() => setOpen(false)}
        /* TODO aria-label="Custom Scripts and Applications"?*/
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
          Custom Scripts and Applications
        </Typography>
        <p>
          Using ntfy in your own scripts and applications is as easy as <Link href="https://docs.ntfy.sh/publish/" target="_blank">sending a
          POST request</Link>. However, you must use the <Link href="https://docs.ntfy.sh/publish/#publish-as-json" target="_blank">
          JSON request</Link> option
          because of <Link href="https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md#headers-vs-json-api" target="_blank">
          Sandstorm&apos;s restritions</Link>.
        </p>
        <p>
          See some examples of <Link href="https://docs.ntfy.sh/examples/" target="_blank">scripts that use ntfy</Link>.
        </p>
      </Box>
    </Modal>
  )
}

export const MissingFeatures = () => {
  const navigate = useNavigate();
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
              <li>Certain Integrations (UnifiedPush enabled apps, or other services, that depend on HTTP headers)
              <ul>
                <li>Some may not work at all</li>
                <li>Some may be degraded (missing tags or title, delay or <b>"do not cache" may not be respected</b>)</li>
              </ul>
              </li>
              <li>Push notifications on iOS (manual refresh works)</li>
              <li>Protected Topics</li>
              <li>Message Attachments</li>
              <li>Upstream Servers</li>
              <li>Sending Email</li>
              <li><Link href="https://unifiedpush.org/users/apps/" target="_blank">Matrix Gateway</Link> (for self-hosted Matrix home servers)</li>
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
            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
              Reliability
            </Typography>
            <ul>
              <li>Upgrading the Sandstorm app seems to interrupt notifications with the ntfy Android app. Restart the Android app to fix this. (This may be an issue with the Android app rather than the server)</li>
            </ul>
            <Button>
              <Link onClick={() => navigate(routes.app)} style={{cursor: "pointer"}}>Go Back</Link>
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
};

export const AppSetup = () => {
  const navigate = useNavigate();
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
          Use this <b>API URL</b> to connect this grain to:
        </p>
        <ul>
          <li>Your phone (which will auto-configure UnifiedPush services)</li>
          <li>Other services</li>
          <li>Custom scripts</li>
        </ul>
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
        <p>
          You will need to use this API URL within <b>5 minutes</b> or it will expire. For services, you may need to send a test notification. For your phone, connecting it should be enough.
        </p>
        <p>
          Refresh the page to get a new API URL.
        </p>
        <Alert severity="info" sx={{ paddingTop: 2 }}>
          <AlertTitle>More Info</AlertTitle>
          <p>
            When upgrading this Sandstorm app, you may need to restart your ntfy phone application to avoid missing notifications.
          </p>
          <p>
            Also make sure to see the Security and Privacy section of the <Link onClick={() => navigate(routes.app)} style={{cursor: "pointer"}}>Welcome Screen</Link>.
          </p>
        </Alert>
      </CardContent>
    </Card>
  )
}
