'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-graphql-server:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      '.circleci/config.yml',
      '.vscode/snippets/javascript.json',
      '.vscode/launch.json',
      '.vscode/settings.json',
      'migrations/201612010000_initial.js',
      'src/routes/account.js',
      'src/schema/user/UserType.js',
      'src/schema/index.js',
      'src/schema/node.js',
      'src/app.js',
      'src/db.js',
      'src/passport.js',
      'src/redis.js',
      'src/server.js',
      'tools/.eslintrc',
      'tools/build.js',
      'tools/db.js',
      'tools/publish.js',
      'tools/README.md',
      'tools/run.js',
      'tools/task.js',
      '.babelrc',
      '.editorconfig',
      '.eslintrc.js',
      '.flowconfig',
      '.gitattributes',
      '.gitignore',
      'docker-compose.yml',
      'Dockerfile',
      'LICENSE.txt',
      'package.json',
      'README.md',
      'postgres-initdb.sh'
    ]);
  });
});
