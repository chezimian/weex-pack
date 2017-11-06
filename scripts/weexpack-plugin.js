#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const create = require('../build/plugin/create');
const cli = require('../build/cli');
const publish = require('../build/publish/publish');
const install = require('../build/plugin/install')
const uninstall = require('../build/plugin/uninstall')
const login = require('../build/publish/login');
const inquirer = require('inquirer');

var cordova_lib = require('../lib'),
  cordova = cordova_lib.cordova;

var parseArgs = function () {
  let args = [];
  process.argv.forEach(function (arg, i) {
    if (arg != '[object Object]') { //fix commander’s bug
      args.push(arg);
      if (i == 1) {
        args.push('plugin');
      }
    }
  });
  return args;
}




var questions = [{
    name: 'email',
    type: 'input',
    message: 'Please enter your Market email account:'
  },
  {
    name: 'pwd',
    type: 'password',
    message: 'Please enter your Market Password:',
  }
];

var packagetype = [{
  type: 'list',
  name: 'id',
  message: 'Please select your component type?',
  choices: ['Basic', 'Layout', 'Feedback', 'Navigator', 'DataEntry', 'DataDisplay', 'Other'],
  filter: function (val) {
    var id = 0;
    switch (val) {
      case 'Basic' :
        id = 11;
        break;
      case 'Layout':
        id = 12;
        break; 
      case 'Feedback':
        id = 13;
        break;
      case 'Navigator':
        id = 14;
        break;
      case 'DataEntry':
        id = 15;
        break;
      case 'DataDisplay':
        id = 16;
        break;
      case 'Other':
        id = 17;
        break;
    }
    return id;
  }
}]

program
  .command('gettoken')
  .description('get market token')
  .action(function () {
    console.log(login.getToken())
  });
program
  .command('info')
  .description('get market info')
  .action(function () {
    console.log(login.getInfo())
  });

program
  .command('logout')
  .description('logout market')
  .action(function () {
    login.logout()
  });
program
  .command('login')
  .description('login market')
  .action(function () {
    inquirer.prompt(questions).then(function (answers) {
      login.login(answers.email, answers.pwd)
      // console.log(JSON.stringify(answers, null, '  '));
    });
  });

program
  .command('mysync')
  .description('show my sync list')
  .action(function () {
    login.mySync();
  });


program
  .command('addmember')
  .description('show this plugin group member')
  .action(function (email, id) {
    login.addGroupMember(email, id);
  });
program
  .command('members')
  .description('show this plugin group member')
  .action(function (id) {
    login.listGroupMember(id);
  });

program
  .command('delmember')
  .description('show this plugin delete member')
  .action(function (email, id) {
    login.delGroupMember(email, id);
  });

program
  .option('--ali', 'publish to alibaba internal market(only for alibaba internal network)')
  .command('sync')
  .description('sync plugin to market')
  .action(function () {
    inquirer.prompt(packagetype).then(function (answers) {
      login.sync(program.ali, answers.id)
    });
  });

program
  .command('create [plugin_name]')
  .description('create a empty plugin project')
  .action(function (pluginName) {
    if (pluginName.match(/^[$A-Z_][0-9A-Z_-]*$/i)) {
      create(pluginName, program.config)
    } else {
      console.log();
      console.log(`  ${chalk.red('Invalid plugin name:')} ${chalk.yellow(pluginName)}`);
      process.exit();
    }
  });

program
  .option('--ali', 'publish to alibaba internal market(only for alibaba internal network)')
  .option('--market', '')
  .command('publish')
  .description('publish current plugin')
  .action(function () {
    inquirer.prompt(packagetype).then(function (answers) {
      publish(program.ali, answers)
    });
  });

program
  .command('add [plugin_name]')
  .description('add a plugin into you project')
  .action(function (pluginName) {
    return install(pluginName, parseArgs());
  });


program
  .command('remove [plugin_name]')
  .description('remove a plugin into you project')
  .action(function (pluginName) {
    return uninstall(pluginName, parseArgs());
  });



program
  .command('link [plugin-path]')
  .description('link a plugin from local into you project')
  .action(function (pluginPath) {
    return cordova.raw["plugin"]("add", [pluginPath], {
      link: true
    });
  });

program
  .option('--market', '')
  .command('*')
  .description('setup specific plugin into your project')
  .action(function (pluginName) {
    let args = [];
    process.argv.forEach(function (arg, i) {
      if (arg != '[object Object]') { //fix commander’s bug
        args.push(arg);
        if (i == 1) {
          args.push('plugin');
        }
      }
    });
    cli(parseArgs());
  });
program.parse(process.argv);