var http = require('http')
  , express = require('express')
  , bodyParser = require('body-parser')
  , url = require('url')
  , winston = require('winston')
  , fs = require('fs')
  , twitter = require('twitter')
  , config = require('./config')
  , WebSocketServer = require('ws').Server
  , wss
  , app
  , server
  , logger
  , twit
  , streamHolder = null
  , port = 8001
  , settings = {
      id: 1,
      hashtag: 'frankfurtjs'
  }
  ;

// Get a logger instance
logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'info' })
    ]
});

/**
 * Setup express to use the bodyParser for json so we can automatically get the
 * payload deserialized
 */
app = express();
app.use(bodyParser.json());

// Setup the http server
server = http.createServer(app).listen(port, function(req, res) {
    logger.info("Listening on port " + port);
});

// Create a websockets server
wss = new WebSocketServer({ server: server, path: '/ts' });

// Twitter client
twit = new twitter(config.twitter);

/**
 * Handle the routes we are interested in
 */

// Return a useless greetings on the root
app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Hello, I am the backend</h1>');
    res.end();
});

/**
 * Endpoint for fetching tweets
 *
 * Query the twitter search API for the search term that is currently set
 */
app.get('/tweets', function(req, res) {
    twit.get('/search/tweets', { q: settings.hashtag },  function(err, payload) {
        var tweets = [];

        for (var i = 0; i < payload.statuses.length; i++) {
            var url = payload['statuses'][i]['user']['profile_image_url'];

            tweets.push({
                id: payload['statuses'][i]['id'],
                author: payload['statuses'][i]['user']['name'],
                avatar: url.replace('normal', 'bigger'),
                body: payload['statuses'][i]['text'],
                date: payload['statuses'][i]['created_at'],
                screenname: payload['statuses'][i]['user']['screen_name']
            });
        };

        res.send({ tweets: tweets });
    });
});

// Endpoint for fetching the settings model
app.get('/settings/:id', function(req, res) {
    var result = {
        'settings': [ settings ]
    };
    res.send(result);
});

// Endpoint for saving the settings model
app.put('/settings/:id', function(req, res) {
    var record = req.param('setting');
    settings.hashtag = record.hashtag;

    res.send({});
});

// Catch all endpoint
app.get('*', function(req, res) {
    var error404 = {
        errors: [
            {
                status: "404",
                title: "Not found"
            }
        ]
    };
    res.status(404).send(error404);
});

/**
 * Create a new twitter stream when a new search term is specified and handle data
 * events from it.
 * Tweet objects coming from Twitter are transformed into a subset of the available
 * data and sent to our websocket
 */
function startTwitterStream(ws) {
    logger.info('New stream created, searching for ' + settings.hashtag);
    twit.stream('statuses/filter', { track: settings.hashtag }, function(stream){
        streamHolder = stream;
        stream.on('data', function(data) {

            var tweet = {
              id: data['id'],
              author: data['user']['name'],
              avatar: data['user']['profile_image_url'],
              body: data['text'],
              date: data['created_at'],
              screenname: data['user']['screen_name']
            };

            logger.info('Got tweet from ' + tweet.author + ':' + tweet.body);

            ws.send(JSON.stringify(tweet));
        });
        stream.on('error', function(err) {
            if (err.source) {
                logger.error('Got error from the twitter stream' + JSON.stringify(err.source));
            } else {
                logger.error('Got unkown error from stream');
            }
        });
    });
}

/**
 * When a new websocket connection comes in from the client start a new stream
 *
 * IMPORTANT: This is assuming a single client (which in our case it is since this is
 *            only a demo.
 *            If you would connect multiple clients and create a new stream for each
 *            you would quickly run into twitter's connection limit
 */
wss.on('connection', function connection(ws) {
    logger.info('wss connection');

    if (streamHolder === null) {
        logger.info('streamHolder is null');
        startTwitterStream(ws);
    } else {
        logger.info('streamHolder is NOT null');
        streamHolder.destroy();
        startTwitterStream(ws);
    }
});

// Handle server errors
server.on('error', function(err) {
    logger.error('server error: ' + err);
});

// Handle unhandled exceptions
process.on('uncaughtException', function(err) {
    logger.error('uncaughtException: ' + err.message);
    logger.error(err.stack);
    process.exit(1);
});
