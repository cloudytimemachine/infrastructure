#!/usr/bin/env node
'use strict';
var execSync = require('child_process').execSync;
var pj = require('path').join;
const readdir  = require('fs').readdirSync;

var defaultApps = [
  'api',
  'frontend',
  'worker-screenshot',
  'cloudytimemachine.github.io'
];

var appsRepoOrg = 'cloudytimemachine';

var installPath = pj(__dirname, '../../');
var appsDir = installPath;


const argv        = process.argv;

// Install shelljs if not exists
function init(callback) {
  try {
    require('shelljs/global');
    callback();
    return;

  } catch (e) {}

  console.log('-- Pre-install dependencies');

  try {
    execSync('npm install shelljs', { stdio: 'inherit', cwd: installPath });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  process.nextTick(() => {
    // That should be done in callback, to not fail in node 6
    require('shelljs/global');
    callback();
  });
}

// `git pull` in all apps repos.
// if app not exists or .git subfolder missed - reclone, relink & npm install
//
function do_pull(readOnly) {
  let freshApps = []; // New apps, installed on this call

  if (!test('-d', appsDir)) mkdir(appsDir);

  // pull/clone default apps
  defaultApps.forEach(app => {
    const appDir = pj(appsDir, app);

    const repo   = readOnly ?
      `https://github.com/${appsRepoOrg}/${app}.git`
    :
      `git@github.com:${appsRepoOrg}/${app}.git`;


    if (test('-d', appDir) && !test('-d', pj(appDir, '.git'))) rm('-rf', appDir);

    if (!test('-d', appDir)) mkdir(appDir);

    try {
      if (test('-d', pj(appDir, '.git'))) {
        console.log(`-- Updating '${app}'`);
        execSync('git pull', { stdio: 'inherit', cwd: appDir });
      } else {
        console.log(`-- Cloning '${app}', ${repo}`);
        execSync(`git clone ${repo}`, { stdio: 'inherit', cwd: appsDir });
        freshApps.push(app);

      }
    } catch (e) { process.exit(1); }
  });

  // pull additional apps
  readdir(appsDir)
    .filter(name => defaultApps.indexOf(name) === -1)
    .filter(name => test('-d', pj(appsDir, name, '.git')))
    .forEach(name => {
      try {
        console.log(`-- Updating '${name}'`);
        execSync('git pull', { stdio: 'inherit', cwd: pj(appsDir, name) });
      } catch (e) { process.exit(1); }
    });
}

let task = {};

task.pull = function () {
  do_pull();
};


task['pull-ro'] = function () {
  do_pull(true);
};

let command = argv[2];

if (!task.hasOwnProperty(command)) {
  console.log(`Help: run [${Object.keys(task).join('|')}]`);
  return;
}

init(() => task[command]());
