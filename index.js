var fs = require('fs'),
    autocast = require('autocast'),
    strsplit = require('strsplit'),
    join = require('path').join,
    paths = [
      '/usr/local/include',
      '/usr/include'
    ];

if (process.env.C_INCLUDE_PATH)
  paths = process.env.C_INCLUDE_PATH.split(':').concat(paths);

module.exports = include;
module.exports.async = include_async;
module.exports.parse = parse;

/**
 * Include the file synchronously
 */
function include(f, comments) {
  return parse(fs.readFileSync(f, 'utf-8'), comments);
}

/**
 * read the file async
 */
function include_async(f, comments, cb) {
  if (typeof comments === 'function') {
    cb = comments;
    comments = null;
  }
  fs.readFile(f, 'utf-8', function(err, s) {
    if (err) return cb(err);
    cb(null, parse(s, comments));
  });
}

/**
 * Find the given file/header
 *
 * Not in use
 */
function find_file(name) {
  if (name.indexOf('<') === 0 && name.indexOf('>') === name.length - 1)
    name = name.substr(1).substr(0, name.length - 2)
  else
    if (fs.existsSync(name)) return name;

  var file;
  paths.forEach(function(path) {
    var _file = join(path, name);
    console.log(_file);
    if (fs.existsSync(_file)) file = _file;
  });

  if (!file) throw new Error('File not found');
  return file;
}

/**
 * The main header parsing logic
 * takes a string of the header file
 */
function parse(s, comments) {
  var lines = s.split('\n'),
      ret = {},
      line,
      i;

  // read the file line by line
  for (i in lines) {
    line = lines[i];
    if (line.indexOf('#define') === 0) {
      // parse the define
      var def = parse_define(line),
          name = def.name;
      delete def.name;

      // remove comments if they are not wanted
      if (!comments) def = def.value;
      ret[name] = def;
    }
  }

  return ret;
}

/**
 * Internal helper function to parse #define's
 */
function parse_define(s) {
  var fields = strsplit(s, /\s+/, 4);
  return {
    'name': fields[1],
    'value': autocast(fields[2]),
    'comment': fields[3],
  };
}
