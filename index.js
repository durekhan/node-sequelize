'use strict';
const express = require('express');
const kraken = require('kraken-js');
const path = require('path');

let options, app;

options = {

  onconfig: function (config, next) {
    next(null, config);
  }
};

app = module.exports = express();

app.use(express.static(__dirname + '/public'));
global.db = require('./app/models/index');
global.log = require('./app/lib/logger');
global.appRoot = path.resolve(__dirname);

global.kraken = app.kraken;
app.use(kraken(options));
app.on('start', function () {
  global.kraken = app.kraken;
  global.log.info('Application ready to serve requests.');
  global.log.info('Environment: %s', app.kraken.get('env:env'));
});
// app.use((req,res,next)=>{
//   res.status(404).json({error:"Invalid Request"});
//   next(error);
// });
// app.use((error,req,res,next)=>{
//   res.status(error.status||500).json({error:"Invalid Request"});
// });