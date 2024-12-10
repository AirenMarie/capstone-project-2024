/* const { google } = require("googleapis");

const { OAuth2 } = google.auth;
 */
/* const oAuth2Client = new OAuth2(
  "912041195919-b5veekogu6881g0d8nq02acmpc652ta4.apps.googleusercontent.com",
  "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"
); */

const CLIENT_ID =
  "912041195919-b5veekogu6881g0d8nq02acmpc652ta4.apps.googleusercontent.com";

const API_KEY = "AIzaSyAcBh7us9iD3_HDfekKYyNa93YyVorSGoY;";

const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

/* oAuth2Client.setCredentials({
  refresh_token:
    "1//04lg1XvT5oTr7CgYIARAAGAQSNwF-L9IrYX5U28QEJdZZ6MB_0TVkZTT-n1IDEPbTOKyVi8bPPP95CDJmAJlGoQDiURmqYGluEjQ",
}); */

const SCOPES = "https://www.googleapis.com/auth/calendar";

const redirect = document.getElementById("redirect");

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "",
  });
  gisInited = true;
}

function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

redirect.onclick = handleAuthClick();
