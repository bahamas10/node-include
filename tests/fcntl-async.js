var include = require('../');

include.async('/usr/include/sys/fcntl.h', function(err, data) {
  if (err) throw err;
  console.log('Passed');
});
