const express = require("express");
const cors = require("cors");
const unique = require("uniq");
const app = express();

const router = express.Router();

app.use(express.json());
app.use(cors());
app.use(unique());
app.use(express.static("public"));

app.get("/", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send();
});

app.get("/calendars", async (req, res) => {
  try {
    // eslint-disable-next-line no-undef
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
});

app.use("/api/", router);

app.listen(8000, () => {
  console.log("Express is listening on http://localhost:8000...");
});
