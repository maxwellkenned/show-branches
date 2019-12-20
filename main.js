const { app, Menu, Tray } = require('electron');
const { execSync } = require('child_process');
const fs = require('fs');
const { resolve } = require('path');

const basePath = '/vox/';
const existPathVox = fs.existsSync(basePath);
let appIcon = null;
let contextBranchs = [];

const getItensMenu = async _ => {
  if (existPathVox) {
    const files = fs
      .readdirSync(basePath)
      .filter(
        file =>
          file.charAt(0) !== '.' &&
          fs.lstatSync(basePath + file).isDirectory &&
          fs.existsSync(basePath + file + '/.git')
      );

    return (contextMenu = await mapPaths(files));
  }
};

function mapPaths(files) {
  return files.map(file => {
    const path = basePath + file;
    let branch = '';
    try {
      branch = execSync(`cd ${path} && git rev-parse --abbrev-ref HEAD`);
    } catch (e) {}
    return {
      label: file + ' | ' + String(branch).replace(/[\n]/, ''),
      sublabel: String(branch).replace(/[\n]/, ''),
      icon: `${resolve(__dirname, 'assets', 'images', 'branch.png')}`,
      type: 'normal',
      enabled: false
    };
  });
}

async function getContextMenu() {
  contextBranchs = await getItensMenu();
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Refresh',
      role: 'unhide',
      icon: `${resolve(__dirname, 'assets', 'images', 'refresh.png')}`,
      click: async event => {
        appIcon.emit('atualizar', event);
      }
    },
    { label: '', type: 'separator' },
    ...contextBranchs,
    { label: '', type: 'separator' },
    {
      label: 'Close',
      role: 'quit',
      icon: `${resolve(__dirname, 'assets', 'images', 'quit.png')}`,
      click: () => {
        app.exit();
      }
    }
  ]);
  return contextMenu;
}

async function createTrayMenu() {
  appIcon = new Tray(resolve(__dirname, 'assets', 'images', 'git.png'));
  appIcon.setContextMenu(await getContextMenu());
  appIcon.on('atualizar', async () => {
    appIcon.setContextMenu(await getContextMenu());
  });
}

app.on('ready', createTrayMenu);
