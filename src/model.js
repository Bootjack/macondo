module.exports = function (name, schema, database) {
    'use strict';
    
    var order, property, type;

    function Model(data) {
        var i, field;
        data = data || {};
        for (i = 0; i < this._fields.length; i += 1) {
            field = this._fields[i];
            this[field.name] = data[field.name] || field.default;
        }
    }

    Model.prototype.DataType = {
        'Text': {name: 'text', default: ''},
        'Html': {name: 'html', default: '<div></div>'},
        'Number': {name: 'number', default: 0},
        'Date': {name: 'date', default: new Date().toUTCString()}
    };
    
    Model.prototype._name = name;
    Model.prototype._fields = [];  

    Model.findById = function (id, callback) {
        var err, instance;
        err = new Error('Not implemented');
        callback(err, instance);
    };

    Model.prototype.save = function (callback) {
        var err, instance;
        err = new Error('Not implemented');
        callback(err, instance);
    };
    
    Model.prototype.destroy = function (callback) {
        var err;
        err = new Error('Not implemented');
        callback(err);
    };
    
    (function (schema) {
        var Mongoose, MongoModel, Schema, field;
        if (database.name.match('mongo')) {
            for (field in schema) {
                if (schema.hasOwnProperty(field)) {
                    switch (schema[field].type) {
                        case 'Text':
                        case 'Html':
                            schema[field] = String;
                            break;
                        case 'Number':
                            schema[field] = Number;
                            break;
                        case 'Date':
                            schema[field] = Date;
                            break;
                        default:
                            schema[field] = Object;
                    }
                }
            }
            Mongoose = database.connection;
            Schema = Mongoose.Schema(schema);
            MongoModel = Mongoose.model(name, Schema);
            Model.prototype.findById = function (id, callback) {
                return MongoModel.findById(id, callback);
            };
            Model.prototype.save = function (callback) {
                var cb, self;
                self = this;
                cb = function (err, instance) {
                    self._id = instance._id;
                    callback(err, instance);
                }
                return MongoModel.create(this, callback);
            };
            Model.prototype.destroy = function (callback) {
                return MongoModel.remove({id: this._id}, callback);
            };
        }
    }(schema));
    
    /* Create an ordered list of field names and types, and also assign any field to the returned model object. */
    for (property in schema) {
        if (schema.hasOwnProperty(property)) {
            order = schema[property].order;
            type = Model.prototype.DataType[schema[property].type] || Model.prototype.DataType.Text;
            if ('undefined' !== typeof order && order < this._fields.length) {
                Model.prototype._fields.splice(order, 0, {name: property, type: type});
            } else {
                Model.prototype._fields.push({name: property, type: type});
            }
        }
    }

    return Model;
};
