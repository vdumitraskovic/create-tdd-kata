#!/usr/bin/env node

const path = require('path');
const os = require('os');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const sade = require('sade');
const prog = sade('create-tdd-kata [name]', true);

prog
  .version('0.1.0')
  .describe('Create TDD kata')
  .example('my-kata')
  .action((name) => {
    const root = path.resolve(name);
    const appName = path.basename(root);

    const template = path.join(process.env, '../template');
    fs.ensureDirSync(root);
    try {
      fs.copySync(template, root);
      fs.renameSync(path.resolve(root, 'gitignore'), path.resolve(root, '.gitignore'));
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
    const packageJson = require(path.join(process.env, '../template', 'package.json'));
    packageJson.name = appName;
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);
    process.chdir(root);
    execSync('npm install');
  })
  .parse(process.argv);
