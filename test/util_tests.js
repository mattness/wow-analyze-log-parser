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
var util = require('../util');

tap.test('stripQuotes strips a single leading quote', function(t) {
  t.equal('asdf', util.stripQuotes('"asdf'));
  t.equal('"asdf', util.stripQuotes('""asdf'));
  t.end();
});

tap.test('stripQuotes strips a single trailing quote', function(t) {
  t.equal('asdf', util.stripQuotes('asdf"'));
  t.equal('asdf"', util.stripQuotes('asdf""'));
  t.end();
});

tap.test('stripQuotes does not strip embedded quotes', function(t) {
  t.equal('as"d"f', util.stripQuotes('as"d"f'));
  t.equal('as"df', util.stripQuotes('as"df'));
  t.end();
});

tap.test('stripQuotes is a no-op for non-string inputs', function(t) {
  var obj = {};
  t.equal(9, util.stripQuotes(9));
  t.equal(undefined, util.stripQuotes(undefined));
  t.equal(null, util.stripQuotes(null));
  t.equal(obj, util.stripQuotes(obj));
  t.end();
});

tap.test('testFlag returns false for non-numerics', function(t) {
  t.notOk(util.testFlag('string', 0x1));
  t.notOk(util.testFlag(null, 0x1));
  t.notOk(util.testFlag(undefined, 0x1));
  t.notOk(util.testFlag({}, 0x1));
  t.notOk(util.testFlag(123, 'string'));
  t.notOk(util.testFlag(123, null));
  t.notOk(util.testFlag(123, undefined));
  t.notOk(util.testFlag(123, {}));
  t.end();
});

tap.test('testFlag returns true when flag is set', function(t) {
  t.ok(util.testFlag(3, 0x2));
  t.ok(util.testFlag('3', 0x2));
  t.end();
});

tap.test('testFlag returns false when flag is not set', function(t) {
  t.notOk(util.testFlag(5, 0x2));
  t.notOk(util.testFlag('5', 0x2));
  t.end();
});

tap.test('parsePowerType returns only raw for non-numerics', function(t) {
  t.similar(util.parsePowerType('asdf'), { raw: 'asdf' });
  t.end();
});

tap.test('parsePowerType handles valid values', function(t) {
  t.ok(util.parsePowerType('1').rage);
  t.ok(util.parsePowerType(1).rage);
  t.end();
});

tap.test('parsePowerType ignores invalid values', function(t) {
  var result = util.parsePowerType(4);
  t.notOk(result.mana);
  t.notOk(result.rage);
  t.notOk(result.focus);
  t.notOk(result.energy);
  t.notOk(result.runes);
  t.notOk(result.runicPower);
  t.notOk(result.holyPower);
  t.equal(result.raw, 4);

  var result2 = util.parsePowerType('4');
  t.notOk(result2.mana);
  t.notOk(result2.rage);
  t.notOk(result2.focus);
  t.notOk(result2.energy);
  t.notOk(result2.runes);
  t.notOk(result2.runicPower);
  t.notOk(result2.holyPower);
  t.equal(result2.raw, 4);
  t.end();
});
