const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api", (req, res) => {
  let date = null;
  if(req.query.date == null)
    date = new Date();
  else
    date = new Date(req.query.date);

  if(!isNaN(date.getTime()))
    res.json({"unix": date.getTime(), "utc": date.toUTCString()});
  else
    res.json({"error": "Invalid Date"})
});

app.get("/api/:date", (req, res) => {
  let date = null;
  if(req.params.date == null)
    date = new Date();
  else
    date = new Date(req.params.date);

  if(!isNaN(date.getTime()))
    res.json({"unix": date.getTime(), "utc": date.toUTCString()});
  else
    res.json({"error": "Invalid Date"})
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
