A demo node server to access the twitter REST and streaming API.

This is intended to the backend for an ember demo application that can be found [here](https://github.com/hglattergotz/ember-twitter-demo)

IMPORTANT: You need to get a [Twitter access](https://dev.twitter.com/oauth/overview) token and put the keys in the ./config.js file.
           Just copy the ./config.js.dist file to ./config.js and add your info.

The server responds to

  http://0.0.0.0:8001/tweets
  http://0.0.0.0:8001/settings
  ws://0.0.0.0:8001/ts

The /tweets endpoint is essentially a proxy to the twitter search REST api.
The /settings endpoint responds to GET and PUT requests and is used for managing the
search term.

Once the ./config.js file has been updated simply run the app with ```node index```.
