'use strict';

const path = require('path');
const P = require('bluebird');
P.onPossiblyUnhandledRejection(() => {});
P.config({
  // Enable cancellation.
  cancellation: true,
  // Enable long stack traces. WARNING this adds very high overhead!
  longStackTraces: false,
  monitoring: true,
  // Enable warnings.
  warnings: false
});

const express = require('express');
const exphbs = require('express-handlebars');
const projects = require('./controllers/projects');

// Set up express and handlebars
const app = express();
const handlebars = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    },
  },
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

let NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  NODE_ENV = 'local';
  process.env.NODE_ENV = NODE_ENV;
}

app.set('NODE_ENV', NODE_ENV);

let dbconfig = {};

try {
  dbconfig = require(`./configs/datasources.${NODE_ENV}.js`);
  if (dbconfig && (NODE_ENV === 'local' || NODE_ENV === 'test')) {
    if (dbconfig.db.host !== '0.0.0.0' || dbconfig.db.port !== 27017) {
      throw new Error('Invalid DB');
    }
  }
} catch(err) {
  throw new Error(`Invalid NODE_ENV or datasources.${NODE_ENV}.js not found`);
}

app.set('dbconfig', dbconfig);

// Create endpoints
app.get('/', projects.list);
app.get('/projects/:project_id', projects.single);

app.startRestApp = function(cb) {
  // start the web server
  return app.listen(process.env.PORT || 3000, function() {
    console.log('CodeShip-API-V2 Server is now running on localhost:' + (process.env.PORT || 3000));
    if (cb) {
      return cb(this);
    }
  });
}

app.start = (cb) => {
  app.startRestApp(cb);
};

if (NODE_ENV !== 'test') {
  app.start();
}

module.exports = app;
