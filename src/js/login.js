const {
    remote,
    ipcRenderer
} = eRequire('electron');
const os = eRequire('os');
const sqlDb = eRequire("mssql");
const fse = eRequire('fs-extra');
const address = eRequire('address');
const pjson = eRequire('./../../package.json');

const mainWin = remote.getCurrentWindow();
const ses = mainWin.webContents.session;

let destPath = 'c:\\softer\\Sincronizador',
    dbOrigin = {},
    dbDest = {},
    config = {};

// fse.mkdirsSync(destPath);
// fse.mkdirsSync(destPath + '\\config');
// fse.mkdirsSync(destPath + '\\tabelas');

fse.readFile(`${destPath}\\config\\config.json`, function (err, data) {
    if (err) {
        ipcRenderer.sendSync('entry-accepted', 'ping');
        return console.log(err);
    }
    let fileRead = fse.readFileSync(`${destPath}\\config\\config.json`, 'utf8');
    config = JSON.parse(fileRead);
});

fse.readFile(`${destPath}\\config\\dbOrigin.json`, function (err, data) {
    if (err) {
        // ipcRenderer.sendSync('entry-accepted', 'ping');
        return console.log(err);
    }
    let fileRead = fse.readFileSync(`${destPath}\\config\\dbOrigin.json`, 'utf8');
    dbOrigin = JSON.parse(fileRead);
});

fse.readFile(`${destPath}\\config\\dbDest.json`, function (err, data) {
    if (err) {
        ipcRenderer.sendSync('entry-accepted', 'ping');
        return console.log(err);
    }
    let fileRead = fse.readFileSync(`${destPath}\\config\\dbDest.json`, 'utf8');
    dbDest = JSON.parse(fileRead);
});

$(function () {

    $('#login_prefix').keyup(function (e) {
        if (e.target.value.length > 1) {
            $('#password_prefix').focus();
        }
    });

    $('#login_prefix').focusin(function (e) {
        $('#login_prefix').val(null);
    });

    $('#password_prefix').keypress(function (e) {
        if (e.which == 13) {
            $('#btn_login').click();
        }
    });

    $('#btn_login').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        var $this = $('#btn_login');
        $this.html('Um momento...').attr('disabled', true);

        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
            pool.request().query("select *, pwdcompare('" + $('#password_prefix').val() + "', senha, 0) as comparedPassword from usuario where codigo = '" + $('#login_prefix').val() + "'").then(result => {
                if (result.recordsets[0].length) {
                    if (result.recordset[0].comparedPassword == '1') {

                        // ses.cookies.set({
                        //     url: 'http://softernet.com.br',
                        //     name: result.recordset[0].login,
                        //     value: os.userInfo().username,
                        //     domain: 'softernet.com.br'
                        // }, (error) => {
                        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {

                            let userName = '';
                            if (sessionStorage.getItem('userName')) {
                                userName = sessionStorage.getItem('userName');
                            } else {
                                sessionStorage.setItem('userName', $('#login_prefix').val());
                            }

                            let query = `insert into AuditoriaInterna (componentefoco, codigousuariosistema, ip, 
                                    maquina, acao, acaopadrao, componente, campo, valorantigo, novovalor, data, usuariopc, 
                                    formularioativo, sistemaoperacional, versao, pcremoto, codigoregistro, data_cadastro)
                                    values('Login_Sincronizador', '${userName}', '${address.ip()}', '${os.hostname}', 'SINCRONIZADOR',
                                    null, null, null, null, null, getdate(), '${os.userInfo().username}', null, 
                                    'Versão do Windows: ${os.release()}', '${pjson.version}', null, null, getdate())`;

                            pool.request().query(query).then(result => {
                                document.getElementById('loginForm').reset();
                                ipcRenderer.sendSync('entry-accepted', 'ping', userName, config.chatServer);
                                sqlDb.close();
                            }).catch(err => {
                                sqlDb.close();
                                let notify = Metro.notify;
                                notify.create(err, 'Atenção', {
                                    cls: 'alert', keepOpen: true, duration: 1000, closeButton: true
                                });
                                notify.reset();
                            });
                        }).catch(err => {
                            sqlDb.close();
                            let notify = Metro.notify;
                            notify.create(err, 'Atenção', {
                                cls: 'alert', keepOpen: true, duration: 1000, closeButton: true
                            });
                            notify.reset();
                        });

                        // console.log('Cookies Set');
                        // ses.cookies.get({
                        //     name: 'userSession'
                        // }, (err, cookies) => {
                        //     console.log(cookies[0].value);
                        // });
                        // });
                    } else {
                        $this.html('Login').attr('disabled', false);
                        // alert('Senha incorreta ou Usuário não encontrado!');
                        let notify = Metro.notify;
                        notify.create('Senha incorreta ou Usuário não encontrado!', 'Atenção', {
                            cls: 'warning', keepOpen: true, duration: 1000, closeButton: true
                        });
                        notify.reset();
                    }
                } else {
                    $this.html('Login').attr('disabled', false);
                    // alert('Senha incorreta ou Usuário não encontrado!');
                    let notify = Metro.notify;
                    notify.create('Senha incorreta ou Usuário não encontrado!', 'Atenção', {
                        cls: 'warning', keepOpen: true, duration: 1000, closeButton: true
                    });
                    notify.reset();
                }

                $this.html('Login').attr('disabled', false);
                sqlDb.close();
            }).catch(err => {
                document.getElementById('loginForm').reset();
                sqlError(err);
                $this.html('Login.').attr('disabled', false);
                let notify = Metro.notify;
                notify.create(err, 'Atenção', {
                    cls: 'alert', keepOpen: true, duration: 1000, closeButton: true
                });
                notify.reset();
            });
        }).catch(err => {
            sqlError(err);
            $this.html('Login').attr('disabled', false);
            let notify = Metro.notify;
            notify.create(err, 'Atenção', {
                cls: 'alert', keepOpen: true, duration: 1000, closeButton: true
            });
            notify.reset();
        });
    });

    // Materialize.updateTextFields();

    setTimeout(() => {
        $('#login_prefix').focus();
    }, 300);

    $('#btn_close').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();
        mainWin.close();
    });
});

function sqlError(err) {
    console.log(err);
    alert(err);
};