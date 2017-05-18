const express = require('express');
const request = require('superagent');

const server = express();
const PORT = process.env.PORT || 9999;

let PhotoSearch   = require('./photos');
let GeonameSearch = require('./geonames');



server.get('/search/:city', (req, res) => {

  let gs = new GeonameSearch();
  let query = req.params.city;

  gs.search(query, (err, city) => {
    if (err) {
      res.status(404).send({ error: err });
    } else {
      let ps = new PhotoSearch(() => {
        ps.search({ query: query, lat: city.lat, lon: city.lon }, (err, photo) => {
          if (err) {
            res.status(404).send({ error: err });
          } else {
            console.log(photo);
            request.get(photo.url, (err, data) => {
              if (err) throw err;
              res
                .set('Content-Type', 'image/jpeg')
                .send(data.body);
            });
          }
        });
      });
    }
  });
});

server.get('/test', (req, res) => {
  res.sendfile('index.html');
});

console.log("listening on port %d", PORT);
server.listen(PORT);
