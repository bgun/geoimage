const express = require('express');
const request = require('superagent');

const server = express();
const PORT = process.env.PORT || 9999;

let PhotoSearch   = require('./photos');
let GeonameSearch = require('./geonames');



server.get('/search/:city', (req, res) => {

  let gs = new GeonameSearch();
  let query = req.params.city;

  gs.search(query, (err, geo) => {
    if (err) {
      res.status(404).send({ error: err });
    } else {
      let ps = new PhotoSearch(() => {
        let search_query = {
          query: geo.utf8_name,
          lat: geo.lat,
          lon: geo.lon
        };
        console.log("query", search_query);
        ps.search(search_query, (err, photo) => {
          console.log(err, photo);
          if (err) {
            res.status(404).set("Content-Type","application/json").send({ error: err });
          } else {
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
