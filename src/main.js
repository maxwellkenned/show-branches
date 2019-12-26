require('dotenv').config({path: __dirname + '/../.env'})

const { app } = require('electron');
const { createTrayMenu } = require('./app/menu');
const AutoLaunch = require('auto-launch');

const showBranches = new AutoLaunch({ name: 'show-branches' });

showBranches.enable();
app.on('ready', createTrayMenu);
