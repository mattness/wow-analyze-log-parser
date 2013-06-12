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
var parser = require('../suffixParsers/missed');

var fields = [
  '4/17 20:10:45.110  RANGE_MISSED,0x0700000003770840,"Robmy",0x514,0x0,',
  '0xF131110B00002C45,"Farraki Sand Conjurer",0xa48,0x0,75,"Auto Shot",0x1,',
  'ABSORB,19957'
].join('').split(',');

var parryFields = [
  '4/17 19:37:34.277  SWING_MISSED,0x0700000004FFF0CF,"Elemmentt",0x514,0x0,',
  '0xF131125600002C9C,"Zandalari Blade Initiate",0xa48,0x0,PARRY'
].join('').split(',');

tap.test('missed suffix parses miss type', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 12);
  t.equal(logEntry.missType, 'ABSORB');
  t.end();
});

tap.test('missed suffix parses absorbed amount', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 12);
  t.equal(logEntry.absorbedAmount, 19957);
  t.end();
});

tap.test('missed suffix ignores absorbed amt for non-absorbs', function(t) {
  var logEntry = {};
  parser.call(logEntry, parryFields, 9);
  t.equal(logEntry.absorbedAmount, undefined);
  t.end();
});
