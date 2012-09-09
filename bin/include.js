#!/usr/bin/env node
var include = require('../'),
    comments = false,
    file = process.argv[2],
    data;

if (file === '-c') {
  comments = true;
  file = process.argv[3];
}

if (!file) return console.error('Usage: include [-c] <header>');

data = include(file, comments);
console.log(JSON.stringify(data, null, 2));
