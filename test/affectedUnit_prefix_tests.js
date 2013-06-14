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
var parser = require('../prefixParsers/affectedUnit');
var entry = require('../logEntry');

var fields = [
  '4/17 20:35:21.871  ENVIRONMENTAL_DAMAGE,0x0000000000000000,nil,',
  '0x80000000,0x80000000,0x0700000005082392,"Rhisen",0x512,0x0,',
  '0x0700000005082392,479914,147,29847,0,300000,Falling,74339,0,1,0,0,0,nil,',
  'nil,nil'
].join('').split(',');

var offsets = {
  'DAMAGE_SPLIT': 0,
  'ENCHANT_APPLIED': 0,
  'ENCHANT_REMOVED': 0,
  'ENVIRONMENTAL_DAMAGE': 6,
  'PARTY_KILL': 0,
  'RANGE_DAMAGE': 6,
  'RANGE_MISSED': 0,
  'SPELL_AURA_APPLIED': 6,
  'SPELL_AURA_APPLIED_DOSE': 6,
  'SPELL_AURA_BROKEN_SPELL': 6,
  'SPELL_AURA_REFRESH': 6,
  'SPELL_AURA_REMOVED': 6,
  'SPELL_AURA_REMOVED_DOSE': 6,
  'SPELL_CAST_FAILED': 0,
  'SPELL_CAST_START': 6,
  'SPELL_CAST_SUCCESS': 6,
  'SPELL_CREATE': 0,
  'SPELL_DAMAGE': 6,
  'SPELL_DISPEL': 6,
  'SPELL_ENERGIZE': 6,
  'SPELL_HEAL': 6,
  'SPELL_INSTAKILL': 0,
  'SPELL_INTERRUPT': 6,
  'SPELL_MISSED': 6,
  'SPELL_PERIODIC_DAMAGE': 0,
  'SPELL_PERIODIC_ENERGIZE': 6,
  'SPELL_PERIODIC_HEAL': 0,
  'SPELL_PERIODIC_MISSED': 0,
  'SPELL_RESURRECT': 0,
  'SPELL_STOLEN': 6,
  'SPELL_SUMMON': 0,
  'SWING_DAMAGE': 0,
  'SWING_MISSED': 0,
  'UNIT_DESTROYED': 0,
  'UNIT_DIED': 0
};

tap.test('affected unit prefix returns the correct offset', function(t) {
  for (var key in offsets) {
    if (offsets.hasOwnProperty(key)) {
      var logEntry = { event: key };
      var r = parser.call(logEntry, fields, entry.baseFieldsLength);
      t.equal(r, entry.baseFieldsLength + offsets[key], key);
    }
  }

  t.end();
});

tap.test('affected unit prefix ignores invalid events', function(t) {
  for (var key in offsets) {
    if (offsets.hasOwnProperty(key) && offsets[key] === 0) {
      var logEntry = { event: key };
      var r = parser.call(logEntry, fields, entry.baseFieldsLength);
      t.equal(logEntry.affectedUnit, undefined, key);
    }
  }

  t.end();
});

tap.test('affected unit prefix parses valid events', function(t) {
  for (var key in offsets) {
    if (offsets.hasOwnProperty(key) && offsets[key] > 0) {
      var logEntry = { event: key };
      var r = parser.call(logEntry, fields, entry.baseFieldsLength);
      t.notEqual(logEntry.affectedUnit, undefined, key);
    }
  }

  t.end();
});

tap.test('affected unit prefix parses unit id', function(t) {
  var logEntry = { event: 'ENVIRONMENTAL_DAMAGE' };
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal('0x0700000005082392', logEntry.affectedUnit.id);
  t.end();
});

tap.test('affected unit prefix parses health after amount', function(t) {
  var logEntry = { event: 'ENVIRONMENTAL_DAMAGE' };
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(479914, logEntry.affectedUnit.healthAfter);
  t.end();
});

tap.test('affected unit prefix parses power type', function(t) {
  var logEntry = { event: 'ENVIRONMENTAL_DAMAGE' };
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.ok(logEntry.affectedUnit.powerType.mana);
  t.end();
});

tap.test('affected unit prefix parses power after amount', function(t) {
  var logEntry = { event: 'ENVIRONMENTAL_DAMAGE' };
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(300000, logEntry.affectedUnit.powerAfter);
  t.end();
});
