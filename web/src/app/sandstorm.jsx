export function requestSandstormIframeURL() {
  var template = "... $API_TOKEN key to reach me at $API_HOST.";
  window.parent.postMessage({renderTemplate: {
    rpcId: "24523452345",
    template: template,
    clipboardButton: 'left'
    // TODO petname, style, etc https://docs.sandstorm.io/en/latest/developing/http-apis/
  }}, "*");
}

var copySandstormIframeURLToElement = function(event) {
  if (event.data.rpcId === "24523452345") {
    if (event.data.error) {
      console.log("ERROR: " + event.data.error);
    } else {
      var el = document.getElementById("offer-iframe-0064f6194bfb82");
      el.setAttribute("src", event.data.uri);
    }
  }
};

window.addEventListener("message", copySandstormIframeURLToElement);
