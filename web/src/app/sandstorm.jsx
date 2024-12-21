// https://docs.sandstorm.io/en/latest/developing/http-apis/
export function requestSandstormIframeURL() {
  const fullTemplate = "https://$API_HOST/.sandstorm-token/$API_TOKEN"

  window.parent.postMessage({renderTemplate: {
    rpcId: "FULL_TEMPLATE",
    template: fullTemplate,
    clipboardButton: 'left',
    petname: 'ntfy API URL',

    // We could have used forSharing to make incoming requests anonymous, which
    // could be useful since they're coming from Mastodon etc, but we're just
    // going to rely on permissions and ignore User ID. The main downside of forSharing
    // is that the access list shows up in the sharing menu instead of the key menu.
    roleAssignment: {roleId: 0}, // api role
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
};

window.addEventListener("message", copySandstormIframeURLToElement);
