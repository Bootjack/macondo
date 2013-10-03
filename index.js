/*  Usage
 *  app = express();
 *  app.use(macondo(contentTypeConfig));
 *  app.use(macondo(otherContentTypeConfig));
 *  app.get('/normal/route', function () {});
 */

module.exports = function (config) {
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
    
    return function (req, res, next) {
        var id, match;
        match = req.path.match(/^\/admin\/([^/]+)\/([^/]+)/);
        id = match && match[2];
        if (match && match[1] === name.toLowerCase()) {
            if ('GET' === req.method && id) {
                retrieve(id, res);
            } else if ('PUT' === req.method) {
                if (id) {
                    update(id, res);
                } else {
                    create(req.body.model, res);
                }
            } else if ('DELETE' === req.method && id) {
                destroy(id, res);
            }
        } else {
            next();
        }
    };
};
