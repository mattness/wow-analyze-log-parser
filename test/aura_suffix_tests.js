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
var parser = require('../suffixParsers/aura');

var fields = [
  '4/17 19:37:23.985  SPELL_AURA_APPLIED_DOSE,0x07000000050E0AFD,"Zoltam",',
  '0x514,0x0,0x07000000050E0AFD,"Zoltam",0x514,0x0,138958,',
  '"Spark of Zandalar",0x1,0x07000000050E0AFD,606448,28264,109,0,55800,BUFF,4'
].join('').split(',');

var brokenFields = [
  '4/17 19:43:42.587  SPELL_AURA_BROKEN_SPELL,0xF1510F5900002CF1,',
  '"Jin\'rokh the Breaker",0xa48,0x0,0x070000000350D70C,"Valinea",0x511,',
  '0x80,137162,"Static Burst",0x8,0x070000000350D70C,485473,700,28520,0,',
  '125750,546,"Water Walking",8,BUFF'
].join('').split(',');

tap.test('aura suffix parses auraType', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.ok(logEntry.auraType.buff);
  t.notOk(logEntry.auraType.debuff);
  t.end();
});

tap.test('aura suffix parses amount', function(t) {
  var logEntry = {};
  parser.call(logEntry, fields, 18);
  t.equal(logEntry.amount, 4);
  t.end();
});

tap.test('aura suffix parses broken spell id', function(t) {
  var logEntry = { suffix: 'AURA_BROKEN_SPELL'};
  parser.call(logEntry, brokenFields, 18);
  t.equal(logEntry.brokenSpellId, 546);
  t.end();
});

tap.test('aura suffix parses broken spell name', function(t) {
  var logEntry = { suffix: 'AURA_BROKEN_SPELL'};
  parser.call(logEntry, brokenFields, 18);
  t.equal(logEntry.brokenSpellName, 'Water Walking');
  t.end();
});

tap.test('aura suffix parses broken spell school', function(t) {
  var logEntry = { suffix: 'AURA_BROKEN_SPELL'};
  parser.call(logEntry, brokenFields, 18);
  t.equal(logEntry.brokenSpellSchool.raw, '8', 'raw spell school should be 8');
  t.ok(logEntry.brokenSpellSchool.nature, 'spell school should be nature');
  t.end();
});
