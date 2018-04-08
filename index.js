const subdomain = {
  // Define list of subdomains
  init: function() {},

  // Define subdomain route
  route: function(subdomain) {
    if (subdomain === "" || subdomain === null) {
      next();
      return;
    } else if (req.hostname.match(subdomain)) {
      next();
    } else {
      res.status(403);
    }
  }
};

module.exports = subdomain;
