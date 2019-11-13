const {
    ipcRenderer,
    remote
} = eRequire('electron');

const mainWin = remote.getCurrentWindow();

const os = eRequire('os');
const fse = eRequire('fs-extra');
const _ = eRequire("lodash");
const moment = eRequire('moment');
const sqlDb = eRequire("mssql");
const storage = eRequire('electron-json-storage');
const pjson = eRequire('./../../package.json');
const address = eRequire('address');

let destPath = 'c:\\softer\\Sincronizador\\config';

let dbDest = {},
    dbOrigin = {};

fse.readFile(`${destPath}\\dbOrigin.json`, function (err, data) {
    if (err) {
        return console.log(err);
    }

    ipcRenderer.send('openLoginWindow', mainWin.id);

    let fileRead = fse.readFileSync(`${destPath}\\dbOrigin.json`, 'utf8');
    dbOrigin = JSON.parse(fileRead);
    $('#serverOrigin').val(dbOrigin.server);
    $('#portOrigin').val(dbOrigin.port);
    $('#dbOrigin').val(dbOrigin.database);
    $('#userOrigin').val(dbOrigin.user);
    $('#passwordOrigin').val(dbOrigin.password);
    Materialize.updateTextFields();
});

fse.readFile(`${destPath}\\dbDest.json`, function (err, data) {
    if (err) {
        return console.log(err);
    }

    let fileRead = fse.readFileSync(`${destPath}\\dbDest.json`, 'utf8');
    dbDest = JSON.parse(fileRead);
    $('#serverDest').val(dbDest.server);
    $('#portDest').val(dbDest.port);
    $('#dbDest').val(dbDest.database);
    $('#userDest').val(dbDest.user);
    $('#passwordDest').val(dbDest.password);
    Materialize.updateTextFields();
});

$(function () {
    // console.log(destPath);
    storage.setDataPath(destPath);
});

$('#btnSaveOrigin').click(function (e) {
    if (e.clientX === 0) {
        return false;
    }
    e.preventDefault();

    let $btn = $(this);
    $($btn).attr('disabled', true);

    let params = {
        user: $('#userOrigin').val(),
        password: $('#passwordOrigin').val(),
        server: $('#serverOrigin').val(),
        port: $('#portOrigin').val(),
        database: $('#dbOrigin').val(),
        connectionTimeout: 2000,
        requestTimeout: 500000,
        pool: {
            idleTimeoutMillis: 500000,
            max: 100
        }
    };

    if ($('#portOrigin').val() !== '1433') {
        params.server = $('#serverOrigin').val().split('\\')[0],
            params.dialectOptions = {
                instanceName: $('#serverOrigin').val().split('\\')[1]
            }
    }

    sqlDb.connect(params, function (err) {
        sqlDb.close();

        if (err) {
            console.log(err);
            new PNotify({
                title: "Erro",
                text: err,
                type: 'error',
                icon: false,
                addclass: "stack-bottomright"
            });
            $($btn).attr('disabled', false);
            return;
        };

        if ($('#portOrigin').val() == '1433')
            params.server = $('#serverOrigin').val().replace(/\\/g, "\\");

        storage.set('dbOrigin', params, function (error) {
            if (error)
                throw error;
        });

        new PNotify({
            title: "Sucesso",
            text: "Banco de dados de origem conectado. Lembre de recarregar a tela principal.",
            type: 'success',
            icon: false,
            addclass: "stack-bottomright"
        });

        $btn.prop('disabled', false);
    });
});

$('#btnSaveDest').click(function (e) {
    if (e.clientX === 0) {
        return false;
    }
    e.preventDefault();

    let $btn = $(this);
    $($btn).attr('disabled', true);

    let params = {
        user: $('#userDest').val(),
        password: $('#passwordDest').val(),
        server: $('#serverDest').val(),
        port: $('#portDest').val(),
        database: $('#dbDest').val(),
        connectionTimeout: 500000,
        requestTimeout: 500000,
        pool: {
            idleTimeoutMillis: 500000,
            max: 100
        }
    };

    if ($('#portDest').val() !== '1433') {
        params.server = $('#serverDest').val().split('\\')[0],
            params.dialectOptions = {
                instanceName: $('#serverDest').val().split('\\')[1]
            }
    }

    sqlDb.connect(params, function (err) {
        sqlDb.close();

        if (err) {
            console.log(err);
            new PNotify({
                title: "Erro",
                text: err,
                type: 'error',
                icon: false,
                addclass: "stack-bottomright"
            });
            $($btn).attr('disabled', false);
            return;
        };

        if ($('#portDest').val() == '1433')
            params.server = $('#serverDest').val().replace(/\\/g, "\\");

        storage.set('dbDest', params, function (error) {
            if (error)
                throw error;
        });

        new PNotify({
            title: "Sucesso",
            text: "Banco de dados de destino conectado. Lembre de recarregar a tela principal.",
            type: 'success',
            icon: false,
            addclass: "stack-bottomright"
        });

        $btn.prop('disabled', false);
    });
});

function sqlError(err) {
    console.log(err);
    new PNotify({
        title: "Erro",
        text: err,
        type: 'error',
        icon: false,
        addclass: "stack-bottomright"
    });
    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
        let userName = sessionStorage.getItem('userName');

        let query = `insert into AuditoriaInterna (componentefoco, codigousuariosistema, ip, 
            maquina, acao, acaopadrao, componente, campo, valorantigo, novovalor, data, usuariopc, 
            formularioativo, sistemaoperacional, versao, pcremoto, codigoregistro, data_cadastro)
            values(null, '${userName}', '${address.ip()}', '${os.hostname}', 'SINCRONIZADOR', 
            null, null, null, '${err}', null, getdate(), '${os.userInfo().username}', null,
            'Versão do Windows: ${os.release()}', '${pjson.version}', null, 'Erro', getdate())
            `;

        pool.request().query(query).then(result => {
            sqlDb.close();
        }).catch(err => {
            sqlDb.close();
        });
    }).catch(err => {
        sqlDb.close();
    });
};