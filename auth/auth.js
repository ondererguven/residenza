var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;
var model = module.exports;

model.accessTokenLifetime = 120;

// JWT secret key
var secretKey = 'sample secret key';

// Mongoose schemas

var OAuthRefreshTokenSchema = new Schema({
  refreshToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

var OAuthClientSchema = new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUri: { type: String }
});

var OAuthUserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, default: '' },
  image: String,
  role: String
});

mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema);
mongoose.model('OAuthClient', OAuthClientSchema);
mongoose.model('OAuthUser', OAuthUserSchema);

var OAuthRefreshToken = mongoose.model('OAuthRefreshToken'),
    OAuthClient = mongoose.model('OAuthClient'),
    OAuthUser = mongoose.model('OAuthUser');

// model.createClient = function() {
//     var oAuthClient = new OAuthClient({
//         clientId: "abcde",
//         clientSecret: "secret"
//     });
    
//     oAuthClient.save(function(err, result){
//         console.log(err);
//         console.log(result);
//     });
// }

// The following functions customize the behavior of oauth2-server

/* Token functions */
model.getAccessToken = function (bearerToken, callback) {
  console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

  try {
    var decoded = jwt.verify(bearerToken, secretKey, { 
        ignoreExpiration: true //handled by OAuth2 server implementation
    });
    callback(null, {
      accessToken: bearerToken,
      clientId: decoded.sub,
      // userId: decoded.user,
      user: { id: decoded.user, role: decoded.role },
      expires: new Date(decoded.exp * 1000)
    });
  } catch(e) {    
    callback(e);
  }
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveAccessToken (token: ' + token + 
              ', clientId: ' + clientId + ', userId: ' + userId.id + 
              ', expires: ' + expires + ')');

  //No need to store JWT tokens.
  console.log(jwt.decode(token, secretKey));
  
  callback(null);
};

model.generateToken = function(type, req, callback) {
  //Use the default implementation for refresh tokens
  console.log('generateToken: ' + type);
  if(type === 'refreshToken') {
    callback(null, null);
    return;
  }
  
  //Use JWT for access tokens
  var token = jwt.sign({
    user: req.user.id,
    role: req.user.role
  }, secretKey, {
    expiresIn: model.accessTokenLifetime,
    subject: req.client.clientId
  });
  
  callback(null, token);
}

model.saveRefreshToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveRefreshToken (token: ' + token + 
              ', clientId: ' + clientId +
              ', userId: ' + userId.id + ', expires: ' + expires + ')');

  var refreshToken = new OAuthRefreshToken({
    refreshToken: token,
    clientId: clientId,
    userId: userId.id,
    expires: expires
  });

  refreshToken.save(callback);
};

model.getRefreshToken = function (refreshToken, callback) {
  console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

  OAuthRefreshToken.findOne({ refreshToken: refreshToken }, callback);
};

model.getClient = function (clientId, clientSecret, callback) {
  console.log('in getClient (clientId: ' + clientId + 
              ', clientSecret: ' + clientSecret + ')');
  if (clientSecret === null) {
    return OAuthClient.findOne({ clientId: clientId }, callback);
  }

  OAuthClient.findOne({ 
    clientId: clientId, 
    clientSecret: clientSecret 
  }, callback);
};

model.grantTypeAllowed = function (clientId, grantType, callback) {
  console.log('in grantTypeAllowed (clientId: ' + clientId + 
              ', grantType: ' + grantType + ')');

  // Authorize all clients to use all grants.
  callback(false, true);
};

model.getUser = function (username, password, callback) {
  console.log('in getUser (username: ' + username + 
              ', password: ' + password + ')');

  OAuthUser.findOne({ username: username, password: password }, 
    function(err, user) {
        if(err) return callback(err);
        console.log('User: ' + user);
        callback(null, user);
      }
  );
};







// var oauthserver = require('oauth2-server');
// var model = require('./auth');
// // model.createClient()
// app.oauth = oauthserver({
//   model: model,
//   grants: ['auth_code', 'password', 'refresh_token'],
//   debug: true,
//   accessTokenLifetime: model.accessTokenLifetime
// });
// // Handle token grant requests
// app.all('/oauth/token', app.oauth.grant());
// app.get('/secret', app.oauth.authorise(), function (req, res) {
//   // Will require a valid access_token
//   res.send('Secret area');
// });
// app.get('/public', function (req, res) {
//   // Does not require an access_token
//   res.send('Public area');
// });
// // Error handling
// app.use(app.oauth.errorHandler());