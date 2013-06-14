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
var parser = require('../suffixParsers/dispel');

var fields = [
  '4/17 19:57:18.873  SPELL_DISPEL,0x070000000350D70C,"Valinea",0x511,0x0,',
  '0x0700000004FFF0CF,"Elemmentt",0x514,0x0,136719,"Blazing Sunlight",0x4,',
  '0x0700000004FFF0CF,328423,45668,124,3,18,77130,"Purify Spirit",8,DEBUFF'
].join('').split(',');

tap.test('dispel suffix parses dispelling spell id', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.equal(logEntry.dispelledSpellId, 77130);
  t.end();
});

tap.test('dispel suffix parses dispelling spell name', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.equal(logEntry.dispelledSpellName, 'Purify Spirit');
  t.end();
});

tap.test('dispel suffix parses dispelling spell school', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.equal(logEntry.dispelledSpellSchool.raw, '8',
    'raw spell school should be 8');
  t.ok(logEntry.dispelledSpellSchool.nature, 'spell school should be nature');
  t.end();
});

tap.test('dispel suffix parses auraType', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.notOk(logEntry.auraType.buff);
  t.ok(logEntry.auraType.debuff);
  t.end();
});