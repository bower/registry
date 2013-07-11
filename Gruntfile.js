/*global module:false*/

module.exports = function(grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    jshint: {
      files: [
        'Gruntfile.js',
        'index.js',
        'lib/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      all: {
        src: ['test/**/*-test.js'],
        options: {
          ui: 'bdd'
        },
      },
    },

    watch: {
      files: '**/*',
      tasks: ['jshint', 'mochaTest']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Default task.
  grunt.registerTask('default', ['jshint', 'simplemocha:full'] );
  grunt.registerTask('test', ['jshint', 'simplemocha:full'] );

};

