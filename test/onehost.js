var onehost = require('../');
var connect = require('connect');
var request = require('supertest');

describe('onehost.js', function () {
  var app = connect(
    onehost({
      host: 'shu.taobao.com',
      exclude: 'dev.shu.taobao.com'
    }),
    function (req, res) {
      res.end(JSON.stringify({
        url: req.url,
        headers: req.headers
      }));
    }
  );

  it('should redirect 127.0.0.1 to shu.taobao.com', function (done) {
    request(app)
    .get('/foo/bar?query=' + encodeURIComponent('淘宝'))
    .set('Host', '127.0.0.1:5678')
    .expect('Location', 'http://shu.taobao.com:5678/foo/bar?query=%E6%B7%98%E5%AE%9D')
    .expect(301, done);
  });

  it('should not redirect for shu.taobao.com', function (done) {
    request(app)
    .get('/foo/bar?query=' + encodeURIComponent('淘宝'))
    .set('Host', 'shu.taobao.com:3456')
    .expect(200, done);
  });

  it('should redirect index.taobao.com/foo to shu.taobao.com/foo', function (done) {
    request(app)
    .get('/foo/bar?query=' + encodeURIComponent('淘宝'))
    .set('Host', 'index.taobao.com')
    .expect('Location', 'http://shu.taobao.com/foo/bar?query=%E6%B7%98%E5%AE%9D')
    .expect(301, done);
  });

  it('should not redirect dev.shu.taobao.com/ to shu.taobao.com/', function (done) {
    request(app)
    .get('/')
    .set('Host', 'dev.shu.taobao.com')
    .expect(200, done);
  });

  it('should not redirect for POST method', function (done) {
    request(app)
    .post('/')
    .set('Host', 'index.taobao.com')
    .expect(200, done);
  });
});