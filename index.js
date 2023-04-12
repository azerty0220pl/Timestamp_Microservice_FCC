const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: "process.env.SESSION_SECRET:is a random value",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000
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

app.post("/api/fileanalyse", upload.single('upfile'), (req, res) => {
  res.json({ "name": req.file.originalname, "type": req.file.mimetype, "size": req.file.size });
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
