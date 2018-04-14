# subdomain-router-middleware
### Middleware for handling subdomains using Express.

**subdomain-router-middleware** provides validation on express routes so that they are only accessible via the correct subdomain.

Installation
-----

```
npm install subdomain-router-middleware
```

Dependencies
-----
- Express JS
- property-validator

Usage
-----

1) In the router file of your express project, require the package as follows.

```
var subdomain = require("subdomain-router-middleware");
```

Certain initialisation parameters need to be declared in order for the middleware to function correctly.

2) Create an object with the following parameters and pass it into the init function.

```
subdomain.init({
  asyncLoad: false,
  asyncFunc: null,
  error: {
    success: false,
    message: "Invalid subdomain"
  }
});
```

| Parameter | Type | Description |
|:---|:---|:---|
| `asyncLoad` | bool | Boolean to specify if valid subdomains should be asynchronously loaded. |
| `asyncFunc` | Function | Specify a promise function to asynchronously load a list of valid subdomains. |
| `error` | JSON | JSON that is returned when a subdomain is invalid. |


In your express routes, add the middleware.

```
router.get("/test", subdomain.route("subdomain"), function(req, res) {}
```

Validate individual subdomain
-----
To specifiy a route that is only accessible with a certain subdomain, add the middleware and pass a string that contains the valid subdomain.

```
subdomain.route("mysubdomain")
```

Load valid subdomains asyncronously
-----
In many web applications, users can specify their own subdomain linked to their account.

You may need to asyncronously load a list of valid subdomains where the route is accessible.

To do so, we first need to modify the setup object we passed into the subdomain.init() function.

1) Change the boolean parameter **asyncLoad** to true.

2) Add a function to the **asyncFunc** parameter.

```
asyncFunc: function() {
    return new Promise((resolve, reject) => {
      // Server call to retrieve subdomains
      const array = [];
      resolve(array);
    });
  },
```

The middleware expects a javascript promise that returns an array containing all of the subdomains that are valid for the route.

Invalid routes with subdomain
-----
If you want certain routes to be completely inaccessible via a subdomain, you can use the alternative subdomain middleware function called **root**.

In your route, add the function.

```
router.get("/test", subdomain.root(), function(req, res) {}
```

This route will no longer be valid when accessed through a subdomain.

Subdomains in development mode
----

If you need to test and develop locally, it is still possible to use this package.

When NODE_ENV is set to development, an alternative regex is used that handles subdomains on localhost. More complex regex is used on production environments to determine the correct subdomain. 

Set the NODE_ENV environment to development.

```
process.env.NODE_ENV = "development"
```

The chrome web browser supports using subdomains on localhost. You can test locally as follows:

```
http://subdomain.localhost:8080/
```

---

Router Example
----
```
var express = require("express");
var path = require("path");
var subdomain = require("subdomain-router-middleware");

// Define our express router object
let router = express.Router();

// Initialise default subdomain parameters
subdomain.init({
  asyncLoad: true,
  asyncFunc: function() {
    return new Promise((resolve, reject) => {
      // Server call to retrieve subdomain for security token
      const array = ["subdomain1", "subdomain2", "subdomain3"];
      resolve(array);
    });
  },
  error: {
    success: false,
    message: "Invalid subdomain"
  }
});

// Express Route
router.get("/test", subdomain.route(), function(req, res) {
  res.json({
    success: true,
    message: "Endpoint loaded successfully"
  });
});

module.exports = router;
```