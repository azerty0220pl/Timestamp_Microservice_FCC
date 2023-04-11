const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const upload = multer();
const app = express();
const cors = require('cors');

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
