const os = eRequire('os');

let destPath = 'c:\\softer\\Sincronizador';

let dbDest = {};
let dbConfig = {};

function readDestConfigFile() {
    fse.readFile(`${destPath}\\dbDest.json`, function (err, data) {
        if (err) {
            return console.log(err);
        }
        let fileRead = fse.readFileSync(`${destPath}\\dbDest.json`, 'utf8');
        dbDest = JSON.parse(fileRead);

        // const mssql = require("mssql");
        dbConfig = {
            user: dbDest.user,
            password: dbDest.password,
            server: dbDest.server,
            database: dbDest.database,
            port: dbDest.port,
            connectionTimeout: 500000,
            requestTimeout: 500000,
            pool: {
                idleTimeoutMillis: 500000,
                max: 100
            }
        };

        if (dbDest.port !== '1433') {
            dbConfig.server = dbDest.server.split('\\')[0],
                dbConfig.dialectOptions = {
                    instanceName: dbDest.server.split('\\')[1]
                }
        }

        // const pool = new mssql.ConnectionPool(dbConfig);
        // pool.on('error', err => {
        //     if (err) {
        //         console.log('sql errors', err);
        //     }
        //     if (!err) {
        //         pool.connect();
        //     }
        // });

        // const connection = new mssql.ConnectionPool(dbConfig, function (err) {
        //     if (err)
        //         throw err;
        // });

    });
};

readDestConfigFile();

setInterval(function () {
    if (dbConfig.connectionTimeout) {

        module.exports = dbConfig;
    }

    readDestConfigFile();
}, 1000);