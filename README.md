node-twitter-example a demo node server to access the twitter REST and streaming API.

This is intended to the backend for an ember demo application that can be found [here](https://github.com/hglattergotz/ember-twitter-demo).

### Installation

Just clone the repository.

### Getting a Twitter access token

Get a [Twitter access token](https://dev.twitter.com/oauth/overview).
Copy the ./config.js.dist to ./config.js and add your key information.

### Start the server

```node index```

### Endpoints

The server responds to

 * http://0.0.0.0:8001/tweets
 * http://0.0.0.0:8001/settings
 * ws://0.0.0.0:8001/ts

The /tweets endpoint is essentially a proxy to the twitter search REST api.
The /settings endpoint responds to GET and PUT requests and is used for managing the
search term.
The /ts endpoint provides access to the twitter streaming api via websockets.
