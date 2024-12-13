let express = require("express");
let app = express();

let router = express.Router();

app.get("/", (req, res) => {
  res.send();
});

app.use("/api/", router);

app.listen(5500, () => {
  console.log("Express is listening on http://localhost:5500...");
});
