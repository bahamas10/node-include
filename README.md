\#include `<header>`
====================

Include/parse C header (.h) files

Usage
-----

as a module

``` js
var include = require('include'),
    errno = include('/usr/include/sys/errno.h');
```

as a cli tool

    include /usr/include/sys/errno.h

Examples
--------

Include a header and print the results

``` js
var include = require('include'),
    data = include('/usr/include/sys/acct.h');
console.log(data);
```
yields
``` json
{
  "AFORK": 1,
  "ASU": 2,
  "AEXPND": 40,
  "ACCTF": 300
}
```

Include a header with the comments, and print the results

``` js
var include = require('include'),
    data = include('/usr/include/sys/acct.h', true);
console.log(data);
```
yields
``` json
{
  "_SYS_ACCT_H": {},
  "AFORK": {
    "value": 1,
    "comment": "/* has executed fork, but no exec */"
  },
  "ASU": {
    "value": 2,
    "comment": "/* used super-user privileges */"
  },
  "AEXPND": {
    "value": 40,
    "comment": "/* expanded acct structure */"
  },
  "ACCTF": {
    "value": 300,
    "comment": "/* record type: 00 = acct */"
  }
}
```

Functions
---------

### include(file, [comments])

Include a file, and return the object generated.  This will throw an error if the file
cannot be found.

set `comments` to true to parse comments (if present)

### include.async(file, [comments], cb(err, data))

The same as above, except read the file asynchronously

### include.parse(s)

Parse a header file given as a string

Command Line Tool
-----------------

Give `include` a header to have it parse it, and print the json to stdout

    ~ $ include /usr/include/sys/acct.h | json
    {
      "AFORK": 1,
      "ASU": 2,
      "AEXPND": 40,
      "ACCTF": 300
    }

Supply an optional `-c` argument to retain comments (if applicable)

    ~ $ include -c /usr/include/sys/acct.h | json
    {
      "_SYS_ACCT_H": {},
      "AFORK": {
        "value": 1,
        "comment": "/* has executed fork, but no exec */"
      },
      "ASU": {
        "value": 2,
        "comment": "/* used super-user privileges */"
      },
      "AEXPND": {
        "value": 40,
        "comment": "/* expanded acct structure */"
      },
      "ACCTF": {
        "value": 300,
        "comment": "/* record type: 00 = acct */"
      }
    }


Issues
------

- The module very blindly looks for `#define` at the start of a line to parse
- The module very blindly assumes anything to the right of the value of `define` is a comment
- Super dumb, assumes the values don't have spaces in them (really dumb right?)
- I have made a basic `find\_file` function for looking for files like the C preprocesser does,
  however this fails, because most files in `/usr/include`, include other files, and this module
  would have to follow all of the included files

Maybe this module should be native...

Install
------

Install locally to use as a Node module

    npm install include

Install globally to use the `include` command line tool

    npm install -g include

Tests
-----

    npm test

License
-------

MIT Licensed
