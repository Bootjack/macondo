'use strict';

var app, express, macondo, mongoose;

express = require('express');
macondo = require('../index.js');
mongoose = require('mongoose');

mongoose.connect('localhost');

app = new express();
app.set('port', 3300);
app.use(macondo({
    name: 'production',
    schema: {
        title: {type: 'text'},
        playwright: {type: 'text'}
    }
}));

// Fire it up
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
