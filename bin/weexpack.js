#!/usr/bin/env node
'use strict';

var program = require('commander');
var chalk = require('chalk');
var market = require('../build/publish/market');
var cli = require('../build/cli');
var d = domain.create();

program.version(require('../package').version).usage('<command> [options]')
// .command('init [name]', 'initialize a standard weex project')
.command('create [name]', 'initialize a standard weex project').command('platform [command]', 'command for add or remove a  platform project').command('run [platform]', 'run weex app on the specific platform').command('build [platform]', 'build weex app generator package(apk or ipa)').command('plugin [command]', 'command for add,create,login,publish weex plugins').command('weexplugin [command]', 'create a project that is a manager of plugin');

program.parse(process.argv);

if (program.args.length < 1) {
  program.help();
  process.exit();
}

if (program.args.length >= 1) {
  var isSupport = false;
  var list = ["create", "platform", "run", "build", "plugin", "weexplugin", "market"];
  // var list = ["create", "platform","run", "build"]
  for (var i = 0; i < list.length; i++) {
    if (program.args[0] == list[i]) {
      isSupport = true;
      break;
    }
  }
  if (!isSupport) {
    console.log("  error: unknown command '" + program.args[0] + "'");
    process.exit();
  }
}