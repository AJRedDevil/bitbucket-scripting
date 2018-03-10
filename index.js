#!/usr/bin/env node
const program = require('commander');

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', "The user's password")
  .action(function(file) {
    console.log(
      `user: ${program.username} pass: ${program.password} file: ${file}`
    );
  })
  .parse(process.argv);
