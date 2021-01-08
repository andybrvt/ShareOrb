const configs = {
  development: {
    SERVER_URI: 'localhost:3000',
  },
  production: {
    SERVER_URI: 'api.shareorb.com',
  },
};

module.exports.config = configs[process.env.NODE_ENV];
