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

    grunt.registerTask('createFirebaseConfig', () => {
        fs.openSync('./firebaseConfig.json', 'w');
        let fireConf = {
            serviceKey: {
                type: "service_account",
                project_id: "",
                private_key_id: "",
                private_key: "",
                client_email: "",
                client_id: "",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://accounts.google.com/o/oauth2/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: ""
            },
            dbURL: ""
        };
        fs.writeFileSync('./firebaseConfig.json', JSON.stringify(fireConf),
            {encoding: 'utf8', flag: 'w'});
    });

    grunt.registerTask('setFirebaseProjectID', () => {
        let fireConf = JSON.parse(fs.readFileSync('./firebaseConfig.json'));

        fireConf.serviceKey.project_id = grunt.option('pID');

        fs.writeFileSync('./firebaseConfig.json', JSON.stringify(fireConf),
            {encoding: 'utf8', flag: 'w'});
    });

    grunt.registerTask('setFirebasePrivateKey', () => {
        let fireConf = JSON.parse(fs.readFileSync('./firebaseConfig.json'));

        fireConf.serviceKey.private_key = '-----BEGIN PRIVATE KEY-----\n' +
            grunt.option('key') + '\n-----END PRIVATE KEY-----\n';

        fireConf.serviceKey.private_key_id = grunt.option('keyID');

        fs.writeFileSync('./firebaseConfig.json', JSON.stringify(fireConf),
            {encoding: 'utf8', flag: 'w'});
    });

    grunt.registerTask('setFirebaseClientInfo', () => {
        let fireConf = JSON.parse(fs.readFileSync('./firebaseConfig.json'));

        fireConf.serviceKey.client_email = grunt.option('email');
        fireConf.serviceKey.client_id = grunt.option('ID');
        fireConf.serviceKey.client_x509_cert_url = grunt.option('certURL');

        fs.writeFileSync('./firebaseConfig.json', JSON.stringify(fireConf),
            {encoding: 'utf8', flag: 'w'});
    });

    grunt.registerTask('setFirebaseURL', () => {
        let fireConf = JSON.parse(fs.readFileSync('./firebaseConfig.json'));

        fireConf.dbURL = grunt.option('url');

        fs.writeFileSync('./firebaseConfig.json', JSON.stringify(fireConf),
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