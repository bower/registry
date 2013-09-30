module.exports = function (grunt) {

    grunt.initConfig({

        jshint: {
            files: [
                'Gruntfile.js',
                'index.js',
                'lib/**/*.js',
                'test/**/*.js'
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
        },

        exec: {
            coverage: {
                command: 'node node_modules/istanbul/lib/cli.js cover --dir ./coverage node_modules/mocha/bin/_mocha -- -R dot test/**/*-test.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['jshint', 'simplemocha:full']);
    grunt.registerTask('coverage', 'exec:coverage');
    grunt.registerTask('test', ['jshint', 'simplemocha:full']);

};
