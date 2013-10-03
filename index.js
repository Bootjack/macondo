/*  Usage
 *  app = express();
 *  app.use(macondo(contentTypeConfig));
 *  app.use(macondo(otherContentTypeConfig));
 *  app.get('/normal/route', function () {});
 */

module.exports = function (config) {
    var Model, model, schema;
    Model = require('./src/model');
    
    schema = (config && config.schema) || require('./src/schemas/page');
    model = new Model(schema);
    
    return function (req, res, next) {
        var i, contents;
        contents = model.findAll();

        for (i = 0; i < pages.length; i += 1) {            
            if (req.path === pages[i].path) {
                page = pages[i];
            }
        }
        next();
    };
};
