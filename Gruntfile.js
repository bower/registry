module.exports = function (grunt) {

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
                NODE_ENV: 'testing',
                ignoreLeaks: true
            },
            full: { src: ['test/**/*-test.js'] }
        },


        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'simplemocha:full']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Default task.
    grunt.registerTask('default', ['jshint', 'simplemocha:full']);
    grunt.registerTask('test', ['jshint', 'simplemocha:full']);

};
