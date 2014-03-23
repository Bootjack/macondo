'use strict';

var app, express, macondo, mongoose, path;

express = require('express');
macondo = require('../index.js');
mongoose = require('mongoose');
path = require('path');

mongoose.connect('localhost/macondo');

app = new express();
app.set('port', 3300);
app.set('filepath', __dirname);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.use(macondo({
    app: app,

    models: {
        'page': {
            schema: null,
            keys: {
                regions: [
                    'Main',
                    'Sidebar',
                    'Header',
                    'Footer'
                ]
            },
            hasMenu: true
        },
        'production' : {
            schema: {
                title: {type: 'text'},
                playwright: {type: 'text'},
                actors: {type: 'text', array: true}
            }
        }
    }
}));

app.get('/', function (req, res) {res.render('layout')});

// Fire it up
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
