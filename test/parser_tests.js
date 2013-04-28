var fs = require('fs');
var path = require('path');
var tap = require('tap');
var Parser = require('../log-parser');

tap.test("parsing yields the correct number of records", function(t) {
  var p = new Parser();
  var recordCount = 0;

  p.on('readable', p.read);
  p.on('record', function() { recordCount++; });
  p.on('end', function() {
    t.equal(recordCount, 1000, "should have 1000 records");
    t.end();
  });

  fs.createReadStream(path.resolve(__dirname, 'support', 'test-log.txt'))
    .pipe(p);
});
