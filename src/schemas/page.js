var Model = require('../model');

module.exports = {
    publicationDate: {type: 'date'},
    revisionDate: {type: 'date', private: true},
    title: {type: 'html'},
    author: {type: 'html'},
    template: {type: 'text'},
    regions: {type: 'text'}
};
