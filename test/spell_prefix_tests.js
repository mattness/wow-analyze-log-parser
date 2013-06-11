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
var parser = require('../prefixParsers/spell');
var entry = require('../logEntry');

var fields = [
  '4/17 19:37:22.434  SPELL_AURA_APPLIED,0x0700000003770840,"Robmy",0x514,',
  '0x0,0x0700000003770840,"Robmy",0x514,0x0,34477,"Misdirection",0x1,',
  '0x0700000003770840,467815,18836,183,2,100,BUFF'
].join('').split(',');

tap.test('spell prefix parses spell id', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.spellId, 34477);
  t.end();
});

tap.test('spell prefix parses spell name', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.spellName, 'Misdirection');
  t.end();
});

tap.test('spell prefix parses spell school', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.spellSchool.raw, '0x1', 'raw spell school should be 0x1');
  t.ok(logEntry.spellSchool.physical, 'spell school should be physical');
  t.end();
});
