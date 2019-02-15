var test = require('tape');
var gitconfig = require('../index');
var path = require('path');
var fse = require('fs-extra');

test("can get gitconfig",function(t) {
  gitconfig(path.resolve(__dirname,'..'),function(err,data){
    t.ok(!err,'should not have error getting gitconfig');
    t.ok(data,'should have config data');
    t.end();
  });
});

test("can get gitconfig from subfolder",function(t) {
  gitconfig(__dirname,function(err,data){
    t.ok(!err,'should not have error getting gitconfig');
    t.ok(data,'should have config data');
    t.end();
  });
});

var gitDir = path.resolve(__dirname,'..','_git'),
  setUp = function() {
    fse.mkdirpSync(gitDir);
    fse.copySync(path.resolve(__dirname,'..','.git/config'), path.resolve(gitDir,'config'));
  },
  tearDown = function() {
    fse.removeSync(gitDir);
  };

test('can get gitconfig in git dir other than default .git', function(t) {
  setUp();
  gitconfig(path.resolve(__dirname,'..'), {gitDir: '_git'}, function(err, data) {
    t.ok(!err,'should not have error getting gitconfig');
    t.ok(data,'should have config data');
    tearDown();
    t.end();
  });
});

test('from subfolder can get gitconfig in $GIT_DIR (absolute path) other than default .git', function(t) {
  setUp();
  process.env.GIT_DIR = path.resolve(__dirname,'../_git');
  gitconfig(__dirname, function(err, data) {
    t.ok(!err,'should not have error getting gitconfig');
    t.ok(data,'should have config data');
    tearDown();
    t.end();
  });
});

test('after non key remote', function(t) {
  process.env.GIT_DIR = "_git";
  gitconfig(path.resolve(__dirname, 'after-remote-without-key'), function(err, data) {
    t.ok(data && data.remote && data.remote.origin && data.remote.origin.url === 'https://example.com/repo.git', 'should have url');
    t.end();
  });
})
