module.exports = function (grunt) {

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

    simplemocha: {
      options: {
        reporter: 'spec',
        node_env: 'testing',
        ignoreLeaks: true
      },
      full: { src: ['test/**/*-test.js'] }
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
  grunt.registerTask('default', ['jshint', 'simplemocha:full']);
  grunt.registerTask('test', ['jshint', 'simplemocha:full']);

};

