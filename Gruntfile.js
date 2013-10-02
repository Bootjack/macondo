module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            pivotal: {
                src: 'src/**/*.js',
                options: {
                    specs: 'spec/*-spec.js',
                    helpers: 'spec/*-helper.js'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['jasmine']);
};