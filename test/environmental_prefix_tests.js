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
var parser = require('../prefixParsers/environmental');
var entry = require('../logEntry');

var fields = [
  '4/17 20:35:21.871  ENVIRONMENTAL_DAMAGE,0x0000000000000000,nil,',
  '0x80000000,0x80000000,0x0700000005082392,"Rhisen",0x512,0x0,',
  '0x0700000005082392,479914,147,29847,0,300000,Falling,74339,0,1,0,0,0,nil,',
  'nil,nil'
].join('').split(',');

tap.test('', function(t) {
  var logEntry = { event: 'ENVIRONMENTAL_DAMAGE' };
  parser.call(logEntry, fields, entry.baseFieldsLength);
  t.equal(logEntry.environmentalType, 'Falling');
  t.end();
});
