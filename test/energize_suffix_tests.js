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
var parser = require('../suffixParsers/energize');

var fields = [
  '4/17 19:37:24.335  SPELL_ENERGIZE,0x07000000050E0AFD,"Zoltam",0x514,0x0,',
  '0x07000000050E0AFD,"Zoltam",0x514,0x0,105427,"Judgments of the Wise",0x1,',
  '0x07000000050E0AFD,606448,28264,109,0,56109,1,9'
].join('').split(',');

tap.test('energize suffix parses energizedAmount', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.equal(logEntry.energizedAmount, 1);
  t.end();
});

tap.test('energize suffix parses energizedPowerType', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.ok(logEntry.energizedPowerType.holyPower);
  t.end();
});
