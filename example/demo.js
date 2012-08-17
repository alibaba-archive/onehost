var connect = require('connect');
var onehost = require('../');

var app = connect(
  onehost({
    toHost: 'localhost'
  }),
  function (req, res) {
    res.end(JSON.stringify({headers: req.headers, url: req.url}));
  }
);

app.listen(1984);