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
  _id: { type: String, required: true },
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
  let user = new User({_id: count, username: req.body.username, count: 0});
  count++;
  user.save().then((doc) => {
    res.json({"username": doc.username, "_id": doc._id.toString()});
  }).catch((err) => {
    res.json({"error": "Couldn't save", "err": err});
    console.log(err);
  });
}).get((req, res) => {
  User.find({}).then((doc) => {
    let data = doc.map((x) => {
      return {"username": x.username, "_id": x._id.toString()};
    });
    res.send(data);
  }).catch((err) => {
    res.send([]);
    console.log(err);
  });
});

app.post("/api/users/:id/exercises", (req, res) => {
  console.log("starting");
  console.log(req.params.id);
  console.log(parseInt(req.params.id));
  let user = User.findById(parseInt(req.params.id)).then((doc) => {
    console.log("found");
    let date = new Date().toString();
    if(req.body.date != null)
      date = req.body.date;
    let ex = new Exercise({_id: doc._id.toString() + '-' + doc.count, description: req.body.description, duration: req.body.duration, date: date, user: doc._id});
    
    console.log({"username": doc.username, "description": ex.description, "duration": ex.duration, date: ex.date, "_id": doc._id});
    doc.overwrite({_id: doc._id, username: doc.username, count: doc.count + 1});

    ex.save().then((doc) => {
      console.log("saved");
      console.log({"username": doc.username, "description": ex.description, "duration": ex.duration, date: ex.date, "_id": doc._id});
      res.json({"username": doc.username, "description": ex.description, "duration": ex.duration, date: ex.date, "_id": doc._id});
    }).catch((err) => {
      res.json({"error": "Couldn't save", "err": err});
      console.log(err);
    });
    console.log("ending");
  }).catch((err) => {
    res.json({"error": "Couldn't find id", "err": err});
    console.log(err);
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
