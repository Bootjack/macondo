'use strict';

var app, express, macondo, mongoose, path;

express = require('express');
macondo = require('../index.js');
mongoose = require('mongoose');
path = require('path');

mongoose.connect('localhost/macondo');

app = new express();
app.set('port', 3300);
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    macondo({
        name: 'production',
        schema: {
            title: {type: 'text'},
            playwright: {type: 'text'}
        }
    })
);
app.use(
    macondo({name: 'page'})
);

// Fire it up
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
