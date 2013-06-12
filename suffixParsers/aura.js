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

module.exports = _auraParse;

var util = require('../util');

function _auraParse(fields, offset) {
  offset = _parseBroken.call(this, fields, offset);
  var isBuff = fields[offset++] === 'BUFF';

  this.auraType = {
    buff: isBuff,
    debuff: !isBuff
  };

  if (offset <= fields.length) {
    this.amount = parseInt(fields[offset++]);
  }

  return offset;
}

function _parseBroken(fields, offset) {
  if (this.suffix === 'AURA_BROKEN_SPELL') {
    this.brokenSpellId = parseInt(fields[offset++]);
    this.brokenSpellName = util.stripQuotes(fields[offset++]);
    this.brokenSpellSchool = util.parseSchoolFlags(fields[offset++]);
  }

  return offset;
}
