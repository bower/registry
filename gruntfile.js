module.exports = function (grunt) {
    'use strict';

    // Project configuration
    grunt.initConfig({
        // Task configuration
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            code: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    
    grunt.registerTask('default', ['jshint']);
};