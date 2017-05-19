let Flickr = require('flickrapi');
let flickrOptions = {
  api_key: "2e9be5ac9c35726b3942fd73a24f15af",
  secret: "cded1c9a57328c31"
};

let API500px = require('500px');

module.exports = class flickrApi {

  constructor(ready) {
    this.api500px = new API500px("fUs2MhwbMpQy65WQFXdS3L7V3l1hyliZ1RiQlMxM");
    Flickr.tokenOnly(flickrOptions, (err, flickr) => {
      this.flickr = flickr;
      if (err) throw err;
      ready();
    });
  }

  search(options, cb) {
    this.api500px.photos.searchByGeo([options.lat, options.lon, "10km"].join(','), {
      exclude: 'People,Nude',
      image_size: 200,
      rpp: 3,
      sort: "rating",
      term: [options.query,'city','travel','skyline','sunset'].join(' '),
    }, (err, results) => {
      if (err) {
        cb(err);
      } else if (results && results.photos && results.photos.length) {
        let r = results.photos[0];
        cb(null, {
          url: r.image_url,
          result: r
        });
      } else {
        cb("Photo not found");
      }
    });
  }

  searchFlickr() {
    let search_options = {
      extras: 'url_l,tags,description',
      format: 'json',
      lat: options.lat,
      license: '1,2,3,4,5,6,7,8',
      lon: options.lon,
      media: 'photos',
      per_page: 10,
      radius: 5,
      sort: 'relevance',
      tags: [options.query, 'travel', 'downtown', 'skyline', 'architecture', 'sunset'].join(',')
    };
    this.flickr.photos.search(search_options, (err, resp) => {
      if (err) {
        cb(err);
      }
      let photo = resp.photos.photo[0];
      if (photo) {
        let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
        console.log(url);
        cb(null, {
          url: url,
          photo: photo
        });
      } else {
        cb("Photo not found");
      }
    });
  }

}