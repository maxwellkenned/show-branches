const { app } = require('electron');
const { createTrayMenu } = require('./app/menu');

app.on('ready', createTrayMenu);
