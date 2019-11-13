const {
    ipcRenderer,
    remote
} = eRequire('electron');

const mainWin = remote.getCurrentWindow();

const os = eRequire('os');
const fse = eRequire('fs-extra');
const storage = eRequire('electron-json-storage');
const pjson = eRequire('./../../package.json');
const address = eRequire('address');

let destPath = 'c:\\softer\\Sincronizador\\config',
    config = null;
// fse.mkdirsSync(destPath);

$(function () {
    storage.setDataPath(destPath);

    fse.readFile(`${destPath}\\config.json`, function (err, data) {
        if (err) {
            return console.log(err);
        }

        ipcRenderer.send('openLoginWindow', mainWin.id);

        let fileRead = fse.readFileSync(`${destPath}\\config.json`, 'utf8');
        config = JSON.parse(fileRead);

        $('#broadServer').val(config.broadServer);
        $('#chatServer').val(config.chatServer);
        $('#allowNoti').prop('checked', config.allowNoti);

        Materialize.updateTextFields();
    });

    $('#btnConfig').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let params = {
            broadServer: $('#broadServer').val(),
            chatServer: $('#chatServer').val(),
            allowNoti: $('#allowNoti').prop('checked'),
            syncStock: config.syncStock,
            syncActive: config.syncActive,
            syncNewItems: config.syncNewItems,
            syncNewPeople: config.syncNewPeople,
            syncNewProducts: config.syncNewProducts,
            syncComission: config.syncComission,
            syncCost: config.syncCost,
            syncPrice: config.syncPrice,
            canSync: config.canSync,
            canRep: config.canRep,
            syncGroup: config.syncGroup,
            syncCategory: config.syncCategory
        };

        storage.set('config', params, function (error) {
            if (error)
                throw error;

            new PNotify({
                title: "Sucesso",
                text: "Configuração salva. Lembre de recarregar a tela principal.",
                type: 'success',
                icon: false
            });
        });
    });
});

$('#btnCancel').click(function (e) {
    if (e.clientX === 0) {
        return false;
    }
    e.preventDefault();

    let win = remote.getCurrentWindow();
    win.close();
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