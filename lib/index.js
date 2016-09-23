#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// add all the versioned commands to the commander data structure
for (const _ref of _commands2.default) {
  const version = _ref.version;
  const commands = _ref.commands;

  for (const _ref2 of commands) {
    const cmd = _ref2.cmd;
    const action = _ref2.action;
    var _ref2$description = _ref2.description;
    const description = _ref2$description === undefined ? '' : _ref2$description;

    _commander2.default.version(version).command(cmd).description(description).action(action);
  }
}

// if there is no command, show help
if (process.argv.slice(2).length === 0) {
  console.log('\n  Welcome to ReCodEx');
  console.log('  ------------------');
  _commander2.default.outputHelp();
}

// if a wrong command is passed, show help
_commander2.default.version('1.0.0').command('*').action(cmd => {
  console.log(`\n  Unknown command '${ cmd }'`);
  _commander2.default.outputHelp();
});

_commander2.default.parse(process.argv);