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
import {
    AccessTime,
    Api,
    IntegrationInstructions,
    WavingHand,
    AppSettingsAlt,
    MobileFriendly,
    InstallMobile,
    RestartAlt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import routes from "./routes";
import { requestSandstormIframeURL } from "../app/sandstorm";
import { useEffect, useState } from "react";

const readme = "https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md";

export const DocsHeadsup = ({open, setOpen}) => (
  <Modal
      open={open}
      onBackdropClick={() => setOpen(false)}
      aria-label="Documentation"
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
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button href="https://docs.ntfy.sh" target="_blank" rel="noreferrer">See ntfy documentation</Button>
    </Box>
  </Modal>
);

export const Welcome = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
      <Stack spacing={3}>
        <Intro/>
        <LimitedSupportWarning/>
        <SupportedApps/>
        <PrivacyAndSecurity/>
        <ConnectingYourPhone/>
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
    <Card sx={{ p: 3 }} aria-label="Welcome to sntfy (ntfy for Sandstorm)">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Welcome to sntfy (ntfy for Sandstorm)
        </Typography>
        <p>
          <b>sntfy</b> is a <i>limited version</i> of a notification service called <b>ntfy</b>, for Sandstorm. <b>ntfy</b> integrates with many open source Android applications and other services (iOS support is limited). You can easily send notifications from your own custom scripts and applications too!
        </p>
        <p>
          Please read on to learn about how to use sntfy, how it differs from standard ntfy, and some security and privacy considerations.
        </p>
      </CardContent>
    </Card>
  )
};

const LimitedSupportWarning = () => {
  return (
    <Card sx={{ p: 3 }} aria-label="Limited Support">
        <Alert severity="warning">
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Limited Support
            </Typography>
          <p>
            It is recommended to use <b>sntfy</b> only for convenience, not for anything "mission critical".
          </p>
          <p>
            As of now, <b>ntfy</b>&#39;s primary features seem to work reliably, including Unified Push and many other integrations. However due to Sandstorm&#39;s security model, some features are <i>not supported</i> or only <i>work partially</i>. In particular, this includes any feature that requires special http headers or authentication (notably, per-message disabling of cache may be ignored). Some features may conceivably stop working, due to a change in ntfy or even an integration. There may also be occasional edge cases of missed messages due to how Sandstorm works.
          </p>
          <p>
            <b>ntfy</b> changes over time and it is impractical to keep a comprehensive list of what features currently work. <Link href={readme} target="_blank" rel="noreferrer">See here</Link> to learn more about all of this, and feel free to reach out to ask questions, report issues, or make requests.
          </p>
        </Alert>
    </Card>
  )
};

const SupportedApps = () => {
  const navigate = useNavigate();
  const [scriptsOpen, setScriptsOpen] = useState(false);
  return (<>
    <Scripts open={scriptsOpen} setOpen={setScriptsOpen}/>
    <Card sx={{ p: 3 }} aria-label="Supported Apps and Integrations">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Supported Apps and Integrations
        </Typography>
        <p>
          <b>ntfy</b> implements <Link href="https://unifiedpush.org/" target="_blank" rel="noreferrer">UnifiedPush</Link>, which gives you push notifications for many of your open source Android apps (Tusky for Mastodon, Element for Matrix, etc) without requiring Google services. Additionally, there are a number of non-UnifiedPush integrations that work with ntfy.
        </p>
        <ul>
          <li><Link href="https://unifiedpush.org/users/apps/" target="_blank" rel="noreferrer"><b>UnifiedPush-enabled applications</b></Link></li>
          <li><Link href="https://docs.ntfy.sh/integrations/" target="_blank" rel="noreferrer"><b>Other supported integrations</b></Link></li>
          <li><Link onClick={() => setScriptsOpen(true)} href="#" ><b>Make your own scripts and integrations</b></Link></li>
        </ul>
      </CardContent>
    </Card>
  </>)
};

const PrivacyAndSecurityBasic = () => (
  <>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      This grain is for you only
    </Typography>
    <p>
      Unlike standard ntfy, sntfy is not meant to be a public instance. Future versions may display private information in the web interface. Use this grain only for your own devices and the services you use. If you want to host a friend on your server, invite them to create their own grain.
    </p>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      Topic names are secret
    </Typography>
    <p>
      For each integration, you will choose a "topic" to send and receive notifications (UnifiedPush-enabled apps will do this automatically). <b>Treat your topics like passwords</b> so that misbehaving integrations can't read each other's notifications.
    </p>
  </>
);

const PrivacyAndSecurityMore = () => (
  <>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      API URLs are semi-secret
    </Typography>
    <p>
      Limited 3rd parties will have access to your grain via the API URL you give it. You can give each integration a different API URL (other than UnifiedPush, see below). If you notice one of them misbehaving (writing unwanted data to your grain, etc), <b>you can revoke its API URL</b> using the Sandstorm Webkeys menu (next to grain sharing, etc). Note: for security reasons, do not use the Webkeys menu to <i>generate</i> API URLs.
    </p>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      Your phone
    </Typography>
    <p>
      Unfortunately, UnifiedPush integrations need to share the same API URL that you use on your phone (which complicates revoking). Beware that certain apps such as Tusky configure themselves and pass on your API URL <b>without asking you</b>.
    </p>
    <p>
      Also note that by default (before you set up your API URL), your ntfy Android app connects to a <b>public</b> ntfy server.
    </p>
    <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
      This app and this grain
    </Typography>
    <p>
      Since this app has 3rd parties accessing it, try to keep this app up to date. I'll do my best to keep up with any ntfy security updates. On the off-chance you're worried that the whole grain has somehow been compromised, you can always delete your grain and start over (and create new topics).
    </p>
    <p>
      This app is designed to cache notifications for 12 hours.
    </p>
  </>
);

// Includes the "basic" and a link to the "more"
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
        <Link onClick={() => navigate(routes.privacySecurityFull)} style={{cursor: "pointer"}}>Additional Privacy Concerns</Link>
      </Button>
      </CardContent>
    </Card>
  )
};

// Includes both the "basic" and the "more"
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
          <p><InstallMobile/> Install the ntfy Android app (available on <Link href="https://f-droid.org/en/packages/io.heckel.ntfy/" target="_blank" rel="noreferrer">F-Droid</Link> and <Link href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank" rel="noreferrer">Play Store</Link>) or <Link href="https://apps.apple.com/us/app/ntfy/id1625396347" target="_blank" rel="noreferrer">iOS App</Link></p>
          <p><Link href="#" onClick={() => navigate(routes.settings)}><AppSettingsAlt/> Connect your ntfy Android app to this grain.</Link></p>
          <p><MobileFriendly/> Set your UnifiedPush-enabled apps to use ntfy for notifications.</p>
          <ul>
            <li>Android only</li>
            <li>Set up happens in each app, sometimes silently.</li>
          </ul>
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
        aria-label="Custom Scripts and Applications"
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
          Using ntfy in your own scripts and applications is as easy as <Link href="https://docs.ntfy.sh/publish/" target="_blank" rel="noreferrer">sending a
          POST request</Link>. However, you must use the <Link href="https://docs.ntfy.sh/publish/#publish-as-json" target="_blank" rel="noreferrer">
          JSON request</Link> option
          because of <Link href="https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README.md#headers-vs-json-api" target="_blank" rel="noreferrer">
          Sandstorm&apos;s restritions</Link>.
        </p>
        <p>
          You can also <Link href="https://docs.ntfy.sh/subscribe/api/" target="_blank" rel="noreferrer">subscribe to topics</Link> via the API.
        </p>
        <p>
          See some examples of <Link href="https://docs.ntfy.sh/examples/" target="_blank" rel="noreferrer">scripts that use ntfy</Link>.
        </p>
      </Box>
    </Modal>
  )
}

// Remember to keep this vague. The Android UI might change.
const AppSetupAlreadyConfigured = ({open, setOpen}) => {
  return (
    <Modal
        open={open}
        onBackdropClick={() => setOpen(false)}
        aria-label="Tips for switching to a new API URL or grain"
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
          Tips for switching to a new API URL or grain
        </Typography>
        If your Android ntfy app is already connected to another API URL (or other ntfy server) and you're switching here, here are some tips and warnings:
        <ul>
          <li>You can back up your current settings before proceeding.</li>
          <li>You will likely <b>lose your old notifications</b> from topics you delete.</li>
          <li>For UnifiedPush topics, you may need to manually delete the old topics before apps will re-establish them with the new API URL.</li>
          <li>For non-UnifiedPush topics, you will probably need to manually delete the old topics and subscribe to the respective ones on the new API URL.</li>
          <li>When you are done reconfiguring, make sure you do not have any remaining topics that are unable to connect (i.e. they may be trying to connect to a deleted API URL or grain).</li>
        </ul>
      </Box>
    </Modal>
  )
}

export const AppSetup = () => {
  const navigate = useNavigate();
  const [alreadyConfiguredOpen, setAlreadyConfiguredOpen] = useState(false);
  useEffect(() => {
    document.querySelector("#main").scrollTo(0,0);
    requestSandstormIframeURL();
  })
  return (<>
    <AppSetupAlreadyConfigured open={alreadyConfiguredOpen} setOpen={setAlreadyConfiguredOpen}/>
    <Card sx={{ p: 3 }} aria-label="App Setup">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          App Setup
        </Typography>
        <p>
          <Api/>&nbsp;
          Use this <b>API URL</b> to connect this grain to:
        </p>
        <ul>
          <li>Your phone (and thus UnifiedPush services)</li>
          <li>Non-UnifiedPush services</li>
          <li>Custom scripts</li>
        </ul>
        <p>
          <RestartAlt/>&nbsp;
          Are you switching to this API URL from an <b>already configured</b> ntfy App? <Link onClick={() => setAlreadyConfiguredOpen(true)} href="#" >See some tips</Link> here.
        </p>
        <p>
          <AppSettingsAlt/>&nbsp;
          <b>On Android and iOS:</b> <span style={{ display: "inline-block" }}><i>Settings&rarr;General&rarr;Default Server</i></span>
        </p>
        <p>
          <i>(Reload the page to get a new url)</i>
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
          <AccessTime/>&nbsp;
          Use this API URL within <b>5 minutes</b> or it will expire.
          <ul>
            <li>For your phone: subscribe to a topic (including UnifiedPush)</li>
            <li>For services: you may need to send a test notification</li>
          </ul>
        </p>
        <Alert severity="info" sx={{ paddingTop: 2 }}>
          <AlertTitle>More Info</AlertTitle>
          <p>
              If you upgrade this Sandstorm app, Android notifications may become blocked. To fix this, wait about a minute for "Reconnecting..." to go away in your list of Android topics. Then try pull-to-refresh. Finally, try restarting your Android app.
          </p>
          <p>
              It is not recommended to:
          </p>
          <ul>
            <li>
              Use two or more API URLs from this grain with the same phone at the same time
            </li>
            <li>
              Connect two or more phones with the same UnifiedPush integrations to this grain
            </li>
          </ul>
          <p>
            See the Security and Privacy section of the <Link onClick={() => navigate(routes.app)} style={{cursor: "pointer"}}>Welcome Screen</Link>.
          </p>
        </Alert>
      </CardContent>
    </Card>
  </>)
}
