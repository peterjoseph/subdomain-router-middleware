const subdomain = {
  // Define list of subdomains
  init: function() {},

  // Define subdomain route
  route: function(subdomain) {
    return function(req, res, next) {
      if (req && req.hostname.match(/test\./g)) {
        next();
      }
    };
  }
};

module.exports = subdomain;
