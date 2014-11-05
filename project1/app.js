var express = require('express');
var path = require('path');
var redis = require('redis');
var session = require('express-session')
var cookieParser = require('cookie-parser');

var client = redis.createClient(6379, 'localhost');



// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');



var routes = require('./routes/index');
var users = require('./routes/users');
//var questions = require('public/questions')

var app = express();


app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: new (require('express-sessions'))({
        storage: 'redis',
        instance: client, // optional
        host: 'localhost', // optional
        port: 6379, // optional
        collection: 'sessions', // optional
        expire: 86400 // optional
    })
}));

// view engine setup
app.listen('3000');
app.set('view engine', 'ejs');
app.set('view options', { layout:'layout.ejs' });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

//Allows us to us req.session
app.use(cookieParser());

//What does this do?
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});







module.exports = app;
