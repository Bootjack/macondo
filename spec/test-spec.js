var macondo = require('../index.js');
describe('An admin user', function () {
    it('should be able to create a page', function () {
        page = macondo.Page({
            title: 'Test Page'
        });
        expect(page).toBeDefined();
    });    
});