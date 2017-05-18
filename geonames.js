const _        = require('lodash');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');



let stream_options = {
  encoding: 'utf-8'
};

let parse_options = {
  auto_parse: true,
  delimiter: '\t',
  escape: '',
  quote: '',
};

let file = path.resolve(__dirname)+'/cities15000.txt';
let count = 0;
let line = '';

module.exports = class GeonameSearch {

  search(str, cb) {
    let stream = fs.createReadStream(file, stream_options);

    const rl = readline.createInterface({
      input: stream
    });

    let results = [];

    rl.on('line', line => {
      count++;
      let vals = line.split('\t');
      let keys = ['id','utf8_name','ascii_name','alternate_names','lat','lon','feature_class','feature_code','country_code','cc2','admin1','admin2','admin3','admin4','population','elevation','dem','timezone','updated_date'];
      let obj = _.zipObject(keys, vals);
      obj.alternate_names = obj.alternate_names.split(',');
      obj.lat = parseFloat(obj.lat);
      obj.lon = parseFloat(obj.lon);
      obj.population = parseInt(obj.population);

      let search = [obj.utf8_name, obj.ascii_name].concat(obj.alternate_names).map(name => name.toUpperCase());

      if (_.includes(search, str.toUpperCase())) {
        results.push(obj);
      }
    });

    rl.on('close', () => {
      console.log("found %d cities named", results.length);
      results = _.sortBy(results, ['population']);
      results.reverse();
      // return the single best match, currently most populous place
      if (results.length) {
        cb(null, results[0]);
      } else {
        cb("Place not found");
      }
    });
  }
}
