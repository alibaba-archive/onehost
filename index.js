module.exports = process.env.ONEHOST_COV ? require('./lib-cov/onehost') : require('./lib/onehost');