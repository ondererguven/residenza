# Important

In the *config* folder you have to add two files: 

- db.js
- config.js

In *db.js* add 

```
module.exports.username = 'username to login to mongodb';
module.exports.password = 'password to login to mongodb';
```

In *config.js* add 

```
module.exports.baseUrl = 'http://127.0.0.1:3000';
module.exports.apiUrl = '';
module.exports.iOSAppSchema = 'residenzm://';
```
**The values are based on the environment (development, stage, production, etc.).**