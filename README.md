# uncommentify

A through stream that removes comments with [falafel](https://npmjs.org/package/falafel).

## example

```js
// Strip banner comments from js
var strip = require('uncommentify')();
var fs = require('fs');
fs.createReadStream('index.js')
  .pipe(strip)
  .pipe(fs.createWriteStream('no-banner-comments.js'));
```

```js
// Strip ALL comments from js
var strip = require('uncommentify')({
  all: true,
});
var fs = require('fs');
fs.createReadStream('index.js')
  .pipe(strip)
  .pipe(fs.createWriteStream('no-comments.js'));
```

### Example Banner Comments
By default, uncommentify will just remove the first found banner comment.

```js
/* I am 
a block
 * banner comment */
```

```js
// I am 
// a line
// banner comment
```

```js
/*! I will not be removed even though Im a banner comment unless you force me. */
```

## options

```js
var strip = require('uncommentify')({
  all: false,
  force: false,
  line: true,
  block: true,
});
```

### `all`
Removes all comments.

### `force`
Will remove comments that begin with `/*!` or `//!` which are not normally removed.

### `line`
Set to `false` to not remove `// line` comments.

### `block`
Set to `false` to not remove `/* block */` comments.

## releases

* 0.1.0 - initial release

## license

MIT
