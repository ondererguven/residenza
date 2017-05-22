var oauthserver = require('oauth2-server');
var model = require('./auth');

// // model.createClient()

module.exports.oauth = oauthserver({
  model: model,
  grants: ['auth_code', 'password', 'refresh_token'],
  debug: true,
  accessTokenLifetime: model.accessTokenLifetime
});


// middleware for doing role-based permissions
module.exports.permit = function permit(...allowed) {
  // return a middleware
  return (req, res, next) => {
    if (req.user && allowed.indexOf(req.user.role) > -1 )
      next(); // role is allowed, so continue on the next middleware
    else {
      res.status(403).json({message: "Forbidden"}); // user is forbidden
    }
  }
}


//use oauth.authorise() middleware to check the validity of the token: if the token is valid the user info encoded in the token will be 
//available in req.user
//use permit('admin') middleware to check if the user has the right role to access the resource