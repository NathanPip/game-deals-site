const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const data = require("./db");
const path = require("path");

const PORT = process.env.PORT || 3001;

//middlewear
app.use("/", express.static(path.resolve(__dirname, "../client/public")));
app.use("/user", express.json());
app.use("/user", cors());

//serves steam game data
app.get("/steamData", (req, res) => {
  const steamID = req.query.steamID;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );
  axios({
    method: "GET",
    url: `https://store.steampowered.com/api/appdetails?appids=${steamID}`
  })
    .then(response => {
      res.send(200, response.data);
    })
    .catch(err => {
      Error(err);
      res.send(err);
    });
});

//set User Profile
app.post("/user/signup", async (req, res) => {
  try {
    const { uid, email } = req.body;
    const newUser = await data.query(
      "INSERT INTO users (uid, email) VALUES($1, $2) RETURNING *",
      [uid, email]
    );
    res.json(newUser.rows);
  } catch (err) {
    console.log(err.message);
    res.json(err.message);
  }
});
//get games from user wishlist -- using a post request as I do not want the users id to be displayed in the url parameters for security reasons
app.post("/user/games/get", async (req, res) => {
  try {
    const { uid } = req.body;
    const games = await data.query(
      "SELECT g.game_id FROM wishlisted_games g WHERE g.uid = $1",
      [uid]
    );
    res.json(games.rows);
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
});

//add games to wishlist
app.post('/user/games', async (req, res) => {
  try {
    const {uid, game_id} = req.body;
    const newGame = await data.query("INSERT INTO wishlisted_games (uid, game_id) VALUES ($1, $2) RETURNING *", [uid, game_id]);
    res.json(newGame.rows);
  } catch (err) {
    res.json(err.message)
    console.log(err.message);
  }
})

//remove game from wishlist
app.delete('/user/games', async (req, res) => {
  try {
    const {uid, game_id} = req.body;
    const deleteGame = await data.query("DELETE FROM wishlisted_games w WHERE w.uid = $1 AND w.game_id = $2", [uid, game_id]);
    res.json('game deleted');
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
})

//serves index file
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
