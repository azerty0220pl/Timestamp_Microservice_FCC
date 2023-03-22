const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

let urls = [];

app.use(cors({optionsSuccessStatus: 200}));
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.route('/api/shorturl').post((req, res) => {
  console.log(req.body);
  urls.push(req.body.url);
  res.json({"original_url": req.body.url, "short_url": urls.length - 1});
});

app.get("/api/shorturl/:index", function (req, res) {
  let x = parseInt(req.params.index);
  if(x < 0 || isNaN(x) || x >= urls.length)
  {
    res.json({"error": "invalid url"});
  } else {
    res.redirect(urls[x]);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
