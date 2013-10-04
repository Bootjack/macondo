/*  Usage
 *  app = express();
 *  app.use(macondo(contentTypeConfig));
 *  app.use(macondo(otherContentTypeConfig));
 *  app.get('/normal/route', function () {});
 */

module.exports = function (config) {
    'use strict';
    
    var ModelFactory, Model, name, schema;
    ModelFactory = require('./src/model');
    
    name = (config && config.name) || 'Model';
    schema = (config && config.schema) || require('./src/schemas/page');
    Model = new ModelFactory(schema);
    
    function create(model, res) {
        console.log('creating model');
        var instance = new Model(req.body.model);
        instance.save(function (err, obj) {
            res.send(200, JSON.stringify(obj));    
        });
    }
    
    function retrieve(id, res) {
        console.log('retrieving model');
        var instance = Model.findById(id, function(err, obj) {
            res.send(200, JSON.stringify(obj));        
        });
    }

    function update(id, res) {
        console.log('updating model');
        var instance, property;
        instance = Model.findById(id);
        for (property in req.body.model) {
            if (req.body.model.hasOwnProperty(property)) {
                instance[property] = req.body.model[property];
            }
        }
        instance.save(function(err, obj) {
            res.send(200, JSON.stringify(obj));            
        });
    }
    
    function destroy(id, res) {
        console.log('destroying model');        
        Model.findById(id, function (err, obj) {
            obj.destroy();
            res.send(200, name + ' ' + id + ' destroyed');            
        });
    }
    
    function form(id, res) {
        Model.findById(id, function (err, obj) {
            if (obj) {
                method = 'PUT';
            } else {
                obj = new Model();
                method = 'POST';
            }
            res.render('form', {
                method: method,
                model: obj
            });
        }
    }
    
    return function (req, res, next) {
        var id, match;
        match = {
            admin: req.path.match(/^\/admin\/([^/]+)\/([^/]+)/),
            edit: req.path.match(/^\/edit\/([^/]+)\/([^/]+)/)
        };
        if (match.admin && match.admin[1] === name.toLowerCase()) {
            id = match.admin[2];
            if ('POST' === req.method) {
                create(req.body.model, res);
            } else if ('GET' === req.method && id) {
                retrieve(id, res);
            } else if ('PUT' === req.method && id) {
                update(id, res);
            } else if ('DELETE' === req.method && id) {
                destroy(id, res);
            }
        } else if (match.edit && match.edit[1] === name.toLowerCase()) {
            id = match.edit[2];
            form(id, res);
        } else {
            next();
        }
    };
};
