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
        instance.save();
        res.send(200, JSON.stringify(instance));
    }
    
    function retrieve(id, res) {
        console.log('retrieving model');
        var instance = Model.findById(id);
        res.send(200, JSON.stringify(instance));
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
        instance.save();
        res.send(200, JSON.stringify(instance));
    }
    
    function destroy(id, res) {
        console.log('destroying model');        
        var instance = Model.findById(id);
        instance.destroy();
        res.send(200, JSON.stringify(instance));
    }    
    
    return function (req, res, next) {
        var id, match;
        match = req.path.match(/^\/admin\/([^/]+)\/([^/]+)/);
        id = match && match[1];
        if (match && match[0] === name.toLowerCase()) {
            if ('get' === req.route.method && id) {
                retrieve(id, res);
            } else if ('put' === req.route.method) {
                if (id) {
                    update(id, res);
                } else {
                    create(req.body.model, res);
                }
            } else if ('delete' === req.route.method && id) {
                destroy(id, res);
            }
        }
        next();
    };
};
