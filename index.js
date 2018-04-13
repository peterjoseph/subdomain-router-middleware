const validate = require("property-validator").validate;
const presence = require("property-validator").presence;

let options = {
  asyncLoad: false,
  asyncFunc: null,
  invalid: [],
  error: {}
};

function fetchSubdomain(req) {
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  let regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,4})/;

  // Alternative regex for localhost development environments
  if (process.env.NODE_ENV === "development") {
    regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*)/;
  }

  // Fetch subdomain through regex
  const projectedDomain = url.match(regex);
  if (projectedDomain && projectedDomain[1]) {
    return projectedDomain[1];
  }

  return null;
}

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
      // Fetch subdomain
      const projectedDomain = fetchSubdomain(req);
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
  },

  // Validate there is no subdomain
  root: function () {
    return function (req, res, next) {
      // Fetch subdomain
      const projectedDomain = fetchSubdomain(req);

      // Continue if subdomain is null
      if (projectedDomain == null) {
        next();
        return;
      } else {
        res.status(403).json(options.error);
      }
    };
  }
};

module.exports = subdomain;