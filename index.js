const express = require('express');
const multer  = require('multer')
const upload = multer({ dest: './uploads/' })
const app = express();
const cors = require('cors');

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post("/api/fileanalyse", upload.single('file'), (req, res) => {
  res.json({"name": req.file.originalName});
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
