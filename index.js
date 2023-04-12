const express = require('express');
const session = require('express-session');

const app = express();

app.set('trust proxy', true);

app.use(session({
  secret: "process.env.SESSION_SECRET:is a random value",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    proxy: true
  },
  key: 'express.sid'
}));

app.use((req, res, next) => {
  console.log("current session:", req.sessionID);
  next();
});

app.get("/", function (req, res) {
  res.cookie("test", "Hello, World!");
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/1", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
