const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const data = require("./db");
const path = require("path");

const PORT = process.env.PORT || 3001;

//middlewear
app.use("/", express.static(path.resolve(__dirname, "../client")));
app.use("/user", express.json());
app.use("/", cors());

//serves steam game data
app.get("/steamData", async (req, res) => {
  try {
    const { steamID } = req.query;
    let response = await axios({
      method: "GET",
      url: `https://store.steampowered.com/api/appdetails?appids=${steamID}`
    });
    response = response.data;
    const gameData = response[steamID].data;
    if(!gameData) throw new Error('no data found');
    let returnData = await {
      thumbnail: gameData.header_image ? gameData.header_image : null,
      desc: gameData.short_description ? gameData.short_description : "no description available",
      video: gameData.movies ? gameData.movies[0] : null
    };
    res.status(200).send(returnData);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
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
    switch(err.message) {
      case 'no data found':
        res.status(404).send(err);
        break;
      default:
        res.send(err);
    }
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
    res.send(err.message);
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
    res.send(err.message);
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
    console.log("game_deleted");
    res.status(200).send("game deleted");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//serves index file
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "index.html"));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
