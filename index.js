const options = {
  asyncLoad: false,
  error: {
    success: false,
    message: "Subdomain does not match available list"
  }
};

const subdomain = {
  // Define options with single object
  // Validate all keys in object
  init: function() {
    // Define asyncLoad object enabled
    // Define asyncLoad subdomain list
    // Define return failure object
  },

  // Define subdomain route
  route: function(subdomain) {
    return function(req, res, next) {
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      const regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,4})/;
      let route, i;
      // Get the route from the url
      if ((i = regex.exec(url)) !== null) {
        i.forEach((match, groupIndex) => {
          if (groupIndex == 1) {
            route = match;
          }
        });
      }
      // If our subdomain is null, fetch list of required subdomains
      if ((subdomain == null || subdomain == "") && options.asyncLoad == true) {
        // Fetch our list of available subdomains
      } else if (subdomain === route) {
        next();
      } else {
        res.status(403).json(options.error);
      }
    };
  }
};

module.exports = subdomain;
