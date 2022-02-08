const test = require('tape');
const gitconfig = require('../index');
const path = require('path');
const fse = require('fs-extra');

test('can get gitconfig', function (t) {
  gitconfig(path.resolve(__dirname, '..'))
    .then((data) => {
      t.ok(data, 'should have config data');
      t.end();
    })
    .catch(t.end);
});

test('can get gitconfig from subfolder', function (t) {
  gitconfig(__dirname)
    .then((data) => {
      t.ok(data, 'should have config data');
      t.end();
    })
    .catch(t.end);
});

const gitDir = path.resolve(__dirname, '..', '_git'),
  setUp = function () {
    fse.mkdirpSync(gitDir);
    fse.copySync(
      path.resolve(__dirname, '..', '.git/config'),
      path.resolve(gitDir, 'config')
    );
  },
  tearDown = function () {
    fse.removeSync(gitDir);
  };

test('can get gitconfig in git dir other than default .git', function (t) {
  setUp();
  gitconfig(path.resolve(__dirname, '..'), { gitDir: '_git' })
    .then((data) => {
      t.ok(data, 'should have config data');
      tearDown();
      t.end();
    })
    .catch(t.end);
});

test('from subfolder can get gitconfig in $GIT_DIR (absolute path) other than default .git', function (t) {
  setUp();
  process.env.GIT_DIR = path.resolve(__dirname, '../_git');
  gitconfig(__dirname)
    .then((data) => {
      t.ok(data, 'should have config data');
      tearDown();
      t.end();
    })
    .catch(t.end);
});

test('after non key remote', function (t) {
  process.env.GIT_DIR = '_git';
  gitconfig(path.resolve(__dirname, 'after-remote-without-key'))
    .then((data) => {
      t.ok(
        data &&
          data.remote &&
          data.remote.origin &&
          data.remote.origin.url === 'https://example.com/repo.git',
        'should have url'
      );
      t.end();
    })
    .catch(t.end);
});
