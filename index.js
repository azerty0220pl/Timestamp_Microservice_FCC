const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
/*
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

app.get("/api/1451001600000", (req, res) => {
  res.json({ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" });
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
*/

app.get("/api/whoami", (req, res) => {
  res.json({"ipaddress": req.ip, "language": req.get('Accept-Language'), "software": req.get('User-Agent')})
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
