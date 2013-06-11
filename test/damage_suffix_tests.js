// Copyright (c) Matt Gollob and other wow-analyze contributors.
// All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

var tap = require('tap');
var parser = require('../suffixParsers/damage');
var entry = require('../logEntry');

var fields = [
  '4/17 19:37:33.727  SWING_DAMAGE,0x07000000050E0AFD,"Zoltam",0x514,0x0,',
  '0xF1310F0C00002C9A,"Zandalari Spear-Shaper",0xa48,0x0,15370,-1,1,0,0,0,',
  'nil,1,nil'
].join('').split(',');

tap.test('damage suffix parses amount', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.amount, 15370);
  t.end();
});

tap.test('damage suffix parses swing overkill', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.overkill, -1);
  t.end();
});

tap.test('damage suffix parses swing school', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.ok(logEntry.school.physical, 'should be physical');

  for (var key in logEntry.school) {
    if(logEntry.school.hasOwnProperty(key) && key !== 'raw'
        && key !== 'physical') {
      t.notOk(logEntry.school[key], 'should not be ' + key);
    }
  }
  t.end();
});
