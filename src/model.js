var mongoose = require('mongoose');

module.exports = function (name, schema) {
    'use strict';
    
    var Model, dataTypes, fields, mongoSchema, order, property, type;

    dataTypes = {
        'boolean': {name: 'boolean', default: false},
        'text': {name: 'text', default: ''},
        'html': {name: 'html', default: ''},
        'number': {name: 'number', default: 0},
        'date': {name: 'date', default: new Date().toUTCString()}
    };
    
    fields = {};
    mongoSchema = {};
    for (property in schema) {
        if (schema.hasOwnProperty(property) && schema[property].type) {
            fields[property] = {};
            fields[property].name = dataTypes[schema[property].type].name;
            fields[property].default = schema[property].default || dataTypes[schema[property].type].default;
            fields[property].private = schema[property].private;
            if (schema[property].array) {
                fields[property].array = true;
                fields[property].default = [fields[property].default];

                switch(schema[property].type) {
                    case 'boolean':
                        mongoSchema[property] = [Boolean];
                        break;
                    case 'text':
                    case 'html':
                        mongoSchema[property] = [String];
                        break;
                    case 'number':
                        mongoSchema[property] = [Number];
                        break;
                    case 'date':
                        mongoSchema[property] = [Date];
                        break;
                    default:
                        mongoSchema[property] = [Object];
                }
            } else {
                switch(schema[property].type) {
                    case 'boolean':
                        mongoSchema[property] = Boolean;
                        break;
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
    }
    mongoSchema._modelName = String;
    if (-1 === mongoose.modelNames().indexOf(name)) {
        Model = mongoose.model(name, mongoose.Schema(mongoSchema));
    } else {
        Model = mongoose.model(name);
    }
    
    Model._name = name;
    Model._fields = fields;
        
    return Model;
};
