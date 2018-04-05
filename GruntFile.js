const fs = require('fs');

module.exports = (grunt) => {

    grunt.initConfig({
        eslint: {
            lib: {
                "src": ["lib/**/*.js"]
            }
        }
    });

    grunt.loadNpmTasks('gruntify-eslint');

    grunt.registerTask('lint', ['eslint']);

    grunt.registerTask('createDbConfig', () => {
        fs.openSync('./mongodbConfig.json', 'w');
        let dbConf = {
            user: grunt.option('user'),
            pass: grunt.option('pass'),
            hosts: grunt.option('hosts'),
            opts: grunt.option('opts').split(',').join('&')
        };
        fs.writeFileSync('./mongodbConfig.json', JSON.stringify(dbConf),
            {encoding: 'utf8', flag: 'w'});
    });

    grunt.registerTask('addGiantBombApiKey', () => {
        fs.openSync('./giantBomb.json', 'w');
        let bombConf = {
            key: grunt.option('key')
        };
        fs.writeFileSync('./giantBomb.json', JSON.stringify(bombConf),
            {encoding: 'utf8', flag: 'w'});
    });
};