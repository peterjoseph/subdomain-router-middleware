const validate = require("property-validator").validate;
const presence = require("property-validator").presence;

let options = {
  asyncLoad: false,
  asyncFunc: null,
  invalid: [],
  error: {}
};

const subdomain = {
  // Define options with single object
  // Validate all keys in object
  init: function(newOptions) {
    let validation = validate(newOptions, [
      presence("asyncLoad"),
      presence("error")
    ]);

    // Store options if valid
    if (validation.valid) {
      options = newOptions;
    } else {
      throw "Error: Subdomain options object invalid";
    }
  },

  // Define subdomain route
  route: function(subdomain) {
    return function(req, res, next) {
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      let regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,4})/;

      if (process.env.NODE_ENV === "development") {
        regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*)/;
      }

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
      } else if ((route != null || route != "") && subdomain === route) {
        next();
      } else {
        res.status(403).json(options.error);
      }
    };
  }
};

module.exports = subdomain;
