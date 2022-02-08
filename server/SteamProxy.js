const express = require("express");
const axios = require("axios");
const app = express();

app.get("/steamData", (req, res) => {
  const steamID = req.query.steamID;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
  axios({
    method: "GET",
    url: `https://store.steampowered.com/api/appdetails?appids=${steamID}`
  }).then(response => {
    res.send(200, response.data);
  });
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`listening on port ${app.get("port")}`);
});
