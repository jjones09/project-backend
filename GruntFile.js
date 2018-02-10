const fs = require('fs-extra');

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

    grunt.registerTask('createDbConfig', () => {
        let dbConf = {
            user: grunt.option('user'),
            pass: grunt.option('pass'),
            hosts: grunt.option('hosts').split(','),
            opts: grunt.option('opts').split(',')
        };
        fs.outputFileSync('./config/dbConnection.json', JSON.stringify(dbConf),
            {encoding: 'utf8', flag: 'wx'});
    });
};