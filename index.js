const subdomain = {
  // Define list of subdomains
  init: function() {},

  // Define subdomain route
  route: function(subdomain) {
    if (req.hostname.match(/sub\./g)) {
      next();
    } else {
      next();
    }
  }
};

module.exports = subdomain;
