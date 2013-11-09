/*  Usage
 *  app = express();
 *  app.use(macondo(contentTypeConfig));
 *  app.use(macondo(otherContentTypeConfig));
 *  app.get('/normal/route', function () {});
 */

module.exports = function (config) {
    'use strict';
    
    var ModelFactory, models, menus, model, jade;
    jade = require('jade');
    ModelFactory = require('./src/model');
    models = {};
    menus = [];

    for (model in config.models) {
        if (config.models.hasOwnProperty(model)) {
            models[model] = new ModelFactory(
                model, config.models[model].schema || require('./src/schemas/' + model)
            );
            if (config.models[model].hasMenu) {
                menus.push(models[model]);
            }
        }
    }

    function create(modelName, data, res) {
        console.log('creating model');
        var instance = new models[modelName](data);
        instance.save(function (err, obj) {
            res.send(200, JSON.stringify(obj));
        });
    }
    
    function retrieve(modelName, id, res) {
        console.log('retrieving model');
        models[modelName].findById(id, function(err, obj) {
            res.send(200, JSON.stringify(obj));        
        });
    }

    function update(modelName, id, data, res) {
        console.log('updating model');
        var property;
        console.log(id);
        models[modelName].findById(id, function (err, instance) {
            if (!err && instance) {
                for (property in data) {
                    console.log(instance);
                    if (data.hasOwnProperty(property)) {
                        instance[property] = data[property];
                    }
                }
                instance.save(function(err, obj) {
                    res.send(200, JSON.stringify(obj));
                });
            } else {
                create(modelName, data, res);
            }
        });
    }
    
    function destroy(modelName, id, res) {
        console.log('destroying model');
        models[modelName].findById(id, function (err, obj) {
            if (!err && obj) {
                obj.remove();
                res.send(200, modelName + ' ' + id + ' destroyed');
            } else {
                res.send(500, err);
            }
        });
    }
    
    function form(modelName, id, res) {
        var field, method;
        models[modelName].findById(id, function (err, obj) {
            if (obj) {
                method = 'PUT';
            } else {
                obj = new models[modelName]();
                for (field in models[modelName]._fields) {
                    if (models[modelName]._fields.hasOwnProperty(field)) {
                        obj[field] = models[modelName]._fields[field].default;
                    }
                }
                method = 'POST';
            }
            jade.renderFile(
                __dirname + '/src/views/form.jade', 
                {
                    method: method,
                    model: models[modelName],
                    instance: obj
                },
                function (err, html) {
                    if (err) {
                        res.send(500, err)
                    } else {
                        res.send(200, html);
                    }
                }
            );
        });
    }
    
    return function (req, res, next) {
        var i, id, match, name;
        req.app.locals.macondo = {};
        req.app.locals.macondo.menus = {};

        for (i = 0; i < menus.length; i += 1) {
            (function (name) {
                menus[i].find({isInMenu: true}, function (err, arr) {
                    if (!err) {
                        console.log(name);
                        req.app.locals.macondo.menus[name] = arr;

                        match = {
                            admin: req.path.match(/^\/admin\/([^/]+)\/?([^/]+)?/),
                            delete: req.path.match(/^\/delete\/([^/]+)\/?([^/]+)?/),
                            edit: req.path.match(/^\/edit\/([^/]+)\/?([^/]+)?/)
                        };
                        if (match.admin && models.hasOwnProperty(match.admin[1])) {
                            id = match.admin[2];
                            name = match.admin[1].toLowerCase();
                            if ('POST' === req.method) {
                                if (id) {
                                    update(name, id, req.body, res);
                                } else {
                                    create(name, req.body, res);
                                }
                            } else if ('GET' === req.method && id) {
                                retrieve(name, id, res);
                            } else if (('PUT' === req.method) && id) {
                                update(name, id, res);
                            } else if ('DELETE' === req.method && id) {
                                destroy(name, id, res);
                            }
                        } else if (match.delete && models.hasOwnProperty(match.delete[1])) {
                            id = match.delete[2];
                            name = match.delete[1].toLowerCase();
                            destroy(name, id, res);
                        } else if (match.edit && models.hasOwnProperty(match.edit[1])) {
                            id = match.edit[2];
                            name = match.edit[1].toLowerCase();
                            form(name, id, res);
                        } else {
                            next();
                        }
                    }
                });                
            }(menus[i].modelName));
        }
    };
};
