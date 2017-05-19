let PhotoSearch   = require('./photos');


let ps = new PhotoSearch(() => {
  ps.search({ query: "nyc", lat: 40.74, lon: -74 }, (err, photo) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(photo.url);
  });
});