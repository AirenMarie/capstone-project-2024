import { CLIENT_ID } from "./config.js";

import { API_KEY } from "./config.js";

const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

const SCOPES = "https://www.googleapis.com/auth/calendar";

const content = document.getElementById("content");

const sidebarHeading = document.getElementById("sidebar-heading");
const signInBtn = document.getElementById("authorize_button");
const signOutBtn = document.getElementById("signout_button");
const upcomingSearch = document.getElementById("upcoming-search");
const upcommingSearchBtn = document.getElementById("upcoming-search-btn");

let tokenClient;
let gapiInited = false;
let gisInited = false;

const apiConfig = document.getElementById("api-config");
const clientConfig = document.getElementById("client-config");

function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "",
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    signInBtn.style.visibility = "visible";
  }
}

function handleAuthClick() {
  console.log("Sign In button clicked");
  try {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        console.error("Auth Error: ", resp.error);
        throw resp;
      }
      sidebarHeading.style.visibility = "collapse";
      signOutBtn.style.visibility = "visible";
      signInBtn.innerText = "Refresh";
      upcommingSearch.style.visibility = "visible";
      await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  } catch (error) {
    console.error("Error during handleAuthClick: ", error);
  }
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    content.innerText = "";
    sidebarHeading.style.visibility = "visible";
    signInBtn.innerText = "Sign In to Google Calendar";
    signOutBtn.style.visibility = "hidden";
    upcomingSearch.style.visibility = "hidden";
  }
}

async function listUpcomingEvents(query = "") {
  let response;
  try {
    const request = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
      q: query,
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    content.innerText = err.message;
    return;
  }

  const events = response.result.items;
  if (!events || events.length == 0) {
    content.innerText = "No events found.";
    return;
  }

  const output = events.reduce(
    (str, event) =>
      `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
    "Events:\n"
  );
  content.innerText = output;
}

function addEvents(events) {
  content.innerHTML = "";

  events.forEach((event) => {
    const eventInfo = document.createElement("p");
    eventInfo.textContent = `${event.summary} (${
      event.start.dateTime || event.start.date
    })`;
    content.appendChild(eventInfo);
  });
}

addEvents();

signInBtn.addEventListener("click", (event) => {
  event.preventDefault();
  handleAuthClick();
});

signOutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  handleSignoutClick();
});

upcommingSearchBtn.addEventListener("click", () => {
  const upcomingQuery = document.getElementById("upcoming-query");
  const query = upcomingQuery.value;
  listUpcomingEvents(query);
});

apiConfig.onload = gapiLoaded;
clientConfig.onload = gisLoaded;
