var Model = require('../src/model.js');
describe('A Model', function () {
    it('should represent a set of data', function () {
        var test, Test;
        Test = new Model('Test', {
            title: 'Text'
        });
        test = new Test({title: 'A test title'});
        expect(test._fields.length).not.toBe(0);
        expect(test.title).toEqual('A test title');
    });
});
