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
  axios({
    method: "GET",
    url: `https://store.steampowered.com/api/appdetails?appids=${steamID}`
  })
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(err => {
      Error(err);
      res.status(400).send(err);
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
    res.status(200).send(newUser.rows);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
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
    res.status(200).send(games.rows);
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err.message);
  }
});

//add games to wishlist
app.post("/user/games", async (req, res) => {
  try {
    const { uid, game_id, game_title } = req.body;
    const newGame = await data.query(
      "INSERT INTO wishlisted_games (uid, game_id, game_title) VALUES ($1, $2, $3) RETURNING *",
      [uid, game_id, game_title]
    );
    console.log(newGame.rows);
    res.status(200).send(newGame.rows);
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err.message);
  }
});

//remove game from wishlist
app.delete("/user/games", async (req, res) => {
  try {
    const { uid, game_title } = req.body;
    await data.query(
      "DELETE FROM wishlisted_games w WHERE w.uid = $1 AND w.game_title = $2",
      [uid, game_title]
    );
    console.log('game_deleted')
    res.status(200).send('game deleted')
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err.message);
  }
});

//serves index file
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
