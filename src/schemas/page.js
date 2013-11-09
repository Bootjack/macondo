var Model = require('../model');

module.exports = {
    publicationDate: {type: 'date'},
    revisionDate: {type: 'date', private: true},
    isInMenu: {type: 'boolean'},
    path: {type: 'text'},
    template: {type: 'text'},
    regions: {type: 'text'},
    title: {type: 'text'},
    author: {type: 'text'},
    body: {type: 'html'}
};
