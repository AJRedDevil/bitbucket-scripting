#!/usr/bin/env node --harmony
const co = require('co');
const prompt = require('co-prompt');
const program = require('commander');

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', "The user's password")
  .action(function(file) {
    co(function*() {
      const username = yield prompt('username: ');
      const password = yield prompt.password('password: ');
      console.log(`user: ${username} pass: ${password} file: ${file}`);
    });
  })
  .parse(process.argv);
