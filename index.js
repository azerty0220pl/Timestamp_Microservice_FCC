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
  date: { type: Date, required: true },
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
    let date = new Date();
    if(req.body.date != null)
      date = Date(req.body.date);
    let ex = new Exercise({_id: doc._id.toString() + '-' + doc.count.toString(), description: req.body.description, duration: parseInt(req.body.duration), date: date, user: doc._id});

    ex.save().then((e) => {
      res.json({"username": doc.username, "description": e.description, "duration": e.duration, "date": e.date.toDateString(), "_id": doc._id});
      console.log({"username": doc.username, "description": e.description, "duration": e.duration, "date": e.date.toDateString(), "_id": doc._id});
      doc.overwrite({username: doc.username, count: doc.count + 1});
      doc.save();
    }).catch((err) => {
      res.json({"error": "Couldn't save", "err": err});
      console.log(err);
    });
  }).catch((err) => {
    res.json({"error": "Couldn't find id", "err": err});
    console.log(err);
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  console.log(req);
  User.findById(parseInt(req.params._id)).then((doc) => {
    let query = Exercise.find({user: doc._id});
    if(req.query.limit != null)
      query = query.limit(parseInt(req.query.limit));
    if(req.query.from != null)
      query = query.find({date : {$gte: Date(req.query.from)}});
    if(req.query.to != null)
    query = query.find({date : {$lte: Date(req.query.to)}});
    
    query.exec().then((ex) => {
      if(req.query.limit != undefined)
        ex.limit()
      res.json({"username": doc.username, "count": doc.count, "_id": doc._id, "log": ex.map(x => {return {"description": x.description, "duration": x.duration, "date": x.date.toDateString()}})});
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
