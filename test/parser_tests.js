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

var stream = require('stream');
var tap = require('tap');
var Parser = require('../log-parser');

var data = [
  '4/17 19:37:22.434  SPELL_AURA_APPLIED,0x0700000003770840,"Robmy",0x514,',
  '0x0,0x0700000003770840,"Robmy",0x514,0x0,34477,"Misdirection",0x1,',
  '0x0700000003770840,467815,18836,183,2,100,BUFF'
].join('');


tap.test('parsing yields the correct number of records', function(t) {
  var fs = require('fs');
  var path = require('path');
  var p = new Parser();
  var recordCount = 0;

  p.on('readable', p.read);
  p.on('record', function() { recordCount++; });
  p.on('end', function() {
    t.equal(recordCount, 1000, 'should have 1000 records');
    t.end();
  });

  fs.createReadStream(path.resolve(__dirname, 'support', 'test-log.txt'))
    .pipe(p);
});

tap.test('records have the raw data', function(t) {
  var p = new Parser();

  p.on('readable', p.read);
  p.on('record', function(r) {
    t.equal(r.rawData, data);
    t.end();
  });

  new stream.PassThrough().pipe(p).end(data);
});

tap.test('records have the correct date and time', function(t) {
  var p = new Parser();
  var now = new Date();

  var expected = new Date(now.getFullYear(), 3, 17, 19, 37, 22, 434);
  if (now < expected) expected.setFullYear(now.getFullYear() - 1);

  p.on('readable', p.read);
  p.on('record', function(r) {
    t.equal(r.timestamp.valueOf(), expected.valueOf(),
      'should be 4/17 19:37:22.434');
    t.end();
  });

  new stream.PassThrough().pipe(p).end(data);
});

tap.test('records have the correct event', function(t) {
  var p = new Parser();

  p.on('readable', p.read);
  p.on('record', function(r) {
    t.equal(r.event, 'SPELL_AURA_APPLIED', 'should be SPELL_AURA_APPLIED');
    t.end();
  });

  new stream.PassThrough().pipe(p).end(data);
});

tap.test('records have the correct eventPrefix', function(t) {
  var p = new Parser();

  p.on('readable', p.read);
  p.on('record', function(r) {
    t.equal(r.eventPrefix, 'SPELL', 'should be SPELL');
    t.end();
  });

  new stream.PassThrough().pipe(p).end(data);
});

tap.test('records have the correct eventSuffix', function(t) {
  var p = new Parser();

  p.on('readable', p.read);
  p.on('record', function(r) {
    t.equal(r.eventSuffix, 'AURA_APPLIED', 'should be AURA_APPLIED');
    t.end();
  });

  new stream.PassThrough().pipe(p).end(data);
});

tap.test('records have correct source flags', function(t) {
  var p = new Parser();

  p.on('readable', p.read);
  p.on('record', function(r) {
    for (var key in r.source.flags.objectType) {
      if (r.source.flags.objectType.hasOwnProperty(key)) {
        var val = r.source.flags.objectType[key];
        if (key === 'player') t.ok(val, 'objectType should be player');
        else t.notOk(val, 'objectType should not be ' + key);
      }
    }

    var controllerType = r.source.flags.controllerType;
    t.ok(controllerType.player, 'controllerType should be player');
    t.notOk(controllerType.npc, 'controllerType should not be npc');

    var reactionType = r.source.flags.reactionType;
    t.ok(reactionType.friendly, 'reactionType should be friendly');
    t.notOk(reactionType.hostile, 'reactionType should not be hostile');
    t.notOk(reactionType.neutral, 'reactionType should not be neutral');

    for (var key in r.source.flags.affiliation) {
      if (r.source.flags.affiliation.hasOwnProperty(key)) {
        var val = r.source.flags.affiliation[key];
        if (key === 'raid') t.ok(val, 'affiliation should be raid');
        else t.notOk(val, 'affiliation should not be ' + key);
      }
    }

    for (var key in r.source.flags.special) {
      if (r.source.flags.special.hasOwnProperty(key)) {
        t.notOk(r.source.flags.special[key], 'special should not be ' + key);
      }
    }

    t.end();
  });

  new stream.PassThrough().pipe(p).end(data);
});

tap.test('records have correct source raid flags', function(t) {
  var p = new Parser();

  p.on('readable', p.read);
  p.on('record', function(r) {
    for (var key in r.source.raidFlags.raidTarget) {
      if (r.source.raidFlags.raidTarget.hasOwnProperty(key)) {
        t.notOk(r.source.raidFlags.raidTarget[key],
          'raidTarget should not be ' + key);
      }
    }

    var controllerType = r.source.flags.controllerType;
    t.ok(controllerType.player, 'controllerType should be player');
    t.notOk(controllerType.npc, 'controllerType should not be npc');

    var reactionType = r.source.flags.reactionType;
    t.ok(reactionType.friendly, 'reactionType should be friendly');
    t.notOk(reactionType.hostile, 'reactionType should not be hostile');
    t.notOk(reactionType.neutral, 'reactionType should not be neutral');
    t.end();

    for (var key in r.source.flags.affiliation) {
      if (r.source.flags.affiliation.hasOwnProperty(key)) {
        var val = r.source.flags.affiliation[key];
        if (key === 'raid') t.ok(val, 'affiliation should be raid');
        else t.notOk(val, 'affiliation should not be ' + key);
      }
    }

    for (var key in r.source.flags.special) {
      if (r.source.flags.special.hasOwnProperty(key)) {
        t.notOk(r.source.flags.special[key], 'special should not be ' + key);
      }
    }
  });

  new stream.PassThrough().pipe(p).end(data);
});
