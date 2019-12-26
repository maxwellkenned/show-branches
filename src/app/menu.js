const { app, Menu, Tray, shell } = require('electron');
const fs = require('fs');
const { resolve } = require('path');
const { mapPaths } = require('./mapPaths');

const existPathVox = fs.existsSync(process.env.BASE_PATH);
let appIcon = null;
let contextBranchs = [];

const getItensMenu = async _ => {
  if (existPathVox) {
    const files = fs
      .readdirSync(process.env.BASE_PATH)
      .filter(
        file =>
          file.charAt(0) !== '.' &&
          fs.lstatSync(process.env.BASE_PATH + file).isDirectory &&
          fs.existsSync(process.env.BASE_PATH + file + '/.git')
      );

    return (contextMenu = await mapPaths(files));
  }
};

async function getContextMenu() {
  contextBranchs = await getItensMenu();
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'PROJETO   |   BRANCH'.padStart(29, ' '),
      enabled: false
    },
    { label: '', type: 'separator' },
    ...contextBranchs,
    { label: '', type: 'separator' },
    {
      label: 'About',
      icon: `${resolve(
        __dirname,
        '..',
        '..',
        'resources',
        'images',
        'about.png'
      )}`,
      click: () => {
        shell.openExternal('https://github.com/maxwellkenned/show-branches');
      }
    },
    { label: '', type: 'separator' },
    {
      label: 'Close',
      role: 'quit',
      icon: `${resolve(
        __dirname,
        '..',
        '..',
        'resources',
        'images',
        'quit.png'
      )}`,
      click: () => {
        app.exit();
      }
    }
  ]);
  return contextMenu;
}

async function createTrayMenu() {
  appIcon = new Tray(
    resolve(__dirname, '..', '..', 'resources', 'IconTemplate.png')
  );
  appIcon.setContextMenu(await getContextMenu());

  appIcon.on('atualizar', async () => {
    const menu = await getContextMenu();
    appIcon.setContextMenu(menu);
  });
}

module.exports = { createTrayMenu };
