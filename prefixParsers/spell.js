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

var util = require('../util');
var testFlag = util.testFlag;

module.exports = _spellParse;

function _spellParse(fields) {
  this.spellId = parseInt(fields[9]);
  this.spellName = util.stripQuotes(fields[10]);
  this.spellSchool = _parseSchoolFlags(fields[11]);
}

function _parseSchoolFlags(flags) {
  if (isNaN(flags)) return { raw: flags };

  var num = parseInt(flags);

  return {
    raw: flags,
    physical: testFlag(num, 0x1),
    holy: testFlag(num, 0x2),
    fire: testFlag(num, 0x4),
    nature: testFlag(num, 0x8),
    frost: testFlag(num, 0x10),
    shadow: testFlag(num, 0x20),
    arcane: testFlag(num, 0x40),
    holystrike: testFlag(num, 0x3),
    flamestrike: testFlag(num, 0x5),
    holyfire: testFlag(num, 0x6),
    stormstrike: testFlag(num, 0x9),
    holystorm: testFlag(num, 0xA),
    firestorm: testFlag(num, 0xC),
    froststrike: testFlag(num, 0x11),
    holyfrost: testFlag(num, 0x12),
    frostfire: testFlag(num, 0x14),
    froststorm: testFlag(num, 0x18),
    shadowstrike: testFlag(num, 0x21),
    shadowlight: testFlag(num, 0x22),
    twilight: testFlag(num, 0x22),
    shadowflame: testFlag(num, 0x24),
    shadowstorm: testFlag(num, 0x28),
    plague: testFlag(num, 0x28),
    shadowfrost: testFlag(num, 0x30),
    spellstrike: testFlag(num, 0x41),
    divine: testFlag(num, 0x42),
    spellfire: testFlag(num, 0x44),
    spellstorm: testFlag(num, 0x48),
    spellfrost: testFlag(num, 0x50),
    spellshadow: testFlag(num, 0x60),
    elemental: testFlag(num, 0x1C),
    chromatic: testFlag(num, 0x7C),
    magic: testFlag(num, 0x7E),
    chaos: testFlag(num, 0x7F)
  };
}
