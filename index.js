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
  user: {type: Number}
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

app.post("/api/users/:_id/exercises", (req, res) => {
  User.findById(parseInt(req.params._id)).then((doc) => {
    console.log("found");
    let date = new Date().toDateString();
    if(req.body.date != null)
      date = date(req.body.date).toDateString();
    let ex = new Exercise({_id: doc._id.toString() + '-' + doc.count.toString(), description: req.body.description, duration: parseInt(req.body.duration), date: date, user: doc._id});
    
    console.log({"username": doc.username, "description": ex.description, "duration": ex.duration, date: ex.date, "_id": doc._id});

    ex.save().then((e) => {
      console.log("saved");
      console.log({"username": doc.username, "description": e.description, "duration": e.duration, "date": e.date, "_id": doc._id});
      res.json({"username": doc.username, "description": e.description, "duration": e.duration, "date": e.date, "_id": doc._id});
      doc.overwrite({username: doc.username, count: doc.count + 1});
      doc.save();
      console.log("doc " + doc)
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

app.get("/api/users/:_id/logs", (req, res) => {
  User.findById(parseInt(req.params._id)).then((doc) => {
    Exercise.find({user: doc._id}).then((ex) => {
      res.json({"username": doc.username, "count": doc.count, "_id": doc._id, "log": ex.map(x => {return {"description": x.description, "duration": x.duration, "date": x.date}})});
    }).catch((err) => {
      res.json({"error": "Couldn't find exercises", "err": err});
      console.log(err);
    });
  }).catch((err) => {
    res.json({"error": "Couldn't find id", "err": err});
    console.log(err);
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
