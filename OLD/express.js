const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(new Date().getTime() + " Ping Received");
  response.sendStatus(100);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://assistantbot.glitch.me/`);
  http.get('http://ownagepebot.glitch.me');
}, 28000);