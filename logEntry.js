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

module.exports = {
  create: createLogEntry
};

var eventRegex = /^(\d{1,2})\/(\d{1,2})\s(\d+):(\d+):(\d+)\.(\d+)\s{2}(\w+)$/;
var util = require('./util');

// Prefixes and suffixes are semi-sorted so that the most common events are
// early in the array, to minimize iterations when searching.  It's a micro-
// optimization, for sure, but it's easy so we might as well do it.
var eventPrefixes = [
  'SPELL',
  'SPELL_PERIODIC',
  'SPELL_BUILDING',
  'SWING',
  'RANGE',
  'ENVIRONMENTAL',
  'UNIT_DIED',
  'UNIT_DESTROYED',
  'PARTY_KILL'
];

var eventSuffixes = [
  'CAST_START',
  'CAST_SUCCESS',
  'CAST_FAILED',
  'DURABILITY_DAMAGE',
  'DAMAGE',
  'HEAL',
  'AURA_APPLIED',
  'AURA_REMOVED',
  'MISSED',
  'ENERGIZE',
  'INTERRUPT',
  'DISPEL',
  'DISPEL_FAILED',
  'EXTRA_ATTACKS',
  'AURA_APPLIED_DOSE',
  'AURA_REMOVED_DOSE',
  'AURA_REFRESH',
  'AURA_BROKEN',
  'AURA_BROKEN_SPELL',
  'INSTAKILL',
  'CREATE',
  'DRAIN',
  'LEECH',
  'STOLEN',
  'DURABILITY_DAMAGE_ALL',
  'SUMMON',
  'RESURRECT'
];

function createLogEntry(fields) {
  var prefixParse = function() {};
  var suffixParse = function() {};
  var logEntry = {};

  _baseParse.call(logEntry, fields);

  // TODO (mattness): Map prefix and suffix to the appropriate parser fn
  prefixParse.call(logEntry, fields);
  suffixParse.call(logEntry, fields);

  return logEntry;
};

function _baseParse(fields) {
  // 4/17 19:37:22.434  SPELL_AURA_APPLIED,0x0700000003770840,"Robmy",0x514,0x0,0x0700000003770840,"Robmy",0x514,0x0,34477,"Misdirection",0x1,0x0700000003770840,467815,18836,183,2,100,BUFF
  this.rawData = fields.join(',');
  _parseEvent.call(this, fields[0]);

  this.source = {
    id: fields[1],
    name: util.stripQuotes(fields[2]),
    flags: _parseUnitFlags(fields[3]),
    raidFlags: _parseRaidFlags(fields[4])
  };

  this.destination = {
    id: fields[5],
    name: util.stripQuotes(fields[6]),
    flags: _parseUnitFlags(fields[7]),
    raidFlags: _parseRaidFlags(fields[8])
  };
}

function _parseEvent(eventStr) {
  var grps = eventRegex.exec(eventStr);
  var now = new Date();
  this.timestamp = new Date(now.getFullYear(), grps[1] - 1, grps[2], grps[3],
    grps[4], grps[5], grps[6]);

  if (now < this.timestamp) this.timestamp.setFullYear(now.getFullYear() - 1);

  this.event = grps[7];
  this.eventPrefix = _getPrefix(this.event);
  this.eventSuffix = _getSuffix(this.event);
}

function _getPrefix(eventStr) {
  var specials = [
    'DAMAGE_SHIELD',
    'DAMAGE_SHIELD_MISSED',
    'DAMAGE_SPLIT'
  ];

  // If the eventStr matches one of the specials, we need to map it
  if (specials.indexOf(eventStr) !== -1) return 'SPELL';

  // Otherwise, iterate the collection of prefixes and find ours
  for (var i = 0; i < eventPrefixes.length; i++) {
    if (_startsWith.call(eventStr, eventPrefixes[i])) return eventPrefixes[i];
  }

  return undefined;
}

function _getSuffix(eventStr) {
  var specials = [
    'DAMAGE_SHIELD',
    'DAMAGE_SHIELD_MISSED',
    'DAMAGE_SPLIT'
  ];

  // If the eventStr matches one of the specials, we need to map it
  if (specials.indexOf(eventStr) !== -1) {
    if ('DAMAGE_SHIELD_MISSED' === eventStr) return 'MISSED';
    else return 'DAMAGE';
  }

  // Otherwise, iterate the collection of suffixes and find ours
  for (var i = 0; i < eventSuffixes.length; i++) {
    if (_endsWith.call(eventStr, eventSuffixes[i])) return eventSuffixes[i];
  }

  return undefined;
}

function _parseUnitFlags(flags) {
  if (isNaN(flags)) return { raw: flags };

  var num = parseInt(flags);

  return parsed = {
    raw: flags,
    objectType: {
      object: util.testFlag(num, 0x4000),
      guardian: util.testFlag(num, 0x2000),
      pet: util.testFlag(num, 0x1000),
      npc: util.testFlag(num, 0x0800),
      player: util.testFlag(num, 0x0400),
    },
    controllerType: {
      npc: util.testFlag(num, 0x200),
      player: util.testFlag(num, 0x100)
    },
    reactionType: {
      hostile: util.testFlag(num, 0x40),
      neutral: util.testFlag(num, 0x20),
      friendly: util.testFlag(num, 0x10)
    },
    affiliation: {
      outsider: util.testFlag(num, 0x8),
      raid: util.testFlag(num, 0x4),
      party: util.testFlag(num, 0x2),
      mine: util.testFlag(num, 0x1)
    },
    special: {
      none: util.testFlag(num, 0x80000000),
      mainAssist: util.testFlag(num, 0x00080000),
      mainTank: util.testFlag(num, 0x00040000),
      focus: util.testFlag(num, 0x00020000),
      target: util.testFlag(num, 0x00010000)
    }
  };
}

function _parseRaidFlags(flags) {
  if (isNaN(flags)) return { raw: flags };

  var num = parseInt(flags);

  var parsed = {
    raw: flags,
    raidTarget: {
      yellowStar: util.testFlag(num, 0x01),
      orangeCircle: util.testFlag(num, 0x02),
      purpleDiamond: util.testFlag(num, 0x04),
      greenTriangle: util.testFlag(num, 0x08),
      paleBlueMoon: util.testFlag(num, 0x10),
      blueSquare: util.testFlag(num, 0x20),
      redCross: util.testFlag(num, 0x40),
      whiteSkull: util.testFlag(num, 0x80)
    }
  };
  return parsed;
}

// --------------------------------------------------------------------
// string helpers                                                    --
// --------------------------------------------------------------------
function _startsWith(searchString, position) {
  position = position || 0;
  return this.indexOf(searchString, position) === position;
}

function _endsWith(searchString, position) {
  position = position || this.length;
  position = position - searchString.length;
  return this.lastIndexOf(searchString) === position;
}