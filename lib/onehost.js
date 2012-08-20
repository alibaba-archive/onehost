/*!
 * onehost, One host only
 * 
 * Redirect `HTTP GET` for `any.domain.com` and `www.domain.com` to `want.domain.com`.
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

/**
 * One host binding middleware.
 * 
 * @param {Object} options
 *  - {String} host, which host should be binding.
 *  - {Array|String} [exclude], ignore hosts, they won't be handle.
 *    e.g.: 'abc.com' or `['abc.com', 'dec.com']`, default is `[]`.
 *  - {String} [protocol], http or https, default is http.
 * @return {Function(req, res, next)} middleware function.
 */
module.exports = function onehost(options) {
  var EXCLUDE_HOST_RE = null;
  options = options || {};
  var protocol = options.protocol || 'http';
  var toHost = options.host;
  var excludeHosts = options.exclude || [];
  if (!Array.isArray(excludeHosts)) {
    excludeHosts = [excludeHosts];
  }
  if (excludeHosts.length > 0) {
    for (var i = 0; i < excludeHosts.length; i++) {
      excludeHosts[i] = excludeHosts[i].replace(/\./g, '\\.');
    }
    EXCLUDE_HOST_RE = new RegExp('^(?:' + excludeHosts.join('|') + ')', 'i');
  }
  return function (req, res, next) {
    var host = req.headers.host;
    if (!toHost || host.indexOf(toHost) === 0 || req.method !== 'GET') {
      return next();
    }
    if (EXCLUDE_HOST_RE && EXCLUDE_HOST_RE.test(host)) {
      return next();
    }
    var port = host.split(':', 2)[1];
    host = toHost;
    if (port) {
      host += ':' + port;
    }
    res.writeHead(301, {
      'Location': protocol + '://' + host + (req.originalUrl || req.url)
    });
    res.end();
  };
};