//@ts-check
const fs = require('fs').promises;
const ini = require('ini');
const path = require('path');

module.exports = async function gitConfigLocal(dir, options = {}) {
  const config = await findGit(dir, options);
  if (!config) throw new Error('no gitconfig to be found at ' + dir);

  const data = await fs.readFile(config);
  return format(ini.parse(data.toString()));
};

function format(data) {
  const out = {};
  Object.keys(data).forEach(function (k) {
    if (k.indexOf('"') > -1) {
      const parts = k.split('"');
      const parentKey = parts.shift().trim();
      const childKey = parts.shift().trim();
      if (!out[parentKey]) out[parentKey] = {};
      out[parentKey][childKey] = data[k];
    } else {
      out[k] = { ...out[k], ...data[k] };
    }
  });
  return out;
}

async function findGit(dir, options) {
  const folder = path.resolve(
    dir,
    options.gitDir || process.env.GIT_DIR || '.git',
    'config'
  );

  const exists = await pathExists(folder);
  if (exists) return folder;
  if (dir === path.resolve(dir, '..')) return false;
  return findGit(path.resolve(dir, '..'), options);
}

function pathExists(filePath) {
  return fs.access(filePath).then(
    () => true,
    () => false
  );
}
