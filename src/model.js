module.exports = function (schema) {
    var order, property, type;

    function Model(data) {
        var i, field;
        for (i = 0; i < this.fields.length; i += 1) {
            field = this.fields[i];
            this[field] = data[field] || this.fields.default;
        }
    }

    Model.prototype.DataType = {
        'Text': {name: 'text', default: ''},
        'Html': {name: 'html', default: '<div></div>'},
        'Number': {name: 'number', default: 0},
        'Date': {name: 'date', default: new Date().toUTCString()}
    };
    
    Model.prototype.fields = [];
    /* Create an ordered list of field names and types, and also assign any field to the returned model object. */
    for (property in schema) {
        if (schema.hasOwnProperty(property)) {
            order = schema[property].order;
            type = (schema[property].type && this.DataType[schema[property].type]) || Model.prototype.DataType.Text;
            if ('undefined' !== typeof order && order < this._fields.length) {
                Model.prototype.fields.splice(order, 0, {name: property, type: type});
            } else {
                Model.prototype.fields.push({name: property, type: type});
            }
        }
    }
    
    return Model;
};
