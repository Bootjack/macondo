var Model = require('../src/model.js');
describe('A Model', function () {
    it('should represent a set of data', function () {
        var test, Test;
        Test = new Model({
            title: 'Text'
        });
        expect(Test.fields).toBeDefined();
        test = new Test({title: 'A test title'});
        expect(test.title).toEqual('A test title');
    });
});
