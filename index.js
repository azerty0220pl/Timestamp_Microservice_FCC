const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

let count = 0;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: { type: Number, required: true },
  username: { type: String, required: true },
  count: {type: Number, required: false}
});
const User = mongoose.model("User", userSchema);

const exerciseSchema = new Schema({
  _id: { type: Number, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
  user: {type: mongoose.Types.ObjectId, ref: "user"}
});
const Exercise = mongoose.model("Exercise", exerciseSchema);

app.use(cors({optionsSuccessStatus: 200}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.route('/api/users').post((req, res) => {
  console.log(count);
  let user = new User({_id: count, username: req.body.username, count: 0});
  count++;
  console.log(count);
  user.save().then((doc) => {
    console.log('start send');
    res.json({"username": doc.username, "_id": doc._id.toString()});
  }).catch((err) => {
    console.log('error save');
    res.json({"username": doc.username, "_id": doc._id.toString()});
  });
  console.log('end post');
}).get((req, res) => {
  User.find({}).then((doc) => {
    let data = doc.map((x) => {
      return JSON.parse({"username": x.username, "_id": x._id.toString()});
    });
    res.send(data);
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
