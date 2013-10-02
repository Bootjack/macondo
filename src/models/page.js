module.exports = function () {
    var fields, page;
    page = {};
    fields = ['title', 'author', 'publicationDate', 'revisionDate', 'template', 'regions'];
    if (arguments && arguments.length) {
        for (property in arguments[0]) {
            if (-1 !== fields.indexOf(property)) {
                page[property] = arguments[property];
            }
        }
    }
    return page;
};