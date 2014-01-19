var Model = require('../model');

module.exports = {
    publicationDate: {type: 'date'},
    revisionDate: {type: 'date', private: true},
    isInMenu: {type: 'boolean'},
    menuOrder: {type: 'number'},
    menuParent: {type: 'text'},
    path: {type: 'text'},
    template: {type: 'text'},
    title: {type: 'text'},
    author: {type: 'text'},
    body: {type: 'html'},
    regions: {type: 'html', array: true}
};
