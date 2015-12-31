'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var compress = require('compression');

var routes = require('./routes/index');
var entries = require('./routes/entries');

var passport = require('passport');
var authConfig = require('./configuration/auth');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

authConfig.init(app);

app.use('/auth', routes);
app.use('/api', entries);

app.use(function(req, res, next){
    var finalData = {
        status: res.resCode,
        code: 'success',
        extras: res.body
    };
    res.status(res.resCode);
    res.send(finalData);
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    var finalData = {
        status: err.resCode,
        code: err.desc,
        errors: err.info
    };
    res.status(err.resCode);
    res.send(finalData);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send();
});

app.get('*', function(req, res){
    console.log(process.env.NODE_ENV);
    res.sendFile('./public/src/index.html');
});

module.exports = app;
