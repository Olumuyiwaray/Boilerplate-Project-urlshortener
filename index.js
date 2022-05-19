require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Data = require('./data');
const dns = require('dns');
const urlParser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URL;

mongoose.connect(dbURI)
.then((result) => app.listen(port, function() {
  console.log(`Listening on port ${port}`);
}))
.catch((err) => console.log(err));
  
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl', function(req, res) {
  let bodyUrl = req.body.url;
  dns.lookup(urlParser.parse(bodyUrl).hostname, (error, address) => {
    if(!address) {
      res.json({error: "invalid url"});
    } else {
      const data = new Data({
        url: bodyUrl
      });
    data.save()
    .then((result) => {
      res.send({original_url: result.url, short_url: result.id });
    })
    .catch((err) => {
      console.log(err);
    })
    }
  })
});

app.get('/api/shorturl/:id', function(req, res) {

  const id = req.params.id;
  Data.findById(id, (err, data) => {
    if (!data) {
      res.json({error: "invalid url"})
    } else {
     res.redirect(data.url);
    }
  })
});



