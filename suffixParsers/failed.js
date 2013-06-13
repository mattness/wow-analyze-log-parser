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

module.exports = _failedParse;

var util = require('../util');

var failureTypes = {
  "A more powerful spell is already active": 'alreadyActive',
  "Another action is in progress": 'inProgress',
  "Can only use outside": 'outsideRequired',
  "Can only use while swimming": 'swimmingRequired',
  "Can't do that while asleep": 'asleep',
  "Can't do that while charmed": 'charmed',
  "Can't do that while confused": 'confused',
  "Can't do that while fleeing": 'fleeing',
  "Can't do that while horrified": 'horrified',
  "Can't do that while incapacitated": 'incapacitated',
  "Can't do that while moving": 'moving',
  "Can't do that while silenced": 'silenced',
  "Can't do that while stunned": 'stunned',
  "Interrupted": 'interrupted',
  "Invalid target": 'invalidTarget',
  "Item is not ready yet": 'itemNotReady',
  "Must be in Bear Form, Dire Bear Form": 'bearFormRequired',
  "Must have a Ranged Weapon equipped": 'rangedWeaponRequired',
  "No path available": 'pathRequired',
  "No target": 'targetRequired',
  "Not enough energy": 'ooe',
  "Not enough mana": 'oom',
  "Not enough rage": 'oor',
  "Not yet recovered": 'recovering',
  "Nothing to dispel": 'nothingToDispel',
  "Out of range": 'outOfRange',
  "Target is friendly": 'friendlyTarget',
  "Target is hostile": 'hostileTarget',
  "Target needs to be in front of you.": 'targetInFrontRequired',
  "Target not in line of sight": 'lineOfSightRequired',
  "Target too close": 'targetTooClose',
  "You are dead": 'dead',
  "You are in combat": 'combat',
  "You are in shapeshift form": 'shapeshifted',
  "You are unable to move": 'immovable',
  "You can't do that yet": 'cooldown',
  "You must be behind your target.": 'behindTargetRequired',
  "Your target is dead": 'targetDead',
};

function _failedParse(fields, offset) {
  var failureType = {};
  for (var key in failureTypes) {
    if (failureTypes.hasOwnProperty(key)) {
      failureType[failureTypes[key]] =
        util.stripQuotes(fields[offset]) === key;
    }
  }

  this.failureType = failureType;

  return ++offset;
}
