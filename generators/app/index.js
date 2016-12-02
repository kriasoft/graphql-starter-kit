'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var glob = require('glob');

module.exports = yeoman.Base.extend({
  greeting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.red('GraphQL Starter Kit') + ' generator!'
    ));
  },

  writing: function () {
    var files = glob.sync('**/*', {
      cwd: this.sourceRoot(),
      dot: true,
      nodir: true,
      ignore: [
        '**/.git',
        '**/.gitignore',
        '**/.npmignore',
        '**/CONTRIBUTING.md'
      ]});
    for (var i = 0; i < files.length; i++) {
      this.copy(files[i], files[i]);
    }
    // this.copy(
    //   this.templatePath('**/*'),
    //   this.destinationRoot(),
    //   {
    //     globOptions: {
    //       dot: true,
    //       ignore: [
    //         '**/.git',
    //         '**/.gitignore',
    //         '**/.npmignore',
    //         '**/CONTRIBUTING.md'
    //       ]
    //     }
    //   }
    // );
    this.write(
      this.destinationPath('.gitignore'),
      '# Include your project-specific ignores in this file\n' +
      '# Read about how to use .gitignore: https://help.github.com/articles/ignoring-files\n\n' +
      'build\n' +
      'node_modules\n' +
      'npm-debug.log\n' +
      '.env\n'
    );
  },

  install: function () {
    this.installDependencies();
  }
});
