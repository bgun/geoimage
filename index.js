const express  = require('express');
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
            res
              .set('Content-Type','text/html')
              .send("<img src='"+photo.url+"' />");
          }
        });
      });
    }
  });
});

console.log("listening on port %d", PORT);
server.listen(PORT);
