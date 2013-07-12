'use strict';

var test = require('tape');
var path = require('path');
var fs = require('fs');
var createStrip = require('../');

// Helper for testing
function teststrip(file, opts, fn) {
  if (typeof opts === 'function') { fn = opts; opts = {}; }
  var strip = createStrip(opts);
  fs.createReadStream(path.join(__dirname, 'fixtures', file)).pipe(strip);
  var result = '';
  strip.on('data', function(buf) { result += buf; });
  strip.on('end', function() { fn(result); });
}

test('first block comment', function(t) {
  t.plan(4);
  teststrip('block.js', function(result) {
    t.ok(result.indexOf('SAMPLE') === -1);
    t.ok(result.indexOf('/* THIS') === -1);
    t.ok(result.indexOf('// Comment') !== -1);
    t.ok(result.indexOf('/* Comment */') !== -1);
  });
});

test('first line comments', function(t) {
  t.plan(5);
  teststrip('line.js', function(result) {
    t.ok(result.indexOf('// This is') === -1);
    t.ok(result.indexOf('// A sample') === -1);
    t.ok(result.indexOf('// Banner') === -1);
    t.ok(result.indexOf('// But this is not') !== -1);
    t.ok(result.indexOf('/* And neither') !== -1);
  });
});

test('all comments', function(t) {
  t.plan(3);
  teststrip('block.js', {all:true}, function(result) {
    t.ok(result.indexOf('//') === -1);
    t.ok(result.indexOf('/*') === -1);
    t.ok(result.indexOf('*/') === -1);
  });
});

test('dont remove /*! comments', function(t) {
  t.plan(1);
  teststrip('force.js', function(result) {
    t.ok(result.indexOf('/*!') !== -1);
  });
});

test('force remove /*! comments', function(t) {
  t.plan(1);
  teststrip('force.js', {force:true}, function(result) {
    t.ok(result.indexOf('/*!') === -1);
  });
});

test('dont remove line comments', function(t) {
  t.plan(2);
  teststrip('line.js', {all:true,line:false}, function(result) {
    t.ok(result.indexOf('//') !== -1);
    t.ok(result.indexOf('/*') === -1);
  });
});

test('dont remove block comments', function(t) {
  t.plan(2);
  teststrip('block.js', {all:true,block:false}, function(result) {
    t.ok(result.indexOf('/*') !== -1);
    t.ok(result.indexOf('//') === -1);
  });
});
