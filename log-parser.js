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

module.exports = Parser;

var Transform = require('stream').Transform;
var util = require('util');
util.inherits(Parser, Transform);
Parser.prototype._transform = _transform;
Parser.prototype._flush = _flush;


function _transform(chunk, encoding, done) {
  var data = this.buffer + chunk.toString(encoding || 'utf8');
  var index, offset = 0;

  do {
    if ((index = data.indexOf('\n', offset)) !== -1) {
      _parse.call(this, data.slice(offset, index).trim());
      offset = index + 1;
      this.buffer = '';
    } else if (offset < data.length) {
      this.buffer += data.slice(offset);
    }
  } while (index !== -1);

  this.push(chunk);
  done();
}

function _flush(done) {
  if (this.buffer.length > 0) {
    _parse.call(this, this.buffer);
  }

  done();
}

function _parse(record) {
  this.emit('record', record);
}

function Parser() {
  if (!(this instanceof Parser))
    return new Parser();

  Transform.call(this);
  this.buffer = '';
  return this;
}
