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

var swingFields = [
  '4/17 19:37:33.727  SWING_DAMAGE,0x07000000050E0AFD,"Zoltam",0x514,0x0,',
  '0xF1310F0C00002C9A,"Zandalari Spear-Shaper",0xa48,0x0,15370,-1,1,0,0,0,',
  'nil,1,nil'
].join('').split(',');

var spellishFields = [
  '4/17 19:37:32.042  SPELL_DAMAGE,0x0700000004F590A5,"Carolus",0x512,0x0,',
  '0xF1310F0C00002C9A,"Zandalari Spear-Shaper",0xa48,0x0,120,"Cone of Cold",',
  '0x10,0xF1310F0C00002C9A,15037539,1234,65,0,0,27191,-1,16,0,0,0,1,nil,nil'
].join('').split(',');

var environmentalFields = [
  '4/17 20:35:21.871  ENVIRONMENTAL_DAMAGE,0x0000000000000000,nil,0x80000000,',
  '0x80000000,0x0700000005082392,"Rhisen",0x512,0x0,0x0700000005082392,',
  '479914,147,29847,0,300000,Falling,74339,0,1,0,0,0,nil,nil,nil'
].join('').split(',');

var rangeFields = [
  '4/17 19:37:32.926  RANGE_DAMAGE,0x0700000003770840,"Robmy",0x514,0x0,',
  '0xF1310F0C00002C9A,"Zandalari Spear-Shaper",0xa48,0x0,75,"Auto Shot",0x1,',
  '0xF1310F0C00002C9A,14870221,1234,65,0,0,20196,-1,1,0,0,0,nil,nil,nil'
].join('').split(',');

var spellPeriodicFields = [
  '4/17 19:37:32.042  SPELL_PERIODIC_DAMAGE,0x0700000004BF08F0,"Avance",',
  '0x512,0x0,0xF131125600002C9C,"Zandalari Blade Initiate",0xa48,0x0,14914,',
  '"Holy Fire",0x2,973,-1,2,0,0,0,nil,nil,nil'
].join('').split(',');

tap.test('damage suffix parses swing amount', function(t) {
  var swingEntry = { prefix: 'SWING' };
  parser.call(swingEntry, swingFields);
  t.equal(swingEntry.amount, 15370);
  t.end();
});

tap.test('damage suffix parses spell amount', function(t) {
  var spellEntry = { prefix: 'SPELL' };
  parser.call(spellEntry, spellishFields);
  t.equal(spellEntry.amount, 27191);
  t.end();
});

tap.test('damage suffix parses environmental amount', function(t) {
  var environmentalEntry = { prefix: 'ENVIRONMENTAL' };
  parser.call(environmentalEntry, environmentalFields);
  t.equal(environmentalEntry.amount, 74339);
  t.end();
});

tap.test('damage suffix parses range amount', function(t) {
  var rangeEntry = { prefix: 'RANGE' };
  parser.call(rangeEntry, rangeFields);
  t.equal(rangeEntry.amount, 20196);
  t.end();
});

tap.test('damage suffix parses spell periodic amount', function(t) {
  var periodicEntry = { prefix: 'SPELL_PERIODIC' };
  parser.call(periodicEntry, spellPeriodicFields);
  t.equal(periodicEntry.amount, 973);
  t.end();
});

tap.test('damage suffix parses swing overkill', function(t) {
  var swingEntry = { prefix: 'SWING' };
  parser.call(swingEntry, swingFields);
  t.equal(swingEntry.overkill, -1);
  t.end();
});

tap.test('damage suffix parses spell overkill', function(t) {
  var spellEntry = { prefix: 'SPELL' };
  parser.call(spellEntry, spellishFields);
  t.equal(spellEntry.overkill, -1);
  t.end();
});

tap.test('damage suffix parses environmental overkill', function(t) {
  var environmentalEntry = { prefix: 'ENVIRONMENTAL' };
  parser.call(environmentalEntry, environmentalFields);
  t.equal(environmentalEntry.overkill, 0);
  t.end();
});

tap.test('damage suffix parses range overkill', function(t) {
  var rangeEntry = { prefix: 'RANGE' };
  parser.call(rangeEntry, rangeFields);
  t.equal(rangeEntry.overkill, -1);
  t.end();
});

tap.test('damage suffix parses spell periodic overkill', function(t) {
  var periodicEntry = { prefix: 'SPELL_PERIODIC' };
  parser.call(periodicEntry, spellPeriodicFields);
  t.equal(periodicEntry.overkill, -1);
  t.end();
});

tap.test('damage suffix parses swing school', function(t) {
  var swingEntry = { prefix: 'SWING' };
  parser.call(swingEntry, swingFields);
  t.ok(swingEntry.school.physical, 'should be physical');

  for (var key in swingEntry.school) {
    if(swingEntry.school.hasOwnProperty(key) && key !== 'raw'
        && key !== 'physical') {
      t.notOk(swingEntry.school[key], 'should not be ' + key);
    }
  }
  t.end();
});

tap.test('damage suffix parses spell school', function(t) {
  var spellEntry = { prefix: 'SPELL' };
  parser.call(spellEntry, spellishFields);
  t.ok(spellEntry.school.frost, 'should be frost');


  for (var key in spellEntry.school) {
    if (spellEntry.school.hasOwnProperty(key) && key !== 'raw'
        && key !== 'frost') {
      t.notOk(spellEntry.school[key], 'should not be ' + key);
    }
  }
  t.end();
});

tap.test('damage suffix parses environmental school', function(t) {
  var environmentalEntry = { prefix: 'ENVIRONMENTAL' };
  parser.call(environmentalEntry, environmentalFields);
  t.ok(environmentalEntry.school.physical, 'should be physical');

  for (var key in environmentalEntry.school) {
    if(environmentalEntry.school.hasOwnProperty(key) && key !== 'raw'
        && key !== 'physical') {
      t.notOk(environmentalEntry.school[key], 'should not be ' + key);
    }
  }
  t.end();
});

tap.test('damage suffix parses range school', function(t) {
  var rangeEntry = { prefix: 'RANGE' };
  parser.call(rangeEntry, rangeFields);
  t.ok(rangeEntry.school.physical, 'should be physical');

  for (var key in rangeEntry.school) {
    if(rangeEntry.school.hasOwnProperty(key) && key !== 'raw'
        && key !== 'physical') {
      t.notOk(rangeEntry.school[key], 'should not be ' + key);
    }
  }
  t.end();
});

tap.test('damage suffix parses spell periodic school', function(t) {
  var periodicEntry = { prefix: 'SPELL_PERIODIC' };
  parser.call(periodicEntry, spellPeriodicFields);
  t.ok(periodicEntry.school.holy, 'should be holy');

  for (var key in periodicEntry.school) {
    if(periodicEntry.school.hasOwnProperty(key) && key !== 'raw'
        && key !== 'holy') {
      t.notOk(periodicEntry.school[key], 'should not be ' + key);
    }
  }
  t.end();
});
