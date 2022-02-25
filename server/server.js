const express = require("express");
const axios = require("axios");
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));

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
  }).catch( err => {
    Error(err);
    res.send(err);
  }
  );
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

app.listen(3212, () => {
  console.log(`listening on port ${3212}`);
});
