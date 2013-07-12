var falafel = require('falafel');
var through = require('through');

module.exports = function(opts) {
  var src = '';
  return through(function write(buf) {
    src += buf;
  }, function end() {
    this.queue(uncommentify(src, opts));
    this.queue(null);
  });
};

var uncommentify = module.exports.sync = function(src, opts) {
  opts = opts || {};
  opts.all = opts.all === true;
  opts.line = opts.line !== false;
  opts.block = opts.block !== false;
  opts.force = opts.force === true;
  var first = false;
  var lastRange = 0;
  return String(falafel(src, {comment:true}, function(node) {
    if (!isComment(node)) return;

    // Dont remove comments of certain type
    if (opts.line === false && node.type === 'Line') return;
    if (opts.block === false && node.type === 'Block') return;

    // Dont remove /*! unless force is set
    if (opts.force === false) {
      var src = String(node.source()).replace(/\s/g, '');
      if (src.slice(0, 3) === '/*!' || src.slice(0, 3) === '//!') return;
    }

    // Remove all comments
    if (opts.all === true) {
      node.update('');
      return;
    }

    if (first === false) {
      // If a block comment
      if (node.type === 'Block') first = true;

      // If a block of line comments
      if (node.type === 'Line') {
        if (node.range[0] > (lastRange + 1)) {
          first = true;
          return;
        }
        lastRange = node.range[1];
      }

      // Remove comment
      node.update('');
    }
  }));
};

function isComment(node) {
  return (node.type === 'Block' || node.type === 'Line');
}