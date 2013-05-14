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

module.exports = _damageParse;

function _damageParse(fields) {
  var offset = _determineOffset.call(this);
  this.amount = parseInt(fields[0 + offset]);
  this.overkill = parseInt(fields[1 + offset]);
  this.school = util.parseSchoolFlags(fields[2 + offset]);
  this.resisted = parseInt(fields[3 + offset]);
  this.blocked = parseInt(fields[4 + offset]);
  this.absorbed = parseInt(fields[5 + offset]);
  this.critical = fields[6 + offset] === '1';
  this.glancing = fields[7 + offset] === '1';
  this.crushing = fields[8 + offset] === '1';
}

function _determineOffset() {
  switch (this.prefix) {
    case 'SWING':
      return 9;
    case 'ENVIRONMENTAL':
      return 16;
    case 'RANGE':
    case 'SPELL':
      return 18;
    case 'SPELL_PERIODIC':
      return 12;
    default:
      return 0;
  }
}
