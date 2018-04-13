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
  init: function (newOptions) {
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
  route: function (subdomain) {
    return function (req, res, next) {
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      let regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,4})/;

      // Alternative regex for localhost development environments
      if (process.env.NODE_ENV === "development") {
        regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*)/;
      }

      // Fetch domain through regex
      let projectedDomain = url.match(regex);
      projectedDomain && projectedDomain[1] ? projectedDomain = projectedDomain[1] : null;

      // If our subdomain is null, fetch list of required subdomains
      if ((subdomain == null || subdomain == "") && options.asyncLoad == true) {
        // Fetch our list of available subdomains
      } else if ((projectedDomain != null || projectedDomain != "") && subdomain === projectedDomain) {
        next();
        return;
      } else {
        res.status(403).json(options.error);
      }
    };
  }
};

module.exports = subdomain;