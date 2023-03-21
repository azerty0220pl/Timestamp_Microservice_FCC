const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api", (req, res) => {
  let date = new Date(req.query.date);
  if(!isNaN(date.getTime()))
    res.json({"unix": date.getTime(), "utc": date.toUTCString()});
  else
    res.json({"error": "Invalid Date"})
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
