const fs = require('fs');

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
            hosts: grunt.option('host'),
            opts: grunt.option('opts')
        };
        fs.writeFileSync('./config/dbConnection.json', JSON.stringify(dbConf),
            {encoding: 'utf8', flag: 'wx'});
    });
};