#!/usr/bin/env node

import program from 'commander';
import versionedCommands from './commands';

// add all the versioned commands to the commander data structure
for (const { version, commands } of versionedCommands) {
  for (const { cmd, action, description = '' } of commands) {
    program
      .version(version)
      .command(cmd)
      .description(description)
      .action(action);
  }
}

// if there is no command, show help
if (process.argv.slice(2).length === 0) {
  console.log('\n  Welcome to ReCodEx');
  console.log('  ------------------');
  program.outputHelp();
}

// if a wrong command is passed, show help
program
  .version('1.0.0')
  .command('*')
  .action((cmd) => {
    console.log(`\n  Unknown command '${cmd}'`);
    program.outputHelp();
  });

program.parse(process.argv);
