module.exports = function (grunt) {

    grunt.initConfig({
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            files: [
                'Gruntfile.js',
                'index.js',
                'lib/**/*.js',
                'server/*',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        nodemon: {
            dev: {}
        },

        simplemocha: {
            options: {
                reporter: 'spec',
                NODE_ENV: 'testing',
                ignoreLeaks: true
            },
            full: { src: ['test/**/*-spec.js'] }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'simplemocha:full']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    // Default task.
    grunt.registerTask('default', ['jshint', 'simplemocha:full']);
    grunt.registerTask('test', ['jshint', 'simplemocha:full']);

};
