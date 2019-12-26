const { execSync } = require('child_process');
const { resolve } = require('path');
const chokidar = require('chokidar');

function mapPaths(files) {
  return files.map(file => {
    const path = process.env.BASE_PATH + file;
    let branch = '';
    try {
      branch = execSync(`cd ${path} && git rev-parse --abbrev-ref HEAD`);
    } catch (e) {}

    chokidar
      .watch(path + '/.git/HEAD', {
        interval: 1,
        persistent: true
      })
      .on('change', path => {
        appIcon.emit('atualizar');
      });

    const texto = file + ' | ' + String(branch).replace(/[\n]/, '');

    return {
      label: texto,
      sublabel: String(branch).replace(/[\n]/, ''),
      icon: `${resolve(
        __dirname,
        '..',
        '..',
        'assets',
        'images',
        'branch.png'
      )}`,
      type: 'normal',
      enabled: false
    };
  });
}

module.exports = { mapPaths };
