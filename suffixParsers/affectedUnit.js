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

module.exports = _affectedUnit;

var validEvents = [
  'ENVIRONMENTAL_DAMAGE', 'RANGE_DAMAGE', 'SPELL_AURA_APPLIED',
  'SPELL_AURA_APPLIED_DOSE', 'SPELL_AURA_BROKEN_SPELL', 'SPELL_AURA_REFRESH',
  'SPELL_AURA_REMOVED', 'SPELL_AURA_REMOVED_DOSE', 'SPELL_CAST_START',
  'SPELL_CAST_SUCCESS', 'SPELL_DAMAGE', 'SPELL_DISPEL', 'SPELL_ENERGIZE',
  'SPELL_HEAL', 'SPELL_INTERRUPT', 'SPELL_MISSED', 'SPELL_PERIODIC_ENERGIZE',
  'SPELL_STOLEN'
];

function _affectedUnit(fields, offset) {
  if (!_shouldParse.call(this)) return offset;

  this.affectedUnit = {
    id: fields[offset],
    healthAfter: parseInt(fields[1 + offset]),
    // TODO (mattness): fields[2 + offset]
    // TODO (mattness): fields[3 + offset]
    powerType: parseInt(fields[4 + offset]),
    powerAfter: parseInt(fields[5 + offset])
  }

  return offset + 6;
}

function _shouldParse() {
  return validEvents.indexOf(this.event) !== -1;
}
