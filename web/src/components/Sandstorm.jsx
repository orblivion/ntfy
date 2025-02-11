import {
  Typography,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Stack,
  Button,
  Container,
  ListItemText,
} from "@mui/material";
import { WavingHand } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { InstallMobile } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import routes from "./routes";
import { requestSandstormIframeURL } from "../app/sandstorm";
import { useEffect } from "react";

export const SandstormHome = () => (
  <Container maxWidth="md" sx={{ marginTop: 3, marginBottom: 3 }}>
    <Stack spacing={3}>
      <Intro/>
      <AppSetup/> {/* Or else link to settings from here. Maybe worth it for the space savings? */}
      <MissingFeatures/>
      <SecurityAndPrivacy/>
    </Stack>
  </Container>
);

const Intro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // TODO
  return (
    <Card sx={{ p: 3 }} aria-label="Welcome to ntfy for Sandstorm">
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Welcome to ntfy for Sandstorm
      </Typography>
      This is for <a href="https://unifiedpush.org/">UnifiedPush</a>. {/*TODO explain more*/}
      See below for specal security and privacy issues.
      If you're familiar with ntfy, see below for some differences you should know about.
    </Card>
  )
};

const SecurityAndPrivacy = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Security And Privacy">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Security And Privacy
        </Typography>
        Unlike most Sandstorm applications, ntfy takes connections from any services you connect to.
        <br/><br/>
        <Alert severity="warning" sx={{ paddingTop: 2 }}>
          <AlertTitle>Privacy Warning</AlertTitle>
          Some apps, such as Tusky, will <b>automatically configure itself</b>. Beware! But you can always revoke.
        </Alert>
      </CardContent>
    </Card>
  )
}

const MissingFeatures = () => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }} aria-label="Missing Features">
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Missing Features
        </Typography>
        If you're familiar with ntfy, there are a handful of features that you might be missing.
        <ul>{/*<List> ?*/}
          <li>Protected Topics (Authentication)</li>
          <li>Desktop Notifications</li>
          <li>Progressive Web App (PWA)</li>
          <li>Web subscriptions (other than for testing purposes)</li>
          <li>Sending messages with headers</li>
        </ul>
        <a href="https://github.com/orblivion/ntfy/blob/sandstorm/.sandstorm/README_MISSING_FEATURES.md">
          Learn More
        </a>
      </CardContent>
    </Card>
  )
}

// TODO - Something about UnifiedPush here? How to configure apps, etc?
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
        <InstallMobile/>
        <b>On Android and iOS:</b> <span style={{ display: "inline-block" }}><i>Settings&rarr;General&rarr;Default Server</i></span>
        <br />
        <iframe scrolling="no" style={{ "background-color": "#ffffff", height: "15px", width: "100%", "margin-left": 0, "margin-top": "15px", "margin-bottom": "15px", border: 0, overflow: "hidden" }} id="offer-iframe-full"></iframe>
        <br />
        This URL will also work for custom scripts. <a href="https://docs.ntfy.sh/publish/">See here, though note that only the JSON API works.</a>.
        <br />
        <br />
        <Alert severity="info" sx={{ paddingTop: 2 }}>
          <AlertTitle>Revoking</AlertTitle>
          You can always revoke API URLs from the Sandstorm Webkeys menu (next to grain sharing, etc) and get a new one here.
        </Alert>
      </CardContent>
    </Card>
  )
}
