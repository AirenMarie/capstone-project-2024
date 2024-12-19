/* eslint-disable no-undef */
const content = document.getElementById("content");

const signInBtn = document.getElementById("authorize_button");
const signOutBtn = document.getElementById("signout_button");
const sidebarHeading = document.getElementById("sidebar-heading");
const upcomingSearch = document.getElementById("upcoming-search");
const upcommingSearchBtn = document.getElementById("upcoming-search-btn");

const apiConfig = document.getElementById("api-config");
const clientConfig = document.getElementById("client-config");

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

function initializeGapiClient() {
  gapi.client
    .init({
      apiKey: "AIzaSyAcBh7us9iD3_HDfekKYyNa93YyVorSGoY",
      clientId:
        "912041195919-b5veekogu6881g0d8nq02acmpc652ta4.apps.googleusercontent.com",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar",
    })
    .then(
      function () {
        gisLoaded();
      },
      function (error) {
        console.error("Error initializing Google API client:", error);
      }
    );
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id:
      "912041195919-b5veekogu6881g0d8nq02acmpc652ta4.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
    callback: "",
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

function getCalendarList() {
  gapi.client.calendar.calendarList
    .list()
    .then(function (response) {
      const calendars = response.result.items;
      calendars.forEach((calendar) => {
        console.log("Calendar ID:", calendar.id);
        console.log("Calendar Summary:", calendar.summary);
      });

      const primaryCalendarId = calendars.find(
        (c) => c.summary === "Primary"
      ).id;
      console.log("Primary Calendar ID:", primaryCalendarId);
    })
    .catch(function (error) {
      console.error("Error fetching calendar list:", error);
    });
}

gapi.load("client:auth2", () => {
  gapi.client
    .init({
      apiKey: "AIzaSyAcBh7us9iD3_HDfekKYyNa93YyVorSGoY",
      clientId:
        "912041195919-b5veekogu6881g0d8nq02acmpc652ta4.apps.googleusercontent.com",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar",
    })
    .then(
      () => {
        handleAuthClick();
      },
      (error) => {
        console.error("Error initializing gapi.client:", error);
      }
    );
});

function handleAuthClick() {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then(function (response) {
      const events = response.result.items;
      addEvents(events);
    })
    .catch(function (error) {
      console.error("Error fetching events:", error);
    });
  sidebarHeading.style.visibility = "collapse";
  signInBtn.innerText = "Refresh";
  signOutBtn.style.visibility = "visible";
  upcomingSearch.style.visibility = "visible";
  getCalendarList();
  listUpcomingEvents();

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
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
  listUpcomingEvents();
}

async function listUpcomingEvents() {
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
  const content = document.getElementById("content");

  if (!events || !Array.isArray(events)) {
    content.innerHTML = "<p>No events found or invalid data.</p>";
    return;
  }

  content.innerHTML = "";

  events.forEach((event) => {
    const eventInfo = document.createElement("p");
    eventInfo.textContent = `${event.summary} (${
      event.start.dateTime || event.start.date
    })`;
    content.appendChild(eventInfo);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (apiConfig) {
    apiConfig.onload = gapiLoaded;
  } else {
    console.error("apiConfig element not found.");
  }

  if (clientConfig) {
    clientConfig.onload = gisLoaded;
  } else {
    console.error("clientConfig element not found.");
  }
});

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

apiConfig.onload = gapiLoaded();
clientConfig.onload = gisLoaded();
