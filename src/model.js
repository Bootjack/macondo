var mongoose = require('mongoose');

module.exports = function (name, schema) {
    'use strict';
    
    var Model, dataTypes, fields, mongoSchema, order, property, type;

    dataTypes = {
        'text': {name: 'text', default: ''},
        'html': {name: 'html', default: '<div></div>'},
        'number': {name: 'number', default: 0},
        'date': {name: 'date', default: new Date().toUTCString()}
    };
    
    fields = {};
    mongoSchema = {};
    for (property in schema) {
        if (schema.hasOwnProperty(property) && schema[property].type) {
            fields[property] = dataTypes[schema[property].type];
            switch(schema[property].type) {
                case 'text':
                case 'html':
                    mongoSchema[property] = String;
                    break;
                case 'number':
                    mongoSchema[property] = Number;
                    break;
                case 'date':
                    mongoSchema[property] = Date;
                    break;
                default:
                    mongoSchema[property] = Object;
            }
        }
    }
    if (-1 === mongoose.modelNames().indexOf(name)) {
        Model = mongoose.model(name, mongoose.Schema(mongoSchema));
    } else {
        Model = mongoose.model(name);
    }
    
    Model._name = name;
    Model._fields = fields;
    
    return Model;
};
