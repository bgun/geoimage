let Flickr = require('flickrapi');
let flickrOptions = {
  api_key: "2e9be5ac9c35726b3942fd73a24f15af",
  secret: "cded1c9a57328c31"
};

module.exports = class flickrApi {

  constructor(ready) {
    Flickr.tokenOnly(flickrOptions, (err, flickr) => {
      this.flickr = flickr;
      if (err) throw err;
      ready();
    });
  }

  search(options, cb) {
    let search_options = {
      lat: options.lat,
      lon: options.lon,
      tags: [options.query, 'travel', 'downtown', 'skyline', 'outdoor', 'beach', 'sunrise', 'sunset', 'architecture'].join(','),
      radius: 5,
      format: 'json',
      sort: 'relevance',
      media: 'photos',
      in_gallery: true,
      per_page: 10,
      extras: 'url_l,tags,description'
    };
    this.flickr.photos.search(search_options, (err, resp) => {
      if (err) {
        cb(err);
      }
      let photo = resp.photos.photo[0];
      if (photo) {
        cb(null, {
          url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
          photo: photo
        });
      } else {
        cb("Photo not found");
      }
    });
  }

}