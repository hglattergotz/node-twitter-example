**node-twitter-example** is a demo node server to access the twitter REST and streaming API.

This is intended to be the backend for an ember demo application that can be found [here](https://github.com/hglattergotz/ember-twitter-demo).

### Installation

 1. Clone the repository
 2. ```npm install```

### Getting a Twitter access token

Get a [Twitter access token](https://dev.twitter.com/oauth/overview).
Copy the ./config.js.dist to ./config.js and add your key information.

### Start the server

```$ node index```

### Endpoints

The server responds to

 * http://0.0.0.0:8001/tweets
 * http://0.0.0.0:8001/settings
 * ws://0.0.0.0:8001/ts

The /tweets endpoint is essentially a proxy to the twitter search REST api.
The /settings endpoint responds to GET and PUT requests and is used for managing the
search term.
The /ts endpoint provides access to the twitter streaming api via websockets.

### Lincense

The MIT License (MIT)

Copyright (c) 2015 Henning Glatter-Götz

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
