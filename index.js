#!/usr/bin/env node --harmony
const fs = require('fs');
const ProgressBar = require('progress');
const chalk = require('chalk');
const request = require('superagent');
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
      const fileSize = fs.statSync(file).size;
      const fileStream = fs.createReadStream(file);
      const barOpts = {
        width: 20,
        total: fileSize,
        clear: true,
      };
      const bar = new ProgressBar(' uploading [:bar] :percent :etas', barOpts);

      fileStream.on('data', function(chunk) {
        bar.tick(chunk.length);
      });

      request
        .post('https://api.bitbucket.org/2.0/snippets/')
        .auth(username, password)
        .attach('file', fileStream)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          if (!err && res.ok) {
            const link = res.body.links.html.href;
            console.log(chalk.bold.cyan('Snippet created: ') + link);
            process.exit(0);
          }
          let errorMessage;
          if (res && res.status === 401) {
            errorMessage = 'Authentication failed! Bad username/password?';
          } else if (err) {
            errorMessage = err;
          } else {
            errorMessage = res.text;
          }
          console.error(chalk.red(errorMessage));
          process.exit(1);
        });
    });
  })
  .parse(process.argv);
