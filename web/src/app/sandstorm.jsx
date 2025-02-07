export function requestSandstormIframeURL() {
  const fullTemplate = "https://$API_HOST/.sandstorm-token/$API_TOKEN"
  const hostTemplate = "$API_HOST"
  const tokenTemplate = "$API_TOKEN"
  window.parent.postMessage({renderTemplate: {
    rpcId: "FULL_TEMPLATE",
    template: fullTemplate,
    clipboardButton: 'left',
    petname: 'ntfy API URL',
    // TODO petname, style, etc https://docs.sandstorm.io/en/latest/developing/http-apis/
  }}, "*");
  window.parent.postMessage({renderTemplate: {
    rpcId: "HOST_TEMPLATE",
    template: hostTemplate,
  }}, "*");
  window.parent.postMessage({renderTemplate: {
    rpcId: "TOKEN_TEMPLATE",
    template: tokenTemplate,
  }}, "*");
}

var copySandstormIframeURLToElement = function(event) {
  if (event.data.rpcId === "FULL_TEMPLATE") {
    if (event.data.error) {
      console.log("ERROR: " + event.data.error);
    } else {
      var el = document.getElementById("offer-iframe-full");
      el.setAttribute("src", event.data.uri);
    }
  }
  if (event.data.rpcId === "HOST_TEMPLATE") {
    if (event.data.error) {
      console.log("ERROR: " + event.data.error);
    } else {
      var el = document.getElementById("offer-iframe-host");
      el.setAttribute("src", event.data.uri);
    }
  }
  if (event.data.rpcId === "TOKEN_TEMPLATE") {
    if (event.data.error) {
      console.log("ERROR: " + event.data.error);
    } else {
      var el = document.getElementById("offer-iframe-token");
      el.setAttribute("src", event.data.uri);
    }
  }
};

window.addEventListener("message", copySandstormIframeURLToElement);
