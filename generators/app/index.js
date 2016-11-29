'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  greeting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.red('GraphQL Starter Kit') + ' generator!'
    ));
  },

  writing: function () {
    this.copy(
      this.templatePath('**/*'),
      this.destinationRoot(),
      {
        globOptions: {
          dot: true,
          ignore: [
            '**/.git',
            '**/.gitignore',
            '**/.npmignore',
            '**/CONTRIBUTING.md'
          ]
        }
      }
    );
    this.write(
      '.gitignore',
      '# Include your project-specific ignores in this file\n' +
      '# Read about how to use .gitignore: https://help.github.com/articles/ignoring-files\n\n' +
      'build\n' +
      'node_modules\n' +
      'npm-debug.log\n'
    );
  },

  install: function () {
    this.installDependencies();
  }
});
