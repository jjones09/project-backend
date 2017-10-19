module.exports = (grunt) => {

    grunt.initConfig({
        jshint: {
            files: ['lib/**/*.js'],
            options: {
                esversion: 6,
                node: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('lint', ['jshint']);
};