'use strict';

var app, express, macondo, mongoose;

express = require('express');
macondo = require('../index.js');
mongoose = require('mongoose');

app = new express();
app.set('port', 3300);
app.use(macondo({
    name: 'production',
    scema: {
        title: 'text',
        playwright: 'text'
    }
}));

// Fire it up
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
