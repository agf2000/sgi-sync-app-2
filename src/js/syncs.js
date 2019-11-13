const { ipcRenderer, remote } = eRequire('electron');

const mainWin = remote.getCurrentWindow();

const os = eRequire('os');
const fse = eRequire('fs-extra');
const _ = eRequire('lodash');
const moment = eRequire('moment');
const sqlDb = eRequire('mssql');
const pjson = eRequire('./../../package.json');
const address = eRequire('address');
const storage = eRequire('electron-json-storage');

let destPath = 'c:\\softer\\Sincronizador\\config',
	dbOrigin = {},
	dbDest = {},
	config = null;

var stack_topleft = {
	dir1: 'down',
	dir2: 'right',
	push: 'top'
};

$(function() {
	storage.setDataPath(destPath);

	$('#syncsModal').modal();

	$('#selectGroups').material_select();
	$('#selectCategories').material_select();

	fse.readFile(`${destPath}\\config.json`, function(err, data) {
		if (err) {
			return console.log(err);
		}

		let fileRead = fse.readFileSync(`${destPath}\\config.json`, 'utf8');
		config = JSON.parse(fileRead);

		if (config.syncStock !== undefined) {
			ipcRenderer.send('openLoginWindow', mainWin.id);
		}

		$('#syncStock').prop('checked', config.syncStock);
		$('#syncActive').prop('checked', config.syncActive);
		$('#syncNewPeople').prop('checked', config.syncNewPeople);
		$('#syncNewProducts').prop('checked', config.syncNewProducts);
		$('#syncNewItems').prop('checked', config.syncNewItems);
		$('#syncComission').prop('checked', config.syncComission);
		$('#canSync').prop('checked', config.canSync);
		$('#setSync').prop('checked', config.setSync);
		$('#canRep').prop('checked', config.canRep);
		$('#syncCost').prop('checked', config.syncCost);
		$('#syncPrice').prop('checked', config.syncPrice);
		$('#broadServer').val(config.broadServer);
		$('#allowNoti').prop('checked', config.allowNoti);

		if (config.syncGroup) $('#selectGroups').text(config.syncGroup);

		if (config.syncCategory) $('#selectCategories').text(config.syncCategory);
	});

	fse.readFile(`${destPath}\\dbDest.json`, function(err, data) {
		if (err) {
			$('.btn').removeClass('disabled');
			new PNotify({
				title: 'Atenção',
				text: 'Favor configrar o servidor de destino.',
				type: 'warning',
				icon: false,
				addclass: 'stack-bottomright'
			});
			$('.btn').addClass('disabled');
			return console.log(err);
		}

		$('#btnBackup').removeClass('disabled');
		let fileRead = fse.readFileSync(`${destPath}\\dbDest.json`, 'utf8');
		dbDest = JSON.parse(fileRead);
		setTimeout(() => {
			sqlConnectGroups();
		}, 500);
	});

	fse.readFile(`${destPath}\\dbOrigin.json`, function(err, data) {
		if (err) {
			$('.btn').removeClass('disabled');
			new PNotify({
				title: 'Atenção',
				text: 'Favor configrar o servidor de origem.',
				type: 'warning',
				icon: false,
				addclass: 'stack-bottomright'
			});
			$('.btn').addClass('disabled');
			return console.log(err);
		}

		$('#btnBackup').removeClass('disabled');
		let fileRead = fse.readFileSync(`${destPath}\\dbOrigin.json`, 'utf8');
		dbOrigin = JSON.parse(fileRead);
		setTimeout(() => {
			sqlConnectCategories();
		}, 500);
	});
});

// Alter sync click
$('#btnSyncs').click(function(e) {
	if (e.clientX === 0) {
		return false;
	}
	e.preventDefault();

	let params = {
		syncStock: $('#syncStock').prop('checked'),
		syncActive: $('#syncActive').prop('checked'),
		syncNewItems: $('#syncNewItems').prop('checked'),
		syncNewPeople: $('#syncNewPeople').prop('checked'),
		syncNewProducts: $('#syncNewProducts').prop('checked'),
		syncComission: $('#syncComission').prop('checked'),
		syncCost: $('#syncCost').prop('checked'),
		syncPrice: $('#syncPrice').prop('checked'),
		canSync: $('#canSync').prop('checked'),
		setSync: $('#setSync').prop('checked'),
		canRep: $('#canRep').prop('checked'),
		syncGroup: parseInt($('#selectGroups option:selected').val()) > 0 ? $('#selectGroups option:selected').text() : '',
		syncCategory:
			parseInt($('#selectCategories option:selected').val()) > 0
				? $('#selectCategories')
						.find(':selected')
						.data('abbvr')
				: '',
		broadServer: $('#broadServer').val(),
		allowNoti: $('#allowNoti').prop('checked')
	};

	storage.set('config', params, function(error) {
		if (error) throw error;

		new PNotify({
			title: 'Sucesso',
			text: 'Configuração salva. Lembre de recarregar a tela principal.',
			type: 'success',
			icon: false,
			addclass: 'stack-bottomright'
		});
	});
});

$('#btnClose').click(function(e) {
	if (e.clientX === 0) {
		return false;
	}
	e.preventDefault();

	let win = remote.getCurrentWindow();
	win.close();
});

$('#btnRemoveGroup').click(function(e) {
	if (e.clientX === 0) {
		return false;
	}
	e.preventDefault();

	$('#selectGroups').append($('<option value="0" data-abbvr="" selected>Escolha um Grupo</option>'));
	$('select').material_select();
});

$('#btnRemoveCategory').click(function(e) {
	if (e.clientX === 0) {
		return false;
	}
	e.preventDefault();

	$('#selectCategories').append($('<option value="0" data-abbvr="" selected>Escolha uma categoria</option>'));
	$('select').material_select();
});

function sqlConnectGroups() {
	new sqlDb.ConnectionPool(dbOrigin)
		.connect()
		.then(pool => {
			return pool.request().query('select codigo, nome from grupo');
		})
		.then(result => {
			let Options = '';
			if (result.recordset.length) {
				_.forEach(result.recordset, function(group) {
					Options = Options + "<option value='" + group.codigo + "'>" + group.nome + '</option>';
				});
				$('#selectGroups').append(Options);
				$('#selectGroups').material_select();
			} else {
				Options = Options + "<option value='0' disable selected>Não há Grupos</option>";
				$('#selectGroups').append(Options);
				$('#selectGroups').material_select();
			}
		})
		.catch(err => {
			console.log(err);
			new PNotify({
				title: 'Erro',
				text: err,
				type: 'error',
				icon: false,
				addclass: 'stack-bottomright',
				delay: 6000
			});
			sqlDb.close();
		});
}

function sqlConnectCategories() {
	new sqlDb.ConnectionPool(dbOrigin)
		.connect()
		.then(pool => {
			return pool.request().query('select codigo, sigla, nome from categoria');
		})
		.then(result => {
			let Options = '';
			if (result.recordset.length) {
				_.forEach(result.recordset, function(cat) {
					Options = Options + "<option value='" + cat.codigo + "' data-abbvr='" + cat.sigla + "'>" + cat.nome + '</option>';
				});
				$('#selectCategories').append(Options);
				$('#selectCategories').material_select();
			} else {
				Options = Options + "<option value='0' disable selected>Não há Categorias</option>";
				$('#selectCategories').append(Options);
				$('#selectCategories').material_select();
			}
		})
		.catch(err => {
			console.log(err);
			new PNotify({
				title: 'Erro',
				text: err,
				type: 'error',
				icon: false,
				addclass: 'stack-bottomright',
				delay: 6000
			});
			sqlDb.close();
		});
}

function sqlError(err) {
	console.log(err);
	new PNotify({
		title: 'Erro',
		text: err,
		type: 'error',
		icon: false,
		addclass: 'stack-bottomright'
	});
	new sqlDb.ConnectionPool(dbDest)
		.connect()
		.then(pool => {
			let userName = sessionStorage.getItem('userName');

			let query = `insert into AuditoriaInterna (componentefoco, codigousuariosistema, ip, 
            maquina, acao, acaopadrao, componente, campo, valorantigo, novovalor, data, usuariopc, 
            formularioativo, sistemaoperacional, versao, pcremoto, codigoregistro, data_cadastro)
            values(null, '${userName}', '${address.ip()}', '${os.hostname}', 'SINCRONIZADOR', 
            null, null, null, '${err}', null, getdate(), '${os.userInfo().username}', null,
            'Versão do Windows: ${os.release()}', '${pjson.version}', null, 'Erro', getdate())
            `;

			pool.request()
				.query(query)
				.then(result => {
					sqlDb.close();
				})
				.catch(err => {
					sqlDb.close();
				});
		})
		.catch(err => {
			sqlDb.close();
		});
}
