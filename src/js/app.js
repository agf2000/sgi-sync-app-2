const {
    ipcRenderer,
    remote,
    session
} = eRequire('electron');
const os = eRequire('os');
const fse = eRequire('fs-extra');
const _ = eRequire("lodash");
const moment = eRequire('moment');
const sqlDb = eRequire("mssql");
const notifier = eRequire('node-notifier');
const path = eRequire('path');
const io = eRequire('socket.io-client');
// const timing = eRequire('timelite');
const storage = eRequire('electron-json-storage');
const pjson = eRequire('./../../package.json');
const address = eRequire('address');
const { zip, unzip } = eRequire('cross-unzip');

let destPath = 'c:\\softer\\Sincronizador';

const mainWin = remote.getCurrentWindow();
const ses = mainWin.webContents.session;

let peopleTableList = '',
    peopleTables = '',
    productsTableList = '',
    productsTables = '',
    itemsTableList = '',
    itemsTables = '',
    done = false,
    dbOrigin = {},
    dbDest = {},
    allowNoti = null,
    broadServer = null,
    syncStock = false,
    syncActive = false,
    syncNewItems = false,
    syncNewProducts = false,
    syncNewPeople = false,
    syncComission = false,
    syncCost = false,
    syncPrice = false,
    syncCategory,
    syncGroup,
    canSync,
    canRep,
    setSync,
    timer,
    startingTime,
    socket = null;

// fse.mkdirsSync(destPath);
// fse.mkdirsSync(destPath + '\\config');
// fse.mkdirsSync(destPath + '\\tabelas');

fse.readFile(`${destPath}\\config\\config.json`, function (err, data) {
    if (err) {
        // new PNotify({
        //     title: "Atenção",
        //     text: "Favor conferir o arquivo de configuração.",
        //     type: 'warning',
        //     icon: false,
        //     addclass: "stack-bottomright"
        // });

        let notify = Metro.notify;
        notify.create("Favor conferir o arquivo de configuração.", "Atenção", {
            cls: "warning", keepOpen: true, duration: 1000
        });
        notify.reset();

        $('.tiles-area').addClass('disabled');
        return console.log(err);
    }

    let fileRead = fse.readFileSync(`${destPath}\\config\\config.json`, 'utf8');
    let config = JSON.parse(fileRead);

    socket = io(`http://${config.chatServer}`);

    // if (config.chatServer !== '') {
    //     socket.on('receivedMessage', message => {
    //         notifier.notify({
    //             title: 'Chat',
    //             message: `${message.author} diz: ${message.message}`,
    //             sound: true, // true | false.
    //             wait: true, // Wait for User Action against Notification
    //             icon: path.join(__dirname, '../img/icon.png'),
    //             // timeout: 10
    //         },
    //             function (err, response) {
    //                 // Response is response from notification
    //                 console.log(response);
    //             }
    //         );

    //         notifier.on('click', function (notifierObject, options) {
    //             ipcRenderer.send('openChatWindow');
    //         });
    //     });
    // }

    syncStock = config.syncStock || false;
    syncActive = config.syncActive || false;
    syncNewItems = config.syncNewItems || false;
    syncNewProducts = config.syncNewProducts || false;
    syncNewPeople = config.syncNewPeople || false;
    syncComission = config.syncComission || false;
    syncCost = config.syncCost || false;
    syncPrice = config.syncPrice || false;
    canSync = config.canSync || false;
    canRep = config.canRep || false;
    syncCategory = config.syncCategory;
    syncGroup = config.syncGroup;
    allowNoti = config.allowNoti || false;
    broadServer = config.broadServer || '';
});

fse.readFile(`${destPath}\\config\\dbOrigin.json`, function (err, data) {
    if (err) {
        // new PNotify({
        //     title: "Atenção",
        //     text: "Favor configrar o servidor de origem.",
        //     type: 'warning',
        //     icon: false,
        //     addclass: "stack-bottomright"
        // });

        let notify = Metro.notify;
        notify.create("Favor configrar o servidor de origem.", "Atenção", {
            cls: "warning", keepOpen: true, duration: 1000
        });
        notify.reset();

        $('.tiles-area').addClass('disabled');
        return console.log(err);
    }

    ipcRenderer.send('openLoginWindow', mainWin.id);

    let fileRead = fse.readFileSync(`${destPath}\\config\\dbOrigin.json`, 'utf8');
    dbOrigin = JSON.parse(fileRead);
});

fse.readFile(`${destPath}\\config\\dbDest.json`, function (err, data) {
    if (err) {
        // new PNotify({
        //     title: "Atenção",
        //     text: "Favor configrar o servidor de destino.",
        //     type: 'warning',
        //     icon: false,
        //     addclass: "stack-bottomright"
        // });

        let notify = Metro.notify;
        notify.create("Favor configrar o servidor de destino.", "Atenção", {
            cls: "warning", keepOpen: true, duration: 1000
        });
        notify.reset();

        return console.log(err);
    }

    let fileRead = fse.readFileSync(`${destPath}\\config\\dbDest.json`, 'utf8');
    dbDest = JSON.parse(fileRead);
});

const peopleFile = `${destPath}\\config\\people_table.txt`,
    productsFile = `${destPath}\\config\\products_table.txt`,
    itemsFile = `${destPath}\\config\\items_table.txt`;

fse.readFile(peopleFile, function (err, data) {
    if (err) {
        // fse.writeFileSync(peopleFile, 'bairro,cadpais,cep,cidade,estado,financeira,fisica,logradouro,obscliente,pessoas,pessoatipocobranca,profissoes,regioes,telefone,tipologradouro,tipopessoa,tipotelefone', 'utf-8');
        return console.log(err);
    }

    peopleTableList = fse.readFileSync(peopleFile, 'utf8');
    peopleTables = peopleTableList.replace(/,\s*$/, "").split(',');
});

fse.readFile(productsFile, function (err, data) {
    if (err) {
        // fse.writeFileSync(productsFile, 'categoria,colecao,custoproduto,grades,grupo,gruposubgrupo,itens_grade,itens_grade_estoque,parametros_produto,produto,produtofornecedor,subgrupo', 'utf-8');
        return console.log(err);
    }

    productsTableList = fse.readFileSync(productsFile, 'utf8');
    productsTables = productsTableList.replace(/,\s*$/, "").split(',');
});

fse.readFile(itemsFile, function (err, data) {
    if (err) {
        // fse.writeFileSync(itemsFile, 'entrada,entradaitens', 'utf-8');
        return console.log(err);
    }

    itemsTableList = fse.readFileSync(itemsFile, 'utf8');
    itemsTables = itemsTableList.replace(/,\s*$/, "").split(',');
});

fse.remove(destPath + '\\tabelas\\', err => {
    if (err) return console.error(err)

    console.log('deleted all table files!') // I just deleted my entire HOME directory.
});

var stack_topleft = {
    "dir1": "down",
    "dir2": "right",
    "push": "top"
};

$(() => {

    // console.log(destPath);
    storage.setDataPath(destPath);

    storage.remove(destPath + '\\tabelas', function (error) {
        if (error) throw error;
    });

    setTimeout(function () {
        if (allowNoti) {
            $('#divBackupTile').removeClass('tile-wide').addClass('tile-medium');
            $('#divNotyStartTile, #divNotyEndTile, #divStartChatTile').removeClass('d-none');
        }

        const alertOnlineStatus = () => {
            if (!navigator.onLine) {
                // $('#btnStartNotification, #btnEndNotification, #btnBackup').prop('disabled', true);

                window.alert('Sem internet');
            }
        }

        // window.addEventListener('online', alertOnlineStatus)
        // window.addEventListener('offline', alertOnlineStatus)

        alertOnlineStatus();
        $('#appVersion').html(`${pjson.version}`);
        mainWin.setAutoHideMenuBar(true);
        // $('#login_prefix').focus();
    }, 200);

});

function getPeople(btn, infoBox) {
    let $btn = btn,
        start = new Date(),
        starting = new Date(),
        sqlGet = '';

    // Iterating thru the list of peopleTables
    _.forEach(peopleTables, function (item, index) {
        sqlGet += `select * from sinc_${item}_view; `;
    });

    new sqlDb.ConnectionPool(dbOrigin).connect().then(pool => {
        $('.info-box-content').append(`<div class="mt-1">Adiquirindo dados de pessoas as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

        pool.request().query(sqlGet).then(data => {
            starting = new Date();

            let counter = peopleTables.length;
            storage.setDataPath(destPath + '\\tabelas');
            _.forEach(peopleTables, function (item, index) {
                if (data.recordsets[index].length) {
                    storage.set(item, data.recordsets[index], function (error) {
                        if (error)
                            throw error;
                        console.log(`Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);

                        let columns = '';
                        _.forEach(data.recordsets[index].columns, function (column, i) {
                            columns += column.name + ',';
                        });
                        columns = `${columns.replace(/,\s*$/, "")}`;

                        storage.set(item + '_columns', columns, function (error) {
                            if (error)
                                throw error;

                            starting = new Date();
                            counter = counter - 1;
                            if (counter == 0) {
                                $('.info-box-content').append(`<div class="mt-1">Dados de pessoas adiquiridos em ${n(dateDiff(start.getTime()).minute)}:${n(dateDiff(start.getTime()).second)}.</div>`);
                                sqlDb.close();
                                importPeople($btn, infoBox);
                            }
                        });
                    });
                } else {
                    counter = counter - 1;

                    if (counter == 0) {
                        $('.info-box-content').append(`<div class="mt-1">Tabela ${item} vazia.</div>`);
                        done = true;
                        sqlDb.close();
                        clearInterval(myVal);
                        clearInterval(timer);
                        mainWin.setProgressBar(1.0);
                        mainWin.setProgressBar(0);
                    }
                }
            });

        }).catch(err => {
            sqlError(err, infoBox);
        });
    }).catch(err => {
        sqlError(err, infoBox);
    });
};

function importPeople(btn, infoBox) {
    let $btn = btn,
        counter = peopleTables.length,
        start = new Date(),
        starting = new Date(),

        myVal = setInterval(function () {
            if (done) {
                clearInterval(myVal);
            } else {
                if (dateDiff(starting.getTime()).minute >= 1) {
                    switch (dateDiff(starting.getTime()).minute) {
                        case 5:
                            $('.info-box-content').append(`<div class="mt-1">Finanlizando replicaçao de milhares de dados. Aguarde..</div>`);
                            break;
                        case 2:
                            $('.info-box-content').append(`<div class="mt-1">Replicando milhares de dados. Aguarde...</div>`);
                            break;
                        case 3:
                            $('.info-box-content').append(`<div class="mt-1">Replicação ainda em andamento. Aguarde...</div>`);
                            break;
                        default:
                            $('.info-box-content').append(`<div class="mt-1">Replicação de dados em andamento. Aguarde...</div>`);
                            break;
                    }
                }
            }
        }, 60000);

    $('.info-box-content').append(`<div class="mt-1">Replicando <span id="liPeople">${peopleTables.length}</span> de ${peopleTables.length} tabelas ${moment(new Date()).format('HH:mm:ss')}</div>`);

    // Iterating thru the list of peopleTables
    _.forEach(peopleTables, function (table, index) {

        const file = `${destPath}\\tabelas\\${table}.json`;

        fse.pathExists(file, (err, exists) => {
            if (exists) {

                let theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                console.log(JSON.parse(dataFromFile).length + ' em ' + table);

                let sqlInst = ''; // `set language portuguese; waitfor delay \'00:00:05\'; `;

                sqlInst += `delete from ${table}; `;
                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                sqlInst += `set identity_insert ${table} on; `;
                sqlInst += `declare @list_${table + '_' + index} varchar(max); `;

                _.forEach(jsonData, function (parts) {

                    sqlInst += `set @list_${table + '_' + index} = `;

                    let sqlSel = `'`;
                    _.forEach(parts, function (data) {

                        sqlSel += `select `;
                        let sqlSelIn = '';
                        sqlSelIn = formatValue1(data, sqlSelIn);
                        sqlSel += sqlSelIn.replace(/,\s*$/, " ");
                    });

                    sqlInst += `${sqlSel}'; insert into ${table} (`;

                    sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table + '_' + index}); `;
                });

                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
                sqlInst += `set identity_insert ${table} off; `;

                // adding to sql database
                new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                    pool.request().query(sqlInst).then(result => {
                        console.log(`Replicado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                        starting = new Date();

                        counter = counter - 1;

                        $('#liPeople').html(counter);

                        if (counter == 0) {

                            done = true;

                            let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                            $('.info-box-content').append(`<div class="mt-1">Dados de pessoas replicados em ${totalTiming}.</div>`);

                            if ($($btn).attr('data-value') == 'startRep') {
                                $('#divReplicateTile').addClass('disabled selected');
                                $('#divReplicateTile').next().addClass('disabled selected');
                                $('#divSyncTile').addClass('disabled selected');
                                $('#divSyncTile').next().addClass('disabled selected');
                                if (syncNewProducts) {
                                    getProducts($btn, infoBox);
                                    $('#divReplicateTile').next().next().addClass('disabled selected');
                                } else if (syncNewItems) {
                                    getItems($btn, infoBox);
                                    $('#divReplicateTile').next().next().next().addClass('disabled selected');
                                } else {
                                    endPeopleRep(infoBox);
                                    $('#divReplicateTile').next().addClass('disabled selected');
                                    $('#divReplicateTile').addClass('disabled selected');
                                }
                            } else {
                                endPeopleRep(infoBox);
                                $('#divReplicateTile').next().addClass('disabled selected');
                                if (syncNewProducts) {
                                    $('#divReplicateTile').next().next().removeClass('disabled').removeClass('bg-steel').addClass('bg-cyan');
                                }
                            }
                        }
                    }).catch(err => {
                        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                            pool.request().query(sqlEndInst).then(result => {

                                infoBox.data('infobox').setType('alert');
                                $('#barProgress').addClass('d-none');
                                $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                infoBox.append('<span class="button square closer"></span>');
                                sqlDb.close();
                            }).catch(err => {
                                sqlError(err, infoBox);
                            });
                        }).catch(err => {
                            sqlError(err, infoBox);
                        });

                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                }).catch(err => {
                    sqlError(err, infoBox);
                    clearInterval(myVal);
                    clearInterval(timer);
                });
                // end of adding
            } else {
                counter = counter - 1;
            }
        });
    });

    function endPeopleRep(infoBox) {
        sqlDb.connect(dbDest).then(pool => {
            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
            pool.request().query(sqlEndInst).then(result => {
                // console.log(result);

                infoBox.data('infobox').setType('success');
                $('#barProgress').addClass('d-none');
                $('.info-box-content').append(`<div class="mt-1">Replicação executada com sucesso.</div>`);
                infoBox.append('<span class="button square closer"></span>');
                // $('#divReplicateTile').addClass('disabled').addClass('selected');
                // $('#divReplicateTile').next().addClass('disabled').addClass('selected');
                $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');

                sqlDb.close();
                clearInterval(myVal);
                clearInterval(timer);
                mainWin.setProgressBar(1.0);
                mainWin.setProgressBar(0);

                if (!mainWin.isFocused()) {
                    notifier.notify({
                        title: 'Sincronizador',
                        message: 'Dados replicados com sucesso.',
                        sound: true,
                        wait: true,
                        icon: path.join(__dirname, '../img/icon.png'),
                    }, function (err, response) {
                        // Response is response from notification
                        console.log(response);
                    });
                    notifier.on('click', function (notifierObject, options) {
                        mainWin.focus();
                    });
                }
                // if (syncNewProducts) {
                //     $('#divReplicateTile').next().next().removeClass('disabled').removeClass('bg-steel').addClass('bg-orange');
                // }
            }).catch(err => {
                sqlError(err, infoBox);
                clearInterval(myVal);
                clearInterval(timer);
            });
        }).catch(err => {
            sqlError(err, infoBox);
            clearInterval(myVal);
            clearInterval(timer);
        });
    }
};

function getProducts(btn, infoBox) {
    let $btn = btn,
        start = new Date(),
        starting = new Date(),
        sqlGet = '';

    // Iterating thru the list of productsTables
    _.forEach(productsTables, function (item, index) {
        switch (item) {
            case 'produtofornecedor':
                if (syncNewPeople) {
                    sqlGet += `select * from sinc_${item}_view; `;
                } else {
                    productsTables = productsTables.filter(e => e !== 'produtofornecedor');
                }
                break;
            case 'custoproduto':
                if (syncCost) {
                    sqlGet += `select * from sinc_${item}_view; `;
                } else {
                    productsTables = productsTables.filter(e => e !== 'custoproduto');
                }
                break;
            case 'produto':
                sqlGet += `select p.* from sinc_${item}_view p `;

                if (syncGroup) {
                    sqlGet += `left outer join grupo g on g.codigo = p.grupo`;
                }
                if (syncCategory) {
                    sqlGet += `left outer join categoria c on c.codigo = p.categoria`;
                }

                sqlGet += ' where 1 = 1 ';

                if (syncGroup) {
                    sqlGet += `and not isnull(g.nome, '') = '${syncGroup}' `;
                }
                if (syncCategory) {
                    sqlGet += `and not isnull(c.sigla, '') = '${syncCategory}' `;
                }

                sqlGet += `order by p.data_cadastro desc; `;
                break;
            default:
                sqlGet += `select * from sinc_${item}_view; `;
                break;
        };
    });

    new sqlDb.ConnectionPool(dbOrigin).connect().then(pool => {
        $('.info-box-content').append(`<div class="mt-1">Adiquirindo dados de produtos as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

        pool.request().query(sqlGet).then(data => {
            starting = new Date();

            let counter = productsTables.length;
            _.forEach(productsTables, function (item, index) {
                if (data.recordsets[index].length) {
                    storage.set(item, data.recordsets[index], function (error) {
                        if (error)
                            throw error;
                        console.log(`Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);

                        let columns = '';
                        _.forEach(data.recordsets[index].columns, function (column, i) {
                            columns += column.name + ',';
                        });
                        columns = `${columns.replace(/,\s*$/, "")}`;

                        storage.set(item + '_columns', columns, function (error) {
                            if (error)
                                throw error;

                            starting = new Date();
                            counter = counter - 1;
                            if (counter == 0) {
                                $('.info-box-content').append(`<div class="mt-1">Dados de produtos adiquirido em ${n(dateDiff(start.getTime()).minute)}:${n(dateDiff(start.getTime()).second)}.</div>`);
                                sqlDb.close();
                                importProducts($btn, infoBox);
                            }
                        });
                    });
                } else {
                    counter = counter - 1;

                    if (counter == 0) {
                        $('.info-box-content').append(`<div class="mt-1">Tabela ${item} vazia.</div>`);
                        done = true;
                        sqlDb.close();
                        clearInterval(myVal);
                        clearInterval(timer);
                        mainWin.setProgressBar(1.0);
                        mainWin.setProgressBar(0);
                    }
                }
            });

        }).catch(err => {
            sqlError(err, infoBox);
        });
    }).catch(err => {
        sqlError(err, infoBox);
    });
};

function importProducts(btn, infoBox) {
    let $btn = btn,
        counter = productsTables.length,
        start = new Date(),
        starting = new Date(),

        myVal = setInterval(function () {
            if (done) {
                clearInterval(myVal);
            } else {
                if (dateDiff(starting.getTime()).minute >= 1) {
                    switch (dateDiff(starting.getTime()).minute) {
                        case 2:
                            $('.info-box-content').append(`<div class="mt-1">Replicando milhares de produtos. Aguarde...</div>`);
                            break;
                        case 3:
                            $('.info-box-content').append(`<div class="mt-1">Replicação ainda em andamento. Aguarde...</div>`);
                            break;
                        default:
                            $('.info-box-content').append(`<div class="mt-1">Replicação de produtos em andamento. Aguarde...</div>`);
                            break;
                    }
                }
            }
        }, 60000);

    $('.info-box-content').append(`<div class="mt-1">Replicando <span id="liProducts">${productsTables.length}</span> de ${productsTables.length} tabelas as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

    // Iterating thru the list of productsTables
    _.forEach(productsTables, function (table, index) {

        let sqlInst = ''; // `set language portuguese; waitfor delay \'00:00:05\'; `;

        sqlInst += `delete from ${table}; `;
        sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
        sqlInst += `set identity_insert ${table} on; `;

        const file = `${destPath}\\tabelas\\${table}.json`;

        fse.pathExists(file, (err, exists) => {
            if (err) throw new Error;

            if (exists) {
                let theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                console.log(JSON.parse(dataFromFile).length + ' em ' + table);

                sqlInst += `declare @list_${table + '_' + index.toString()} varchar(max); `;

                _.forEach(jsonData, function (parts) {

                    sqlInst += `set @list_${table + '_' + index.toString()} = `;

                    let sqlSel = `'`;
                    _.forEach(parts, function (data) {

                        sqlSel += `select `;
                        let sqlSelIn = '';
                        _.forEach(data, function (value, key) {
                            if (key == 'referencia' || key == 'refxml') {
                                if (value == null) {
                                    sqlSelIn += `${null}, `;
                                } else if (isNaN(value)) {
                                    sqlSelIn += `''${value}'', `;
                                } else {
                                    sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                                }
                            } else {
                                if (value == null) {
                                    sqlSelIn += `${null}, `;
                                } else if (value instanceof Date) {
                                    sqlSelIn += `''${moment(value).format('DD/MM/YYYY HH:mm')}'', `;
                                } else if (isNaN(value)) {
                                    sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                                } else if (value == true) {
                                    sqlSelIn += `1, `;
                                } else if (value == false) {
                                    sqlSelIn += `0, `;
                                } else {
                                    if (value.length > 10) {
                                        sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                                    } else {
                                        sqlSelIn += `${value}, `;
                                    }
                                }
                            }
                        });
                        sqlSel += sqlSelIn.replace(/,\s*$/, " ");
                    });

                    sqlInst += `${sqlSel}'; insert into ${table} (`;

                    sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table + '_' + index.toString()}); `;
                });

                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
                sqlInst += `set identity_insert ${table} off; `;

                // adding to sql database
                new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                    pool.request().query(sqlInst).then(result => {
                        console.log(`Replicado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                        starting = new Date();

                        counter = counter - 1;

                        $('#liProducts').html(counter);

                        if (counter == 0) {

                            done = true;

                            let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                            $('.info-box-content').append(`<div class="mt-1">Dados de produtos replicados em ${totalTiming}.</div>`);

                            if ($($btn).attr('data-value') == 'startRep') {
                                if (syncNewItems) {
                                    getItems($btn, infoBox);
                                } else {
                                    endProductsRep(infoBox);
                                    let totalTiming = moment.utc(moment(new Date()).diff(moment(startingTime))).format('mm:ss');
                                    $('.info-box-content').append(`<div class="mt-1">Tempo total: ${totalTiming}.</div>`);
                                }
                            } else {
                                endProductsRep(infoBox);
                                $('#divReplicateTile').next().next().addClass('disabled selected');
                                if (syncNewItems) {
                                    $('#divReplicateTile').next().next().next().removeClass('disabled').removeClass('bg-steel').addClass('bg-orange');
                                }
                            }
                        }
                    }).catch(err => {
                        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                            pool.request().query("exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;").then(result => {
                                // console.log(result);
                                infoBox.data('infobox').setType('alert');
                                $('#barProgress').addClass('d-none');
                                $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                infoBox.append('<span class="button square closer"></span>');
                                sqlDb.close();
                            }).catch(err => {
                                sqlError(err, infoBox);
                            });
                        });

                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                }).catch(err => {
                    sqlError(err, infoBox);
                    clearInterval(myVal);
                    clearInterval(timer);
                });
                // end of adding
            } else {
                counter = counter - 1;
            }
        });
    });

    function endProductsRep(infoBox) {
        sqlDb.connect(dbDest).then(pool => {
            pool.request().query("exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;").then(result => {
                // console.log(result);

                infoBox.data('infobox').setType('success');
                $('#barProgress').addClass('d-none');
                $('.info-box-content').append(`<div class="mt-1">Replicação executada com sucesso.</div>`);
                infoBox.append('<span class="button square closer"></span>');
                // $('#divReplicateTile').next().next().addClass('disabled').addClass('selected');
                // $('#divReplicateTile').addClass('disabled').addClass('selected');
                $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');

                sqlDb.close();
                clearInterval(myVal);
                clearInterval(timer);
                mainWin.setProgressBar(1.0);
                mainWin.setProgressBar(0);

                if (!mainWin.isFocused()) {
                    notifier.notify({
                        title: 'Sincronizador',
                        message: 'Dados replicados com sucesso.',
                        sound: true,
                        wait: true,
                        icon: path.join(__dirname, '../img/icon.png'),
                    }, function (err, response) {
                        // Response is response from notification
                        console.log(response);
                    });
                    notifier.on('click', function (notifierObject, options) {
                        mainWin.focus();
                    });
                }
            }).catch(err => {
                sqlError(err, infoBox);
                clearInterval(myVal);
                clearInterval(timer);
            });
        }).catch(err => {
            sqlError(err, infoBox);
            clearInterval(myVal);
            clearInterval(timer);
        });
    }
};

function getItems(btn, infoBox) {
    let $btn = btn,
        start = new Date(),
        starting = new Date(),
        sqlGet = '';

    // Iterating thru the list of itemsTables
    _.forEach(itemsTables, function (item, index) {
        sqlGet += `select * from sinc_${item}_view; `;
    });

    new sqlDb.ConnectionPool(dbOrigin).connect().then(pool => {
        $('.info-box-content').append(`<div class="mt-1">Adiquirindo entradas ${moment(new Date()).format('HH:mm:ss')}.</div>`);

        pool.request().query(sqlGet).then(data => {
            starting = new Date();

            let counter = itemsTables.length;
            storage.setDataPath(destPath + '\\tabelas');
            _.forEach(itemsTables, function (item, index) {
                if (data.recordsets[index].length) {
                    storage.set(item, data.recordsets[index], function (error) {
                        if (error)
                            throw error;
                        console.log(`Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);

                        let columns = '';
                        _.forEach(data.recordsets[index].columns, function (column, i) {
                            columns += column.name + ',';
                        });
                        columns = `${columns.replace(/,\s*$/, "")}`;

                        storage.set(item + '_columns', columns, function (error) {
                            if (error)
                                throw error;

                            starting = new Date();
                            counter = counter - 1;
                            if (counter == 0) {
                                $('.info-box-content').append(`<div class="mt-1">Dados de entradas adiquiridos em ${n(dateDiff(start.getTime()).minute)}:${n(dateDiff(start.getTime()).second)}.</div>`);
                                sqlDb.close();
                                importItems($btn, infoBox);
                            }
                        });
                    });
                } else {
                    counter = counter - 1;

                    if (counter == 0) {
                        $('.info-box-content').append(`<div class="mt-1">Tabela ${item} vazia.</div>`);
                        done = true;
                        sqlDb.close();
                        clearInterval(myVal);
                        clearInterval(timer);
                        mainWin.setProgressBar(1.0);
                        mainWin.setProgressBar(0);
                    }
                }
            });

        }).catch(err => {
            sqlError(err, infoBox);
        });
    }).catch(function (err) {
        sqlError(err, infoBox);
    });
};

function importItems(btn, infoBox) {
    let $btn = btn,
        counter = itemsTables.length,
        start = new Date(),
        starting = new Date(),

        myVal = setInterval(function () {
            if (done) {
                clearInterval(myVal);
            } else {
                if (dateDiff(starting.getTime()).minute >= 1) {
                    switch (dateDiff(starting.getTime()).minute) {
                        case 5:
                            $('.info-box-content').append(`<div class="mt-1">Finalizando replicação milhares de dados de produtos. Aguarde...</div>`);
                            break;
                        case 2:
                            $('.info-box-content').append(`<div class="mt-1">Replicando milhares de items. Aguarde...</div>`);
                            break;
                        case 3:
                            $('.info-box-content').append(`<div class="mt-1">Replicação ainda em andamento. Aguarde...</div>`);
                            break;
                        default:
                            $('.info-box-content').append(`<div class="mt-1">Replicação de items em andamento. Aguarde...</div>`);
                            break;
                    }
                }
            }
        }, 60000);

    $('.info-box-content').append(`<div class="mt-1">Replicando <span id="liItems">${itemsTables.length}</span> de ${itemsTables.length} tabelas as ${moment(new Date()).format('HH:mm:ss')}</div>`);

    // Iterating thru the list of itemsTables
    _.forEach(itemsTables, function (table, index) {

        const file = `${destPath}\\tabelas\\${table}.json`;

        fse.pathExists(file, (err, exists) => {
            if (exists) {

                let theColumns;
                theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                console.log(JSON.parse(dataFromFile).length + ' em ' + table);

                let sqlInst = ''; // `set language portuguese; waitfor delay \'00:00:05\'; `;

                sqlInst += `delete from ${table}; `;
                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                sqlInst += `set identity_insert ${table} on; `;
                sqlInst += `declare @list_${table + '_' + index} varchar(max); `;

                _.forEach(jsonData, function (parts) {

                    sqlInst += `set @list_${table + '_' + index} = `;

                    let sqlSel = `'`;
                    _.forEach(parts, function (data) {
                        sqlSel += `select `;
                        let sqlSelIn = '';
                        sqlSelIn = formatValue1(data, sqlSelIn);
                        sqlSel += sqlSelIn.replace(/,\s*$/, " ");
                    });

                    sqlInst += `${sqlSel}'; insert into ${table} (`;

                    sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table + '_' + index}); `;
                });

                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
                sqlInst += `set identity_insert ${table} off; `;

                // adding to sql database
                new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                    pool.request().query(sqlInst).then(result => {
                        console.log(`Replicado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                        starting = new Date();

                        counter = counter - 1;

                        $('#liItems').html(counter);

                        if (counter == 0) {

                            done = true;

                            let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                            $('.info-box-content').append(`<div class="mt-1">Dados de entrada replicados em ${totalTiming}.</div>`);

                            sqlDb.connect(dbDest).then(pool => {
                                let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                                pool.request().query(sqlEndInst).then(result => {
                                    // console.log(result);

                                    if ($($btn).attr('data-value') == 'startRep') {
                                        let totalTiming = moment.utc(moment(new Date()).diff(moment(startingTime))).format('mm:ss');
                                        $('.info-box-content').append(`<div class="mt-1">Tempo total: ${totalTiming}.</div>`);
                                    }

                                    infoBox.data('infobox').setType('success');
                                    $('#barProgress').addClass('d-none');
                                    $('.info-box-content').append(`<div class="mt-1">Replicação executada com sucesso.</div>`);
                                    infoBox.append('<span class="button square closer"></span>');
                                    $('#divReplicateTile').next().next().next().addClass('disabled selected');
                                    $('#divReplicateTile').addClass('disabled selected');
                                    $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');

                                    sqlDb.close();
                                    clearInterval(myVal);
                                    clearInterval(timer);
                                    mainWin.setProgressBar(1.0);
                                    mainWin.setProgressBar(0);

                                    if (!mainWin.isFocused()) {
                                        notifier.notify({
                                            title: 'Sincronizador',
                                            message: 'Dados replicados com sucesso.',
                                            sound: true, // true | false.
                                            wait: true, // Wait for User Action against Notification
                                            icon: path.join(__dirname, '../img/icon.png'),
                                            // timeout: 10
                                        },
                                            function (err, response) {
                                                // Response is response from notification
                                                console.log(response);
                                            });
                                        notifier.on('click', function (notifierObject, options) {
                                            mainWin.focus();
                                        });
                                    }
                                }).catch(err => {
                                    sqlError(err, infoBox);
                                    clearInterval(myVal);
                                    clearInterval(timer);
                                });
                            }).catch(err => {
                                sqlError(err, infoBox);
                                clearInterval(myVal);
                                clearInterval(timer);
                            });
                        }
                    }).catch(err => {

                        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                            pool.request().query(sqlEndInst).then(result => {
                                // console.log(result);

                                infoBox.data('infobox').setType('alert');
                                $('#barProgress').addClass('d-none');
                                $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                infoBox.append('<span class="button square closer"></span>');

                                sqlDb.close();
                            }).catch(err => {
                                sqlError(err, infoBox);
                            });
                        }).catch(err => {
                            sqlError(err, infoBox);
                        });

                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                }).catch(function (err) {
                    sqlError(err, infoBox);
                    clearInterval(myVal);
                });
                // end of adding
            } else {
                counter = counter - 1;
            }
        });
    });
};

function getPeopleSync(btn, infoBox) {
    let $btn = btn,
        start = new Date(),
        starting = new Date(),
        sqlGet = '';

    // Iterating thru the list of peopleTables
    _.forEach(peopleTables, function (item, index) {
        sqlGet += `select * from sinc_${item}_view; `;
    });

    new sqlDb.ConnectionPool(dbOrigin).connect().then(pool => {
        $('.info-box-content').append(`<div class="mt-1">Adiquirindo dados de pessoas as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

        pool.request().query(sqlGet).then(data => {
            starting = new Date();

            let counter = peopleTables.length;
            storage.setDataPath(destPath + '\\tabelas');
            _.forEach(peopleTables, function (item, index) {
                if (data.recordsets[index].length) {
                    storage.set(item, data.recordsets[index], function (error) {
                        if (error)
                            throw error;

                        // $('.info-box-content').append(`<div class="mt-1">Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})</div>`);
                        console.log(`Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);

                        let columns = '';
                        _.forEach(data.recordsets[index].columns, function (column, i) {
                            columns += column.name + ',';
                        });
                        columns = `${columns.replace(/,\s*$/, "")}`;

                        storage.set(item + '_columns', columns, function (error) {
                            if (error)
                                throw error;

                            starting = new Date();
                            counter = counter - 1;
                            if (counter == 0) {
                                $('.info-box-content').append(`<div class="mt-1">Dados de pessoas adiquiridos em ${n(dateDiff(start.getTime()).minute)}:${n(dateDiff(start.getTime()).second)}.</div>`);
                                sqlDb.close();
                                importPeopleSync($btn, infoBox);
                            }
                        });
                    });
                } else {
                    counter = counter - 1;

                    if (counter == 0) {
                        infoBox.data('infobox').setContent(`Tabela ${item} vazia.`);
                        done = true;
                        sqlDb.close();
                        clearInterval(myVal);
                        clearInterval(timer);
                        mainWin.setProgressBar(1.0);
                        mainWin.setProgressBar(0);
                    }
                }
            });
        }).catch(err => {
            sqlError(err, infoBox);
        });
    }).catch(function (err) {
        sqlError(err, infoBox);
    });
};

function importPeopleSync(btn, infoBox) {
    let $btn = btn,
        counter = peopleTables.length,
        start = new Date(),
        starting = new Date(),

        myVal = setInterval(function () {
            if (done) {
                clearInterval(myVal);
            } else {
                if (dateDiff(starting.getTime()).minute >= 1) {
                    switch (dateDiff(starting.getTime()).minute) {
                        case 5:
                            $('.info-box-content').append(`<div class="mt-1">Finalizando sincronização de milhares de dados. Aguarde..</div>`);
                            break;
                        case 2:
                            $('.info-box-content').append(`<div class="mt-1">Sincronizando milhares de dados. Aguarde...</div>`);
                            break;
                        case 3:
                            $('.info-box-content').append(`<div class="mt-1">Sincronização ainda em andamento. Aguarde...</div>`);
                            break;
                        default:
                            $('.info-box-content').append(`<div class="mt-1">Sincronização de dados em andamento. Aguarde....</div>`);
                            break;
                    }
                }
            }
        }, 60000);

    $('.info-box-content').append(`<div class="mt-1">Sincronizando <span id="liPeople">${peopleTables.length}</span> de ${peopleTables.length} tabelas as ${moment(new Date()).format('HH:mm:ss')}</div>`);

    // Iterating thru the list of peopleTables
    _.forEach(peopleTables, function (table, index) {

        const file = `${destPath}\\tabelas\\${table}.json`;

        fse.pathExists(file, (err, exists) => {
            if (exists) {

                let theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                console.log(JSON.parse(dataFromFile).length + ' items em ' + table);

                let sqlInst = ''; // `set language portuguese; waitfor delay \'00:00:05\'; `;

                sqlInst += `delete from ${table}; `;
                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                sqlInst += `set identity_insert ${table} on; `;
                sqlInst += `declare @list_${table + '_' + index} varchar(max); `;

                _.forEach(jsonData, function (parts) {

                    sqlInst += `set @list_${table + '_' + index} = `;

                    let sqlSel = `'`;
                    _.forEach(parts, function (data) {
                        sqlSel += `select `;
                        let sqlSelIn = '';
                        sqlSelIn = formatValue1(data, sqlSelIn);
                        sqlSel += sqlSelIn.replace(/,\s*$/, " ");
                    });

                    sqlInst += `${sqlSel}'; insert into ${table} (`;

                    sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table + '_' + index}); `;
                });

                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
                sqlInst += `set identity_insert ${table} off; `;

                // adding to sql database
                new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                    pool.request().query(sqlInst).then(result => {
                        console.log(`Sincronizado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                        starting = new Date();

                        counter = counter - 1;

                        $('#liPeople').html(counter);

                        if (counter == 0) {

                            done = true;

                            let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                            $('.info-box-content').append(`<div class="mt-1">Dados de pessoas sincronizados em ${totalTiming}.</div>`);

                            if ($($btn).attr('data-value') == 'startSync') {
                                $('#divReplicateTile').addClass('disabled selected');
                                $('#divReplicateTile').next().addClass('disabled selected');
                                $('#divSyncTile').addClass('disabled selected');
                                $('#divSyncTile').next().addClass('disabled selected');
                                if (syncNewProducts) {
                                    getProductsSync($btn, infoBox);
                                    $('#divSyncTile').next().addClass('disabled selected');
                                    $('#divSyncTile').next().next().addClass('disabled selected');
                                } else if (syncNewItems) {
                                    getItemsSync($btn, infoBox);
                                    $('#divSyncTile').next().next().next().addClass('disabled selected');
                                } else {
                                    endPeopleSync(infoBox);
                                    $('#divSyncTile').next().addClass('disabled selected');
                                    $('#divSyncTile').addClass('disabled selected');
                                }
                            } else {
                                endPeopleSync(infoBox);
                                $('#divSyncTile').next().addClass('disabled selected');
                                if (syncNewProducts) {
                                    $('#divSyncTile').next().next().removeClass('disabled').removeClass('bg-steel').addClass('bg-cyan');
                                }
                            }
                        }
                    }).catch(err => {
                        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                            pool.request().query(sqlEndInst).then(result => {
                                // console.log(result);

                                infoBox.data('infobox').setType('alert');
                                $('#barProgress').addClass('d-none');
                                $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                infoBox.append('<span class="button square closer"></span>');
                                sqlDb.close();

                            }).catch(err => {
                                sqlError(err, infoBox);
                            });
                        }).catch(err => {
                            sqlError(err, infoBox);
                        });

                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                }).catch(function (err) {
                    sqlError(err, infoBox);
                });
                // end of adding
            } else {
                counter = counter - 1;
            }
        });
    });

    function endPeopleSync(infoBox) {
        sqlDb.connect(dbDest).then(pool => {
            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
            pool.request().query(sqlEndInst).then(result => {
                // console.log(result);

                infoBox.data('infobox').setType('success');
                $('#barProgress').addClass('d-none');
                $('.info-box-content').append(`<div class="mt-1">Sincronização executada com sucesso.</div>`);
                infoBox.append('<span class="button square closer"></span>');
                $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');

                sqlDb.close();
                clearInterval(myVal);
                clearInterval(timer);
                mainWin.setProgressBar(1.0);
                mainWin.setProgressBar(0);

                if (!mainWin.isFocused()) {
                    notifier.notify({
                        title: 'Sincronizador',
                        message: 'Dados sincronizados com sucesso.',
                        sound: true,
                        wait: true,
                        icon: path.join(__dirname, '../img/icon.png'),
                    }, function (err, response) {
                        // Response is response from notification
                        console.log(response);
                    });
                    notifier.on('click', function (notifierObject, options) {
                        mainWin.focus();
                    });
                }
            }).catch(err => {
                sqlError(err, infoBox);
                clearInterval(myVal);
                clearInterval(timer);
            });
        }).catch(err => {
            sqlError(err, infoBox);
            clearInterval(myVal);
            clearInterval(timer);
        });
    }
};

function getProductsSync(btn, infoBox) {
    let $btn = btn,
        start = new Date(),
        starting = new Date(),
        sqlGet = '';

    // Iterating thru the list of productsTables
    _.forEach(productsTables, function (item, index) {
        switch (item) {
            case 'produtofornecedor':
                if (syncNewPeople) {
                    sqlGet += `select * from sinc_${item}_view; `;
                } else {
                    productsTables = productsTables.filter(e => e !== 'produtofornecedor');
                }
                break;
            case 'custoproduto':
                if (syncCost) {
                    sqlGet += `select * from sinc_${item}_view; `;
                } else {
                    productsTables = productsTables.filter(e => e !== 'custoproduto');
                }
                break;
            case 'produto':
                sqlGet += `select p.* from sinc_${item}_view p `;

                if (syncGroup) {
                    sqlGet += `left outer join grupo g on g.codigo = p.grupo`;
                }
                if (syncCategory) {
                    sqlGet += `left outer join categoria c on c.codigo = p.categoria`;
                }

                sqlGet += ' where isnull(p.sinc, 0) = 0 ';

                if (syncGroup) {
                    sqlGet += `and not isnull(g.nome, '') = '${syncGroup}' `;
                }
                if (syncCategory) {
                    sqlGet += `and not isnull(c.sigla, '') = '${syncCategory}' `;
                }

                sqlGet += `order by p.data_cadastro desc; `;
                break;
            default:
                sqlGet += `select * from sinc_${item}_view; `;
                break;
        };
    });

    new sqlDb.ConnectionPool(dbOrigin).connect().then(pool => {
        $('.info-box-content').append(`<div class="mt-1">Adiquirindo dados de produtos as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

        pool.request().query(sqlGet).then(data => {

            starting = new Date();

            let counter = productsTables.length;
            storage.setDataPath(destPath + '\\tabelas');
            _.forEach(productsTables, function (item, index) {
                if (data.recordsets[index].length) {
                    storage.set(item, data.recordsets[index], function (error) {
                        if (error)
                            throw error;
                        console.log(`Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);

                        let columns = '';
                        _.forEach(data.recordsets[index].columns, function (column, i) {
                            columns += column.name + ',';
                        });
                        columns = `${columns.replace(/,\s*$/, "")}`;

                        storage.set(item + '_columns', columns, function (error) {
                            if (error)
                                throw error;

                            starting = new Date();
                            counter = counter - 1;
                            if (counter == 0) {
                                $('.info-box-content').append(`<div class="mt-1">Dados de produtos adiquiridos em ${n(dateDiff(start.getTime()).minute)}:${n(dateDiff(start.getTime()).second)}.</div>`);
                                sqlDb.close();
                                importProductsSync($btn, infoBox);
                            }
                        });
                    });
                } else {
                    counter = counter - 1;

                    if (counter == 0) {
                        $('.info-box-content').append(`<div class="mt-1">Tabela ${item} vazia.</div>`);
                        done = true;
                        sqlDb.close();
                        clearInterval(myVal);
                        clearInterval(timer);
                        mainWin.setProgressBar(1.0);
                        mainWin.setProgressBar(0);
                    }
                }
            });

        }).catch(err => {
            sqlError(err, infoBox);
        });
    }).catch(function (err) {
        sqlError(err, infoBox);
    });
};

function importProductsSync(btn, infoBox) {
    let $btn = btn,
        counter = productsTables.length,
        start = new Date(),
        starting = new Date(),
        sqlInst = '',

        myVal = setInterval(function () {
            if (done) {
                clearInterval(myVal);
            } else {
                if (dateDiff(starting.getTime()).minute >= 2) {
                    switch (dateDiff(starting.getTime()).minute) {
                        case 6:
                            $('.info-box-content').append(`<div class="mt-1">Finalizando sincronização de milhares de produtos. Aguarde...</div>`);
                            break;
                        case 5:
                            $('.info-box-content').append(`<div class="mt-1">Sincronizando milhares de produtos. Aguarde...</div>`);
                            break;
                        case 4:
                            $('.info-box-content').append(`<div class="mt-1">Sincronização ainda em andamento. Aguarde...</div>`);
                            break;
                        default:
                            $('.info-box-content').append(`<div class="mt-1">Sincronização de produtos em andamento. Aguarde...</div>`);
                            break;
                    }
                }
            }
        }, 60000);

    $('.info-box-content').append(`<div class="mt-1">Sincronizando <span id="liProducts">${productsTables.length}</span> de ${productsTables.length} tabelas as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

    // Iterating thru the list of productsTables
    _.forEach(productsTables, function (table, index) {

        const file = `${destPath}\\tabelas\\${table}.json`;

        fse.pathExists(file, (err, exists) => {
            if (exists) {

                if (table == 'produto') {

                    let theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                    let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                    let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                    console.log(JSON.parse(dataFromFile).length + ' produtos');

                    sqlInst = ''; // `set language portuguese; waitfor delay \'00:00:05\'; `;

                    // sqlInst += `alter table ${table} nocheck constraint all; `

                    sqlInst += `select top 0 * into #sinc_${table}_${index} from ${table}; `;

                    if (table == 'Itens_Grade_Estoque')
                        sqlInst += `delete from ${table}; `;

                    sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                    sqlInst += `set identity_insert #sinc_${table}_${index} on; `;

                    sqlInst += `declare @list_${table}_${index} varchar(max); `;

                    _.forEach(jsonData, function (parts, a) {

                        sqlInst += `set @list_${table}_${index} = `;

                        let sqlSel = `'`;
                        _.forEach(parts, function (data, b) {

                            sqlSel += `select `;
                            let sqlSelIn = '';
                            _.forEach(data, function (value, key) {
                                if (key == 'referencia' || key == 'refxml') {
                                    if (value == null) {
                                        sqlSelIn += `${null}, `;
                                    } else if (isNaN(value)) {
                                        sqlSelIn += `''${value}'', `;
                                    } else {
                                        sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                                    }
                                } else {
                                    if (value == null) {
                                        sqlSelIn += `${null}, `;
                                    } else if (value instanceof Date) {
                                        sqlSelIn += `''${moment(value).format('DD/MM/YYYY HH:mm')}'', `;
                                    } else if (isNaN(value)) {
                                        sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                                    } else if (value == true) {
                                        sqlSelIn += `1, `;
                                    } else if (value == false) {
                                        sqlSelIn += `0, `;
                                    } else {
                                        if (value.length > 10) {
                                            sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                                        } else {
                                            sqlSelIn += `${value}, `;
                                        }
                                    }
                                }
                            });

                            sqlSel += sqlSelIn.replace(/,\s*$/, " ");

                        });

                        sqlInst += `${sqlSel}' insert into #sinc_${table}_${index} (`;

                        sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table}_${index}); `;

                    });

                    sqlInst += `update t_${index}_1 set `;

                    let columnParts = theColumns.replace(/['"]+/g, '').split(',');

                    let columnParts1 = _.pull(columnParts, 'codigo');

                    if (!syncPrice) {
                        columnParts1 = _.pull(columnParts1, 'preco', 'lucro');
                        if (!syncCost) {
                            columnParts1 = _.pull(columnParts1, 'lucro', 'markup', 'preco_venda');
                        }
                    }

                    if (!syncStock) {
                        columnParts1 = _.pull(columnParts1, 'estoque');
                    }

                    if (!syncComission) {
                        columnParts1 = _.pull(columnParts1, 'comissao');
                    }

                    if (!syncActive) {
                        columnParts1 = _.pull(columnParts1, 'ativo', 'ativo_pdv');
                    }

                    sqlSel = '';
                    let sqlUpdate = '';
                    _.forEach(columnParts1, function (prop) {
                        sqlUpdate += `t_${index}_1.${prop} = t_${index}_2.${prop}, `;
                    });

                    sqlSel = sqlUpdate.replace(/,\s*$/, " ");

                    sqlInst += sqlSel + ' ';
                    sqlInst += `from ${table} as t_${index}_1 `;

                    if (table == 'parametros_produto') {
                        sqlInst += `inner join #sinc_${table}_${index} as t_${index}_2 on t_${index}_1.codproduto = t_${index}_2.codproduto; `;
                    } else if (table !== 'Itens_Grade_Estoque') {
                        sqlInst += `inner join #sinc_${table}_${index} as t_${index}_2 on t_${index}_1.codigo = t_${index}_2.codigo; `;
                    }

                    sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                    sqlInst += 'begin ';
                    sqlInst += `set identity_insert #sinc_${table}_${index} off; `;
                    sqlInst += `set identity_insert ${table} on; `;
                    sqlInst += 'end ;';

                    let columnParts2 = theColumns.replace(/['"]+/g, '').split(',');

                    if (!syncPrice) {
                        columnParts2 = _.pull(columnParts2, 'preco', 'lucro');
                        if (!syncCost) {
                            columnParts2 = _.pull(columnParts2, 'lucro', 'markup', 'preco_venda');
                        }
                    }

                    if (!syncStock) {
                        columnParts2 = _.pull(columnParts2, 'estoque');
                    }

                    if (!syncComission) {
                        columnParts2 = _.pull(columnParts2, 'comissao');
                    }

                    if (!syncActive) {
                        columnParts2 = _.pull(columnParts2, 'ativo', 'ativo_pdv');
                    }

                    sqlInst += `insert into ${table} ( `;

                    sqlSel = '';
                    sqlUpdate = '';
                    _.forEach(columnParts2, function (prop) {
                        sqlUpdate += `${prop}, `;
                    });

                    sqlSel = sqlUpdate.replace(/,\s*$/, " ");
                    sqlInst += sqlSel + ') ';

                    sqlSel = '';
                    sqlUpdate = 'select ';
                    _.forEach(columnParts2, function (prop) {
                        sqlUpdate += `#sinc_${table}_${index}.${prop}, `;
                    });

                    sqlSel = sqlUpdate.replace(/,\s*$/, " ");
                    sqlInst += sqlSel + ' ';

                    sqlInst += `from #sinc_${table}_${index} `;
                    // sqlInst += `left outer join ${table} on ${table}.codigo = #sinc_${table}_${index}.codigo `;

                    if (table == 'parametros_produto') {
                        sqlInst += `where not #sinc_${table}_${index}.codproduto in (select codproduto from ${table}); `;
                    } else if (table !== 'Itens_Grade_Estoque') {
                        sqlInst += `where not #sinc_${table}_${index}.codigo in (select codigo from ${table}); `;
                    }

                    sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                    sqlInst += 'begin ';
                    sqlInst += `set identity_insert #sinc_${table}_${index} off; `;
                    sqlInst += `drop table #sinc_${table}_${index}; `;
                    sqlInst += `set identity_insert ${table} off; `;
                    sqlInst += 'end; ';

                    // sqlInst += "waitfor delay \'00:00:05\';";

                    // console.log(sqlInst);

                    // adding to sql database
                    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                        pool.request().query(sqlInst).then(result => {
                            console.log(`Sincronizado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                            starting = new Date();

                            counter = counter - 1;

                            $('#liProducts').html(counter);

                            if (counter == 0) {

                                done = true;

                                let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                                $('.info-box-content').append(`<div class="mt-1">Dados de produtos sincronizados em ${totalTiming}.</div>`);

                                if ($($btn).attr('data-value') == 'startSync' && setSync == true) {
                                    sqlDb.connect(dbOrigin).then(pool => {
                                        pool.request().query('update produto set sinc = 1;').then(result => {
                                            // console.log(result);
                                            sqlDb.close();
                                            if (syncNewItems) {
                                                getItemsSync($btn, infoBox);
                                            } else {
                                                endProductsSync(infoBox);
                                                $('#divSyncTile').next().next().addClass('disabled selected');
                                            }
                                        }).catch(err => {
                                            sqlError(err, infoBox);
                                        });
                                    });
                                } else {
                                    endProductsSync(infoBox);
                                    $('#divSyncTile').next().next().addClass('disabled selected');

                                }
                            }
                        }).catch(err => {
                            new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                                let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                                pool.request().query(sqlEndInst).then(result => {
                                    // console.log(result);

                                    infoBox.data('infobox').setType('alert');
                                    $('#barProgress').addClass('d-none');
                                    $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                    infoBox.append('<span class="button square closer"></span>');
                                    sqlDb.close();

                                    clearInterval(myVal);
                                    clearInterval(timer);
                                    mainWin.setProgressBar(1.0);
                                    mainWin.setProgressBar(0);
                                }).catch(err => {
                                    sqlError(err, infoBox);
                                });
                            }).catch(err => {
                                sqlError(err, infoBox);
                            });

                            sqlError(err, infoBox);
                            clearInterval(myVal);
                            clearInterval(timer);
                        });
                    }).catch(function (err) {
                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                } else {
                    let theColumns;
                    theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                    let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                    let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                    console.log(JSON.parse(dataFromFile).length + ' itens em ' + table);

                    let sqlInst = ''; // `set language portuguese; waitfor delay \'00:00:05\'; `;

                    sqlInst += `delete from ${table}; `;
                    sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                    sqlInst += `set identity_insert ${table} on; `;
                    sqlInst += `declare @list_${table + '_' + index} varchar(max); `;

                    _.forEach(jsonData, function (parts) {

                        sqlInst += `set @list_${table + '_' + index} = `;

                        let sqlSel = `'`;
                        _.forEach(parts, function (data) {

                            sqlSel += `select `;
                            let sqlSelIn = '';
                            sqlSelIn = formatValue1(data, sqlSelIn);
                            sqlSel += sqlSelIn.replace(/,\s*$/, " ");
                        });

                        sqlInst += `${sqlSel}'; insert into ${table} (`;

                        sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table + '_' + index}); `;
                    });

                    sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
                    sqlInst += `set identity_insert ${table} off; `;

                    // adding to sql database
                    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                        pool.request().query(sqlInst).then(result => {
                            console.log(`Sincronizado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                            starting = new Date();

                            counter = counter - 1;

                            $('#liProducts').html(counter);

                            if (counter == 0) {

                                done = true;

                                let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                                $('.info-box-content').append(`<div class="mt-1">Dados de produtos sincronizados em ${totalTiming}.</div>`);

                                if ($($btn).attr('data-value') == 'startSync' && setSync == true) {
                                    sqlDb.connect(dbOrigin).then(pool => {
                                        pool.request().query('update produto set sinc = 1;').then(result => {
                                            // console.log(result);
                                            sqlDb.close();
                                            if (syncNewItems) {
                                                getItemsSync($btn, infoBox);
                                            } else {
                                                endProductsSync(infoBox);
                                                let totalTiming = moment.utc(moment(new Date()).diff(moment(startingTime))).format('mm:ss');
                                                $('.info-box-content').append(`<div class="mt-1">Tempo total: ${totalTiming}.</div>`);
                                                // $('#divSyncTile').next().next().removeClass('disabled').removeClass('bg-steel')
                                            }
                                        }).catch(err => {
                                            sqlError(err, infoBox);
                                        });
                                    });
                                } else {
                                    endProductsSync(infoBox);
                                    $('#divSyncTile').next().next().addClass('disabled selected');
                                    if (syncNewProducts) {
                                        $('#divSyncTile').next().next().next().removeClass('disabled').removeClass('bg-steel').addClass('bg-cyan');
                                    }
                                }
                            }
                        }).catch(err => {

                            new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                                let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                                pool.request().query(sqlEndInst).then(result => {
                                    // console.log(result);

                                    infoBox.data('infobox').setType('alert');
                                    $('#barProgress').addClass('d-none');
                                    $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                    infoBox.append('<span class="button square closer"></span>');

                                    sqlDb.close();
                                }).catch(err => {
                                    sqlError(err, infoBox);
                                });
                            }).catch(err => {
                                sqlError(err, infoBox);
                            });

                            sqlError(err, infoBox);
                            clearInterval(myVal);
                            clearInterval(timer);
                        });
                    }).catch(function (err) {
                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                }
            } else {
                counter = counter - 1;
            }
        });
    });

    function endProductsSync(infoBox) {
        sqlDb.connect(dbDest).then(pool => {
            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
            pool.request().query(sqlEndInst).then(result => {
                // console.log(result);
                sqlDb.close();
                if (setSync == true) {
                    sqlDb.connect(dbOrigin).then(pool => {
                        pool
                            .request()
                            .query("update produto set sinc = 1;")
                            .then(result => {
                                // console.log(result);
                                sqlDb.close();

                                infoBox.data("infobox").setType("success");
                                $("#barProgress").addClass("d-none");
                                $(".info-box-content").append(
                                    `<div class="mt-1">Sincronização executada com sucesso.</div>`
                                );
                                infoBox.append(
                                    '<span class="button square closer"></span>'
                                );
                                $("#divNotyEndTile")
                                    .removeClass("disabled bg-steel")
                                    .addClass("bg-green");

                                if (!mainWin.isFocused()) {
                                    notifier.notify(
                                        {
                                            title: "Sincronizador",
                                            message: "Dados sincronizados com sucesso.",
                                            sound: true,
                                            wait: true,
                                            icon: path.join(__dirname, "../img/icon.png")
                                        },
                                        function (err, response) {
                                            // Response is response from notification
                                            console.log(response);
                                        }
                                    );
                                    notifier.on("click", function (
                                        notifierObject,
                                        options
                                    ) {
                                        mainWin.focus();
                                    });

                                    clearInterval(myVal);
                                    clearInterval(timer);
                                    mainWin.setProgressBar(1.0);
                                    mainWin.setProgressBar(0);
                                }
                            })
                            .catch(err => {
                                sqlError(err, infoBox);
                            });
                    });
                } else {
                    notifier.notify(
                      {
                        title: "Sincronizador",
                        message: "Dados sincronizados com sucesso.",
                        sound: true,
                        wait: true,
                        icon: path.join(__dirname, "../img/icon.png")
                      },
                      function(err, response) {
                        // Response is response from notification
                        console.log(response);
                      }
                    );
                    notifier.on("click", function(notifierObject, options) {
                      mainWin.focus();
                    });

                    clearInterval(myVal);
                    clearInterval(timer);
                    mainWin.setProgressBar(1.0);
                    mainWin.setProgressBar(0);
                }
                // NProgress.done();
                // sqlDb.close();
                // clearInterval(myVal);
                // clearInterval(timer);
                // mainWin.setProgressBar(1.0);
                // mainWin.setProgressBar(0);
            }).catch(err => {
                sqlError(err, infoBox);
                clearInterval(myVal);
                clearInterval(timer);
            });
        }).catch(err => {
            sqlError(err, infoBox);
            clearInterval(myVal);
            clearInterval(timer);
        });
    }
};

function getItemsSync(btn, infoBox) {
    let $btn = btn,
        start = new Date(),
        starting = new Date(),
        sqlGet = '';

    // Iterating thru the list of itemsTables
    _.forEach(itemsTables, function (item, index) {
        sqlGet += `select * from sinc_${item}_view; `;
    });

    new sqlDb.ConnectionPool(dbOrigin).connect().then(pool => {
        $('.info-box-content').append(`<div class="mt-1">Adiquirindo dados de entradas as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

        pool.request().query(sqlGet).then(data => {
            starting = new Date();

            let counter = itemsTables.length;
            storage.setDataPath(destPath + '\\tabelas');
            _.forEach(itemsTables, function (item, index) {
                if (data.recordsets[index].length) {
                    storage.set(item, data.recordsets[index], function (error) {
                        if (error)
                            throw error;
                        // $('.info-box-content').append(`<div class="mt-1">Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)}).</div>`);
                        console.log(`Adquirido ${item} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);

                        let columns = '';
                        _.forEach(data.recordsets[index].columns, function (column, i) {
                            columns += column.name + ',';
                        });
                        columns = `${columns.replace(/,\s*$/, "")}`;

                        storage.set(item + '_columns', columns, function (error) {
                            if (error)
                                throw error;

                            starting = new Date();
                            counter = counter - 1;
                            if (counter == 0) {
                                $('.info-box-content').append(`<div class="mt-1">Entradas adiquiridas em ${n(dateDiff(start.getTime()).minute)}:${n(dateDiff(start.getTime()).second)}.</div>`);
                                sqlDb.close();
                                importItemsSync($btn, infoBox);
                            }
                        });
                    });
                } else {
                    counter = counter - 1;

                    if (counter == 0) {
                        $('.info-box-content').append(`<div class="mt-1">Tabela ${item} vazia.</div>`);
                        done = true;
                        sqlDb.close();
                        clearInterval(myVal);
                        clearInterval(timer);
                        mainWin.setProgressBar(1.0);
                        mainWin.setProgressBar(0);
                    }
                }
            });

        }).catch(err => {
            sqlError(err, infoBox);
        });
    }).catch(function (err) {
        sqlError(err, infoBox);
    });
};

function importItemsSync(btn, infoBox) {
    let $btn = btn,
        counter = itemsTables.length,
        start = new Date(),
        starting = new Date(),

        myVal = setInterval(function () {
            if (done) {
                clearInterval(myVal);
            } else {
                if (dateDiff(starting.getTime()).minute >= 1) {
                    switch (dateDiff(starting.getTime()).minute) {
                        case 5:
                            $('.info-box-content').append(`<div class="mt-1">Finalizando sincronização de milhares de items. Aguarde...</div>`);
                            break;
                        case 2:
                            $('.info-box-content').append(`<div class="mt-1">Sincronizando milhares de items. Aguarde...</div>`);
                            break;
                        case 3:
                            $('.info-box-content').append(`<div class="mt-1">Sincronização ainda em andamento. Aguarde...</div>`);
                            break;
                        default:
                            $('.info-box-content').append(`<div class="mt-1">Sincronização de items em andamento. Aguarde...</div>`);
                            break;
                    }
                }
            }
        }, 60000);

    $('.info-box-content').append(`<div class="mt-1">Sincronizando <span id="liItems">${itemsTables.length}</span> de ${itemsTables.length} tabelas as ${moment(new Date()).format('HH:mm:ss')}.</div>`);

    // Iterating thru the list of itemsTables
    _.forEach(itemsTables, function (table, index) {

        const file = `${destPath}\\tabelas\\${table}.json`;

        fse.pathExists(file, (err, exists) => {
            if (exists) {

                let theColumns;
                theColumns = fse.readFileSync(`${destPath}\\tabelas\\${table}_columns.json`, 'utf8');
                let dataFromFile = fse.readFileSync(`${destPath}\\tabelas\\${table}.json`, 'utf8');

                let jsonData = chunks(JSON.parse(dataFromFile), 1000);

                console.log(JSON.parse(dataFromFile).length + ' items em ' + table);

                let sqlInst = '';

                sqlInst += `delete from ${table}; `;
                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1) `;
                sqlInst += `set identity_insert ${table} on; `;
                sqlInst += `declare @list_${table + '_' + index} varchar(max); `;

                _.forEach(jsonData, function (parts) {

                    sqlInst += `set @list_${table + '_' + index} = `;

                    let sqlSel = `'`;
                    _.forEach(parts, function (data) {
                        sqlSel += `select `;
                        let sqlSelIn = '';
                        sqlSelIn = formatValue1(data, sqlSelIn);
                        sqlSel += sqlSelIn.replace(/,\s*$/, " ");
                    });

                    sqlInst += `${sqlSel}'; insert into ${table} (`;

                    sqlInst += `${theColumns.replace(/['"]+/g, '')}) exec(@list_${table + '_' + index}); `;
                });

                sqlInst += `if ((select objectproperty(object_id('${table}'), 'TableHasIdentity')) = 1)`;
                sqlInst += `set identity_insert ${table} off; `;

                // adding to sql database
                new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                    pool.request().query(sqlInst).then(result => {
                        // $('.info-box-content').append(`<div class="mt-1">Sincronizado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)}).</div>`);
                        console.log(`Sincronizado ${table} (${n(dateDiff(starting.getTime()).minute)}:${n(dateDiff(starting.getTime()).second)})`);
                        starting = new Date();

                        counter = counter - 1;

                        $('#liItems').html(counter);

                        if (counter == 0) {

                            done = true;

                            let totalTiming = moment.utc(moment(new Date()).diff(moment(start))).format('mm:ss');
                            $('.info-box-content').append(`<div class="mt-1">Dados de entradas sincronizados em ${totalTiming}.</div>`);

                            sqlDb.connect(dbDest).then(pool => {
                                let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                                pool.request().query(sqlEndInst).then(result => {
                                    // console.log(result);
                                    sqlDb.close();

                                    if ($($btn).attr('data-value') == 'startSync') {
                                        let totalTiming = moment.utc(moment(new Date()).diff(moment(startingTime))).format('mm:ss');
                                        $('.info-box-content').append(`<div class="mt-1">Tempo total: ${totalTiming}.</div>`);
                                    }

                                    infoBox.data('infobox').setType('success');
                                    $('#barProgress').addClass('d-none');
                                    $('.info-box-content').append(`<div class="mt-1">Sincronização executada com sucesso.</div>`);
                                    infoBox.append('<span class="button square closer"></span>');
                                    $('#divSyncTile').next().next().next().addClass('disabled selected');
                                    $('#divSyncTile').addClass('disabled selected');
                                    $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');

                                    clearInterval(myVal);
                                    clearInterval(timer);
                                    mainWin.setProgressBar(1.0);
                                    mainWin.setProgressBar(0);

                                    if (!mainWin.isFocused()) {
                                        notifier.notify({
                                            title: 'Sincronizador',
                                            message: 'Dados sincronizados com sucesso.',
                                            sound: true, // true | false.
                                            wait: true, // Wait for User Action against Notification
                                            icon: path.join(__dirname, '../img/icon.png'),
                                            // timeout: 10
                                        },
                                            function (err, response) {
                                                // Response is response from notification
                                                console.log(response);
                                            });
                                        notifier.on('click', function (notifierObject, options) {
                                            mainWin.focus();
                                        });
                                    }
                                }).catch(err => {
                                    sqlError(err, infoBox);
                                    clearInterval(myVal);
                                    clearInterval(timer);
                                });
                            }).catch(err => {
                                sqlError(err, infoBox);
                                clearInterval(myVal);
                                clearInterval(timer);
                            });
                        }
                    }).catch(err => {

                        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
                            let sqlEndInst = "exec sp_msforeachtable 'ALTER TABLE ? ENABLE TRIGGER all'; exec sp_habilitar_chaves;";
                            pool.request().query(sqlEndInst).then(result => {
                                // console.log(result);

                                infoBox.data('infobox').setType('alert');
                                $('#barProgress').addClass('d-none');
                                $('.info-box-content').append(`<div class="mt-1">Ocorreu um erro.<br />${result}<br /><br />Reativando os gatilhos e chaves as ${moment(new Date()).format('HH:mm:ss')}.</div>`);
                                infoBox.append('<span class="button square closer"></span>');
                                sqlDb.close();
                            }).catch(err => {
                                sqlError(err, infoBox);
                            });
                        }).catch(err => {
                            sqlError(err, infoBox);
                        });

                        sqlError(err, infoBox);
                        clearInterval(myVal);
                        clearInterval(timer);
                    });
                }).catch(function (err) {
                    sqlError(err, infoBox);
                    clearInterval(myVal);
                    clearInterval(timer);
                });
                // end of adding
            } else {
                counter = counter - 1;
            }
        });
    });
};

function sqlError(err, infoBox) {
    console.log(err.message);

    mainWin.setProgressBar(1.0);
    mainWin.setProgressBar(0);
    infoBox.data('infobox').setType('alert');
    infoBox.data('infobox').setContent(`<div class="mt-4">${err} as ${moment(new Date()).format('HH:mm:ss')}</div>;`);
    infoBox.append('<span class="button square closer"></span>');

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
            $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');
        }).catch(err => {
            sqlDb.close();
            $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');
        });
    }).catch(err => {
        sqlDb.close();
        $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');
    });
};

function formatValue2(value, sqlSelIn) {
    if (value == null) {
        sqlSelIn += `${null}, `;
    } else if (value instanceof Date) {
        sqlSelIn += `'${moment(value).format('DD/MM/YYYY HH:mm')}', `;
    } else if (isNaN(value)) {
        sqlSelIn += `'${value.replace(/["']/g, "")}', `;
    } else if (value == true) {
        if (value == 1) {
            sqlSelIn += `1, `;
        } else {
            if (isNaN(value)) {
                sqlSelIn += `'${value.replace(/["']/g, "")}', `;
            } else {
                sqlSelIn += `${value.replace(/["']/g, "")}, `;
            }
        }
    } else if (value == false) {
        if (value.length == 1) {
            sqlSelIn += `0, `;
        } else {
            sqlSelIn += `'${value.toString()}', `;
        }
    } else {
        if (value.length > 10) {
            sqlSelIn += `'${value.replace(/["']/g, "")}', `;
        } else {
            sqlSelIn += `''${value.toString()}'', `;
        }
    }
    return sqlSelIn;
};

function formatValue1(data, sqlSelIn) {
    _.forEach(data, function (value) {
        if (value == null) {
            sqlSelIn += `${null}, `;
        } else if (value instanceof Date) {
            sqlSelIn += `''${moment(value).format('DD/MM/YYYY HH:mm')}'', `;
        } else if (isNaN(value)) {
            sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
        } else if (value == true) {
            if (value == 1) {
                sqlSelIn += `1, `;
            } else {
                if (isNaN(value)) {
                    sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
                } else {
                    sqlSelIn += `${value.replace(/["']/g, "")}, `;
                }
            }
        } else if (value == false) {
            if (value.length == 1) {
                sqlSelIn += `0, `;
            } else {
                sqlSelIn += `''${value.toString()}'', `;
            }
        } else {
            if (value.length > 10) {
                sqlSelIn += `''${value.replace(/["']/g, "")}'', `;
            } else {
                sqlSelIn += `''${value.toString()}'', `;
            }
        }
    });
    return sqlSelIn;
};

function removeValue(list, value, separator) {
    separator = separator || ",";
    let values = list.split(",");
    for (let i = 0; i < values.length; i++) {
        if (values[i] == value) {
            values.splice(i, 1);
            return values.join(",");
        }
    }
    let s = '';
    return list;
};

function dateDiff(timestamp) {
    let d = Math.abs(timestamp - new Date().getTime()) / 1000; // delta
    let r = {}; // result
    let s = { // structure
        year: 31536000,
        month: 2592000,
        week: 604800, // uncomment row to ignore
        day: 86400, // feel free to add your own row
        hour: 3600,
        minute: 60,
        second: 1
    };

    Object.keys(s).forEach(function (key) {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

    return r;
};

function n(n) {
    return n > 9 ? "" + n : "0" + n;
};

let chunks = function (array, size) {

    let results = [];
    while (array.length) {
        results.push(array.splice(0, size));
    }
    return results;
};

ipcRenderer.on('startSyncComunication', (event, message) => {
    startSyncComunication();
});

let startSyncComunication = function () {
    let socket = io(`http://${broadServer}`);

    let msg = {
        username: os.userInfo().username,
        type: "syncing",
        message: "Sincronização em andamento. Favor não utilizar o SGI.<br />Uma nova notificação será emitida para liberação do uso do sistema."
    };

    socket.emit('messages', JSON.stringify(msg));

    remote.dialog.showMessageBox({
        type: 'info',
        title: "Informativo",
        message: "Notificação enviada!",
        buttons: ["OK"]
    });

    $('#divNotyStartTile').addClass('selected disabled');
};

ipcRenderer.on('endSyncComunication', (event, message) => {
    endSyncComunication();
});

let endSyncComunication = function () {
    let socket = io(`http://${broadServer}`);

    let msg = {
        username: os.userInfo().username,
        type: "done",
        message: "Sincronização concluida.<br />SGI liberado para uso."
    };

    socket.emit('messages', JSON.stringify(msg));

    remote.dialog.showMessageBox({
        type: 'info',
        title: "Informativo",
        message: "Notificação enviada!",
        buttons: ["OK"]
    });

    $('#divNotyEndTile').addClass('selected disabled');
};

function doBackup() {
    let bkupChron = new Date();

    let infoBox = Metro.infobox.create(
        `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
        Realizando backup do banco de dados de destino "${dbDest.database}" as <span data-role="clock" class="w-auto reduce-1" data-show-date="false"></span>.`,
        "",
        {
            closeButton: false
        }
    );

    let bkName = dbDest.database + '_' + moment(new Date()).format('DD-MM-YYYY_HH-mm-ss');
    let bkupQuery = "backup database " + dbDest.database + " to disk = 'c:\\softer\\sgi\\copia\\" + bkName + ".bak' with format, medianame = '" + dbDest.database + "', name = 'full backup of " + dbDest.database + "';";
    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
        return pool.request().query(bkupQuery)
    }).then(result => {

        sqlDb.close();

        zip('c:\\softer\\sgi\\copia\\' + bkName + '.bak', 'c:\\softer\\sgi\\copia\\' + bkName + '.zip', err => {
            if (err) {
                infoBox.data('infobox').setType('alert');
                $('.info-box-content').append(`<div class="mt-1">Não foi possível compactar o arquivo de backup.</div>`);
                infoBox.append('<span class="button square closer"></span>');
            } else {
                infoBox.data('infobox').setType('success');
                infoBox.data('infobox').setContent(`<div class="mt-4">Backup do banco de dados "${dbDest.database}" realizado com sucesso em ${n(dateDiff(bkupChron.getTime()).minute)}:${n(dateDiff(bkupChron.getTime()).second)}.</div>`);
                infoBox.append('<span class="button square closer"></span>');

                setTimeout(() => {
                    if (infoBox.data('infobox'))
                        infoBox.data('infobox').close();
                }, 6000);

                $('#divBackupTile').addClass('disabled selected');

                if (canSync) {
                    if (syncNewPeople) {
                        $('#divSyncTile').next().removeClass('disabled').removeClass('bg-steel').addClass('bg-cyan');

                        if ((syncNewItems) || (syncNewPeople) || (syncNewProducts)) {
                            $('#divSyncTile').removeClass('disabled').removeClass('bg-steel').addClass('bg-cyan');
                        }
                    }
                }

                if (canRep) {
                    if (syncNewPeople)
                        $('#divReplicateTile').next().removeClass('disabled').removeClass('bg-steel').addClass('bg-orange');

                    if ((syncNewItems) || (syncNewPeople) || (syncNewProducts)) {
                        $('#divReplicateTile').removeClass('disabled').removeClass('bg-steel').addClass('bg-orange');
                    }
                }

                fse.remove('c:\\softer\\sgi\\copia\\' + bkName + '.bak', err => {
                    if (err) return console.error(err)

                    console.log('Arquivo bak compactado e removido com sucesso!')
                })

                if (!mainWin.isFocused()) {
                    notifier.notify({
                        title: 'Sincronizador',
                        message: 'Backup concluido com sucesso.',
                        sound: true, // true | false.
                        wait: true, // Wait for User Action against Notification
                        icon: path.join(__dirname, '../img/icon.png'),
                    });

                    notifier.on('click', function (notifierObject, options) {
                        mainWin.focus();
                    });
                }
            }
        });
    }).catch(err => {
        console.log(err);
        $('#divNotyEndTile').removeClass('disabled bg-steel').addClass('bg-green');
        sqlDb.close();
    });
}

function doSync(btn) {
    let $btn = btn;

    let infoBox = Metro.infobox.create(
        `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
        <h6>Sincronizando!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
        "",
        {
            closeButton: false,
            clsBox: 'customInfoBox'
        }
    );

    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
        return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
    }).then(result => {
        sqlDb.close();
        getPeopleSync($btn, infoBox);
    }).catch(err => {
        sqlError(err, infoBox);
    });
}

function doSyncPeople(btn) {
    let $btn = btn;

    let infoBox = Metro.infobox.create(
        `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
        <h6>Sincronizando Pessoas!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
        "",
        {
            closeButton: false,
            clsBox: 'customInfoBox'
        }
    );

    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
        return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
    }).then(result => {
        sqlDb.close();
        getPeopleSync($btn, infoBox);
    }).catch(err => {
        sqlError(err, infoBox);
    });
}

function doSyncProducts(btn) {
    let $btn = this;

    let infoBox = Metro.infobox.create(
        `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
        <h6>Sincronizando Produtos!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
        "",
        {
            closeButton: false,
            clsBox: 'customInfoBox'
        }
    );

    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
        return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
    }).then(result => {
        sqlDb.close();
        getProductsSync($btn, infoBox);
    }).catch(err => {
        sqlError(err, infoBox);
    });
}

function doSyncItems(btn) {
    let $btn = this;

    let infoBox = Metro.infobox.create(
        `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
        <h6>Sincronizando Entradas!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
        "",
        {
            closeButton: false,
            clsBox: 'customInfoBox'
        }
    );

    new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
        return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
    }).then(result => {
        sqlDb.close();
        getItemsSync($btn, infoBox);
    }).catch(err => {
        sqlError(err, infoBox);
    });
}

function doReplicate(btn) {
    let $btn = btn;

    if ($('#tablesPasswd').val() == 'replicar') {

        $('#tablesPasswordDialog').data('dialog').close();

        let infoBox = Metro.infobox.create(
            `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
                            <h6>Replicando!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
            "",
            {
                closeButton: false,
                clsBox: 'customInfoBox'
            }
        );

        startingTime = new Date();

        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
            return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
        }).then(result => {
            sqlDb.close();
            if (syncNewPeople) {
                getPeople($btn, infoBox);
            } else if (syncNewProducts) {
                getProducts($btn, infoBox);
            } else if (syncNewItems) {
                getItems($btn, infoBxo);
            }
        }).catch(err => {
            sqlError(err, infoBox);
        });

    } else {
        e.preventDefault();

        let notify = Metro.notify;
        notify.create("Confirmação incorreta.", "Atenção", {
            cls: "alert",
            onClose: function () {
                element.val('');
            }
        });
    }
}

function doRepPeople(btn) {
    let $btn = btn;

    if ($('#peoplePasswd').val() == 'replicar') {

        $('#peoplePasswordDialog').data('dialog').close();

        let infoBox = Metro.infobox.create(
            `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
            <h6>Replicando Pessoas!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
            "",
            {
                closeButton: false,
                clsBox: 'customInfoBox'
            }
        );

        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
            return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
        }).then(result => {
            sqlDb.close();
            getPeople($btn, infoBox);
        }).catch(err => {
            sqlError(err, infoBox);
        });

    } else {
        let notify = Metro.notify;
        notify.create("Confirmação incorreta.", "Atenção", {
            cls: "alert",
            onClose: function () {
                $('#peoplePasswd').val('');
            }
        });
    }
}

function doRepProducts(btn) {
    let $btn = btn;

    if ($('#productsPasswd').val() == 'replicar') {

        $('#productsPasswordDialog').data('dialog').close();

        let infoBox = Metro.infobox.create(
            `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
            <h6>Replicando Produtos!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
            "",
            {
                closeButton: false,
                clsBox: 'customInfoBox'
            }
        );

        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
            return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;")
        }).then(result => {
            sqlDb.close();
            getProducts($btn, infoBox);
        }).catch(err => {
            sqlError(err, infoBox);
        });

    } else {
        let notify = Metro.notify;
        notify.create("Confirmação incorreta.", "Atenção", {
            cls: "alert",
            onClose: function () {
                $('#productsPasswd').val('');
            }
        });
    }
}

function doRepItems(btn) {
    let $btn = btn;

    if ($('#itemsPasswd').val() == 'replicar') {

        $('#itemsPasswordDialog').data('dialog').close();

        let infoBox = Metro.infobox.create(
            `<div id="barProgress" data-role="progress" data-type="line" data-small="true" class="mb-2"></div>
            <h6>Replicando Entrada!</h6> Conectando ao servidor de origem as ${(new Date()).toLocaleTimeString()}.`,
            "",
            {
                closeButton: false,
                clsBox: 'customInfoBox'
            }
        );

        new sqlDb.ConnectionPool(dbDest).connect().then(pool => {
            return pool.request().query("set language portuguese; exec sp_msforeachtable 'ALTER TABLE ? DISABLE TRIGGER all'; exec sp_desabilitar_chaves;");
        }).then(result => {
            sqlDb.close();
            getItems($btn, infoBox);
        }).catch(err => {
            sqlError(err, infoBox);
        });

    } else {
        let notify = Metro.notify;
        notify.create("Confirmação incorreta.", "Atenção", {
            cls: "alert",
            onClose: function () {
                $('#itemsPasswd').val('');
            }
        });
    }
}

function startChatWindow() {
    ipcRenderer.send('openChatWindow');
}

function inputFocus(ele) {
    setTimeout(() => {
        let element = $(ele).find('input');
        element.focus();
    }, 500);
}