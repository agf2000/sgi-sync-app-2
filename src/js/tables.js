const {
    ipcRenderer,
    remote
} = eRequire('electron');

const mainWin = remote.getCurrentWindow();

const os = eRequire('os');
const fse = eRequire('fs-extra');
const storage = eRequire('electron-json-storage');
const sqlDb = eRequire("mssql");
const pjson = eRequire('./../../package.json');
const address = eRequire('address');

let destPath = 'c:\\softer\\Sincronizador\\config',
    dbDest = {};

const peopleFile = `${destPath}\\people_table.txt`,
    productsFile = `${destPath}\\products_table.txt`,
    itemsFile = `${destPath}\\items_table.txt`;

fse.readFile(peopleFile, function (err, data) {
    if (err) {
        fse.writeFileSync(peopleFile, 'bairro,cadpais,cep,cidade,estado,financeira,fisica,logradouro,obscliente,pessoas,pessoatipocobranca,profissoes,regioes,telefone,tipologradouro,tipopessoa,tipotelefone', 'utf-8');
        return console.log(err);
    }

    peopleTableList = fse.readFileSync(peopleFile, 'utf8');
    $('#textareaPeople').val(peopleTableList.replace(/,\s*$/, ""));

    Materialize.updateTextFields();
});

fse.readFile(productsFile, function (err, data) {
    if (err) {
        fse.writeFileSync(productsFile, 'categoria,colecao,custoproduto,grades,grupo,gruposubgrupo,unidade,itens_grade,itens_grade_estoque,parametros_produto,produto,produtofornecedor,subgrupo', 'utf-8');
        return console.log(err);
    }

    // ipcRenderer.send('openLoginWindow', mainWin.id);

    productsTableList = fse.readFileSync(productsFile, 'utf8');
    $('#textareaProducts').val(productsTableList.replace(/,\s*$/, ""));

    Materialize.updateTextFields();
});

fse.readFile(itemsFile, function (err, data) {
    if (err) {
        fse.writeFileSync(itemsFile, 'entrada,entradaitens', 'utf-8');
        return console.log(err);
    }
    itemsTableList = fse.readFileSync(itemsFile, 'utf8');
    $('#textareaItems').val(itemsTableList.replace(/,\s*$/, ""));

    Materialize.updateTextFields();
});

fse.readFile(`${destPath}\\dbDest.json`, function (err, data) {
    if (err) {
        return console.log(err);
    }

    let fileRead = fse.readFileSync(`${destPath}\\dbDest.json`, 'utf8');
    dbDest = JSON.parse(fileRead);
});

$(function () {
    // console.log(destPath);
    storage.setDataPath(destPath);
});

$('#btnSaveTables').click(function (e) {
    if (e.clientX === 0) {
        return false;
    }
    e.preventDefault();

    try {
        if ($('#textareaProducts').val())
            fse.writeFileSync(productsFile, $('#textareaProducts').val(), 'utf-8');

        if ($('#textareaPeople').val())
            fse.writeFileSync(peopleFile, $('#textareaPeople').val(), 'utf-8');

        if ($('#textareaItems').val())
            fse.writeFileSync(itemsFile, $('#textareaItems').val(), 'utf-8');

        new PNotify({
            title: "Sucesso",
            text: "Dados armazenados. Lembre de recarregar a tela principal.",
            type: 'success',
            icon: false,
            addclass: "stack-bottomright"
        });

    } catch (e) {
        alert('Falha ao salvar as informações !');
    }
});

$('#btnCloseTables').click(function (e) {
    if (e.clientX === 0) {
        return false;
    }
    e.preventDefault();

    var window = remote.getCurrentWindow();
    window.close();
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