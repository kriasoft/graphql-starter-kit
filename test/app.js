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
      'scripts/.eslintrc',
      'scripts/clean.js',
      'scripts/build.js',
      'scripts/start.js',
      'src/types/Viewer.js',
      'src/utils/task.js',
      'src/app.js',
      'src/schema.js',
      'src/server.js',
      'test/.eslintrc',
      'test/unit/db.spec.js',
      'test/unit/types.Viewer.spec.js',
      '.editorconfig',
      '.env.example',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'LICENSE.txt',
      'package.json',
      'README.md'
    ]);
  });
});
