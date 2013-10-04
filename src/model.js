module.exports = function (name, schema) {
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
    
    Model.prototype.save = function () {
        return this;
    };
    
    Model.prototype.destroy = function () {
        return true;
    };
    
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
    
    Model.findById = function (id, callback) {
        var err, instance;
        err = new Error('Not implemented');
        callback(err, instance);
    };

    return Model;
};
