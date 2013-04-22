# log-parser

Combat log parser for World of Warcraft (5.2 - Mists of Pandaria)

## Goals of the library

1. Be able to parse a stream of combat log data (possibly in real-time),
   split it into records and raise events with an object containing the
   parsed record.
2. Implement node's streams2 API
3. Be testable and extensible.  Blizzard makes no guarantees about
   compatibility from release to release, so we need to be able to be
   confident the parsing is correct and flexible for future releases.

## Possible API story

```
var parser = require('log-parser');
var fs = require('fs');

parser.on('data', function(record) {
  console.log(data.event);
  console.log(data.source);
  console.log(data.destination);
  console.log(data.amount);
  // etc.
});

fs.createReadStream('/path/to/WoWCombatLog.txt', { flags: 'r' }).pipe(parser);
```
