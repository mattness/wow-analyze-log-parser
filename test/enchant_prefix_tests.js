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
var parser = require('../prefixParsers/enchant');
var entry = require('../logEntry');

var fields = [
  '4/17 20:14:18.584  ENCHANT_APPLIED,0x070000000350D70C,"Valinea",0x511,0x0,',
  '0x070000000350D70C,"Valinea",0x511,0x0,"Earthliving",94805,',
  '"Giorgio\'s Caduceus of Pure Moods"'
].join('').split(',');

tap.test('enchant prefix parses spell name', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.spellName, 'Earthliving');
  t.end();
});

tap.test('enchant prefix parses item id', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.itemId, 94805);
  t.end();
});

tap.test('enchant prefix parses item name', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.itemName, 'Giorgio\'s Caduceus of Pure Moods');
  t.end();
});
