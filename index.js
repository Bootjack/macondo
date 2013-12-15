/*  Usage
 *  app = express();
 *  app.use(macondo(contentTypeConfig));
 *  app.get('/normal/route', function () {});
 */

module.exports = function (config) {
    'use strict';
    
    var ModelFactory, models, managers, menus, model, mongoose, express, fs, jade, path, i;
    express = require('express');
    fs = require('fs');
    jade = require('jade');
    mongoose = require('mongoose');
    path = require('path');
    ModelFactory = require('./src/model');
    models = {};
    managers = {};
    menus = [];
    var foo = "bar";
    
    if (config.app) {
        config.app.use(express.static(path.join(__dirname, 'assets')));
    }

    for (model in config.models) {
        if (config.models.hasOwnProperty(model)) {
            models[model] = new ModelFactory(
                model, config.models[model].schema || require('./src/schemas/' + model)
            );
            managers[model] = jade.compile(fs.readFileSync(path.join(__dirname, 'src/views/manager.jade')));
            if (config.models[model].hasMenu) {
                menus.push(models[model]);
            }
        }
    }
    
    function normalize(modelName, data) {
        if ('page' === modelName) {
            data.path = data.path.replace(/[\s_.]/g, '-');
        }
        return data;
    }

    function create(modelName, data, res) {
        console.log('creating model');
        var instance = new models[modelName](normalize(modelName, data));
        instance._modelName = modelName;
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
        models[modelName].findById(id, function (err, instance) {
            if (!err && instance) {
                data = normalize(modelName, data);
                data._modelName = modelName;
                for (property in data) {
                    if (data.hasOwnProperty(property)) {
                        instance[property] = data[property];
                        console.log(property + ': ' + instance[property]);
                    }
                }
                instance.save(function(err, obj) {
                    if (err) {
                        console.log(err);
                    }
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
        var field, match, method;
        match = {isInMenu: true};
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
           match._id = {'$ne': id};
        }
        models[modelName].find(match, 'title', function (err, siblings) {
            if (err) {
                console.log(err)
            }
            models[modelName].findById(id, function (err, obj) {
                if (obj) {
                    console.log(obj);
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
                        instance: obj,
                        siblings: siblings
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
        });
    }

    function intercept(req, res, next) {
        var id, match, name;
        match = {
            admin: req.path.match(/^\/admin\/([^/]+)\/?([^/]+)?/),
            delete: req.path.match(/^\/delete\/([^/]+)\/?([^/]+)?/),
            edit: req.path.match(/^\/edit\/([^/]+)\/?([^/]+)?/),
            page: req.path.match(/^\/([^/]+)\/?$/)
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
        } else if (models.page && match.page && match.page[1]) {
            models.page.find({path: match.page[1]}, function (err, page) {
                if (err || 0 === page.length) {
                    next();
                } else {
                    res.render('page', page[0]);
                }
            });
        } else {
            next();
        }
    }
    
    function buildMenu(req, res, next) {
        if (i < menus.length) {
            menus[i].find({'isInMenu': true}, 
                (function (menu) {
                    return function (err, arr) {
                        var a, item, keyed, nested;
                        keyed = {};
                        nested = [];
                        if (!err && arr && arr.length) {
                            for (a = 0; a < arr.length; a += 1) {
                                item = arr[a];
                                keyed[item._id] = item;
                            }
                            for (a = 0; a < arr.length; a += 1) {
                                item = arr[a];
                                if (item.menuParent && keyed[item.menuParent]) {
                                    keyed[item.menuParent].children = keyed[item.menuParent].children || [];
                                    keyed[item.menuParent].children.push(item);
                                } else {
                                    nested.push(item);
                                }
                            }
                            req.app.locals[menu.modelName + 'Menu'] = nested;
                            i += 1;
                            buildMenu(req, res, next);                            
                        } else {
                            if (err) {
                                console.log(err);
                            }
                            intercept(req, res, next);
                        }
                    };
                }(menus[i]))
            );
        } else {
            intercept(req, res, next);
        }
    }
    
    return function (req, res, next) {
        console.log(req.path + ' handled by macondo');
        
        i = 0;

        req.app.locals.managers = managers;
        buildMenu(req, res, next);

    };
};
