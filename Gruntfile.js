module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, cwd: 'src/client', src: ['form-controller.js'], dest: 'assets/macondo/'},
                    {expand: true, flatten: true, cwd: 'bower_components/jquery', src: ['jquery.min.js'], dest: 'assets/'},
                    {expand: true, flatten: true, cwd: 'bower_components/zepto', src: ['zepto.min.js'], dest: 'assets/'},
                    {expand: true, flatten: true, cwd: 'bower_components', src: ['datepickr/datepickr.css'], dest: 'assets/'},
                    {expand: true, flatten: true, cwd: 'bower_components', src: ['datepickr/datepickr.js'], dest: 'assets/'},
                    {expand: true, flatten: false, cwd: 'bower_components/tinymce/js/', src: ['tinymce/**'], dest: 'assets/'}
                ]
            }
        },
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
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    
    grunt.registerTask('default', ['copy']);
};
