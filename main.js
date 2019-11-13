const electron = require('electron');
const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = electron;
const path = require('path');
// const os = require('os');
const fse = require('fs-extra');
const destPath = 'c:\\softer\\config';
const devToolsInstaller = require('electron-devtools-installer');
const {
	autoUpdater
} = require('electron-updater');
const log = require('electron-log');

/**
 * Windows
 */
let mainWindow = null,
	serversWindow = null,
	tablesWindow = null,
	syncsWindow = null,
	configWindow = null,
	loginWindow = null,
	focusedWindow = null,
	aboutWindow = null,
	chatWindow = null;

/**
 * Configure logging
 */
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const io = require('socket.io-client');
let socket = null;

fse.readFile(`${destPath}\\config.json`, function (err, data) {
	if (err) {
		return console.log(err);
	}
	let fileRead = fse.readFileSync(`${destPath}\\config.json`, 'utf8');
	let config = JSON.parse(fileRead);

	socket = io(`http://${config.chatServer}`);
});

/**
 * Main screen window
 */
function createMainWindow() {

	devToolsInstaller.default(devToolsInstaller.REDUX_DEVTOOLS);

	// let osInfo = os;

	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		show: false,
		title: "SGI Sincronizador",
		x: 0,
		y: 10,
		autoHideMenuBar: true,
		// minimizable: false,
		width: 360,
		height: 640,
		// resizable: false,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	mainWindow.loadURL('file://' + __dirname + '/src/html/mainWindow.html');

	/** Built menu from template */
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

	/** Insert menu */
	Menu.setApplicationMenu(mainMenu);

	// Open developer tools if not in production
	// if (process.env.NODE_ENV !== 'production') {
	//     mainWindow.webContents.openDevTools({
	//         mode: 'detach'
	//     });
	// }

	// function openSyncsWindow() {
	//     event.sender.send('openSyncsWindow');
	// };

	// socket.on('welcome', () => {
	//     console.log('welcome received'); // displayed
	//     socket.emit('test')
	// });

	// socket.on('error', (e) => {
	//     console.log(e); // not displayed
	// });

	// socket.on('connect', () => {
	//     console.log("connected"); // displayed
	// });

	// socket.on('messages', (e) => {
	//     console.log(e); // displayed
	// });

	loginWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// modal: true,
		show: false,
		parent: mainWindow,
		// x: 0,
		// y: 10,
		transparent: true,
		width: 440,
		height: 360,
		frame: false
	});

	loginWindow.loadURL('file://' + __dirname + '/src/html/login.html');

	loginWindow.on('close', function () {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	});

	// child.once('ready-to-show', () => {
	//     child.show()
	// });

	let loading = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		show: false,
		frame: false,
		width: 642,
		height: 237,
		transparent: true
	});

	loading.once('show', () => {
		loginWindow.webContents.once('dom-ready', () => {
			// setTimeout(() => {
			loading.hide();
			loading.close();
			mainWindow.show();
			mainWindow.focus();
			// }, 2000);
			// login.show();
			// loading.hide();
			// loading.close();
		});
	});

	loading.loadURL('file://' + __dirname + '/src/html/splash-screen.html');
	loading.show();

	// ipcMain.on('openLoginWindow', (events, arg) => {
	// 	focusedWindow = BrowserWindow.fromId(arg);
	// 	focusedWindow.hide();
	// 	login.loadURL('file://' + __dirname + '/src/html/login.html');
	// 	// setTimeout(() => {
	// 	// login.show();
	// 	// }, 3000);
	// });

	// Show chrome developer tools on mainWindow open
	// mainWindow.webContents.openDevTools({
	//     mode: 'detach'
	// });
}

/**
 * Configurações window for origin and destination servers
 */
function openServersWindow() {
	if (serversWindow) {
		// login.show();
		// login.focus();
		serversWindow.show();
		serversWindow.focus();
		return;
	}

	serversWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// show: false,
		title: "Conexão com Servidores",
		minimizable: false,
		parent: mainWindow,
		fullscreenable: false,
		// width: 760,
		// height: 580,
		autoHideMenuBar: true,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	serversWindow.setMenu(null);

	serversWindow.loadURL('file://' + __dirname + '/src/html/servers.html');

	const serverMenu = Menu.buildFromTemplate(basicMenuTemplate);

	/** Insert menu */
	serversWindow.setMenu(serverMenu);

	serversWindow.on('closed', function () {
		// mainWindow.reload();
		serversWindow = null;
		// mainWindow.webContents.send('dismissLogin');
		// child.hide();
		mainWindow.focus();
	});

	// Open developer tools if not in production
	// if (process.env.NODE_ENV !== 'production') {
	//     serversWindow.webContents.openDevTools({
	//         mode: 'detach'
	//     });
	// }
}

/**
 * Configurações window for tables
 */
function openTablesWindow() {
	if (tablesWindow) {
		// login.show();
		// login.focus();
		tablesWindow.show();
		tablesWindow.focus();
		return;
	}

	tablesWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// show: false,
		title: "Tabelas",
		minimizable: false,
		parent: mainWindow,
		fullscreenable: false,
		// width: 740,
		// height: 560,
		autoHideMenuBar: true,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	tablesWindow.setMenu(null);

	tablesWindow.loadURL('file://' + __dirname + '/src/html/tables.html');

	const tableMenu = Menu.buildFromTemplate(basicMenuTemplate);

	/** Insert menu */
	tablesWindow.setMenu(tableMenu);

	tablesWindow.on('closed', function () {
		// mainWindow.reload();
		tablesWindow = null;
		// mainWindow.webContents.send('dismissLogin');
		// child.hide();
		mainWindow.focus();
	});

	// Open developer tools if not in production
	// if (process.env.NODE_ENV !== 'production') {
	//     tablesWindow.webContents.openDevTools({
	//         mode: 'detach'
	//     });
	// }
}

/**
 * Configurações window
 */
function openSyncsWindow() {
	if (syncsWindow) {
		// login.show();
		// login.focus();
		syncsWindow.show();
		syncsWindow.focus();
		return;
	}

	syncsWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// show: false,
		title: "Exceções",
		minimizable: false,
		parent: mainWindow,
		fullscreenable: false,
		// width: 660,
		// height: 540,
		autoHideMenuBar: true,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	syncsWindow.setMenu(null);

	syncsWindow.loadURL('file://' + __dirname + '/src/html/syncs.html');

	const syncsMenu = Menu.buildFromTemplate(basicMenuTemplate);

	/** Insert menu */
	syncsWindow.setMenu(syncsMenu);

	syncsWindow.on('closed', function () {
		// mainWindow.reload();
		syncsWindow = null;
		// mainWindow.webContents.send('dismissLogin');
		// child.hide();
		mainWindow.focus();
	});

	// Open developer tools if not in production
	// if (process.env.NODE_ENV !== 'production') {
	//     syncsWindow.webContents.openDevTools({
	//         mode: 'detach'
	//     });
	// }
}

/**
 * Configurações window for broadcast server
 */
function openConfigWindow() {
	if (configWindow) {
		configWindow.show();
		// 	// login.focus();
		return;
	}

	configWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// show: false,
		title: "Configurações",
		minimizable: false,
		parent: mainWindow,
		fullscreenable: false,
		// width: 660,
		// height: 520,
		autoHideMenuBar: true,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	configWindow.setMenu(null);

	configWindow.loadURL('file://' + __dirname + '/src/html/config.html');

	const configMenu = Menu.buildFromTemplate(basicMenuTemplate);

	/** Insert menu */
	configWindow.setMenu(configMenu);

	configWindow.on('closed', function () {
		// mainWindow.reload();
		configWindow = null;
		// mainWindow.webContents.send('dismissLogin');
		// child.hide();
		mainWindow.focus();
	});

	// Open developer tools if not in production
	// if (process.env.NODE_ENV !== 'production') {
	// configWindow.webContents.openDevTools({
	// 	mode: 'detach'
	// });
	// }
}

/**
 * About window with updater button
 */
function openAboutWindow() {
	// if (aboutWindow) {
	// 	aboutWindow.show();
	// 	aboutWindow.focus()
	// 	return;
	// }

	aboutWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		parent: mainWindow,
		modal: true,
		show: false,
		// x: 0,
		// y: 0,
		// frame: false,
		alwaysOnTop: true,
		autoHideMenuBar: true,
		minimizable: false,
		width: 440,
		height: 360,
		resizable: false,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	aboutWindow.loadURL('file://' + __dirname + '/src/html/about.html');

	aboutWindow.once('ready-to-show', () => {
		aboutWindow.show();
	});

	aboutWindow.on('closed', function () {
		aboutWindow = null;
		mainWindow.focus();
	});
}

/**
 * Openning login window
 */
ipcMain.on('openLoginWindow', (events, arg) => {
	focusedWindow = BrowserWindow.fromId(arg);
	// focusedWindow.maximize();
	// focusedWindow.hide();

	loginWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// modal: true,
		show: false,
		parent: mainWindow,
		// x: 0,
		// y: 10,
		transparent: true,
		width: 440,
		height: 360,
		frame: false
	});

	loginWindow.loadURL('file://' + __dirname + '/src/html/login.html');

	focusedWindow.setEnabled(false);

	setTimeout(() => {
		loginWindow.show();
		loginWindow.focus();
	}, 500);

	loginWindow.on('close', function () {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	});
});

/**
 * Open window after loging in.
 */
ipcMain.on('entry-accepted', (event, arg, user, chat) => {
	// if (!focusedWindow) {
	// 	// openWin.setEnabled(true);
	// 	focusedWindow = mainWindow;
	// 	if (chat !== undefined && chat !== '') {
	// 		openChatWindow();
	// 	}
	// }

	focusedWindow.setEnabled(true);
	focusedWindow.show();

	if (chat !== undefined && chat !== '') {
		openChatWindow();
	}

	if (arg == 'ping') {
		if (user)
			focusedWindow.setTitle(focusedWindow.webContents.browserWindowOptions.title + ' - Usuário logado: ' + user);
		loginWindow.hide();
		// login.close();
	}
});

/**
 * Open chat window
 */
function openChatWindow(arg) {
	if (chatWindow) {
		chatWindow.focus();
		return true;
	}

	chatWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		// parent: mainWindow,
		show: false,
		modal: true,
		x: 30,
		y: 30,
		// frame: false,
		alwaysOnTop: true,
		autoHideMenuBar: true,
		minimizable: true,
		width: 270,
		height: 500,
		// resizable: false,
		icon: path.join(__dirname, 'build/icon.ico')
	});

	chatWindow.loadURL('file://' + __dirname + '/src/html/chatWindow.html');

	const chatMenu = Menu.buildFromTemplate(basicMenuTemplate);

	/** Insert menu */
	chatWindow.setMenu(chatMenu);

	chatWindow.once('ready-to-show', () => {
		chatWindow.show();
	});

	chatWindow.on('closed', function () {
		chatWindow = null;
		mainWindow.focus();
	});

	// if (arg == 'ping') {
	// 	if (user) {
	// 		chatWindow.setTitle(focusedWindow.webContents.browserWindowOptions.title + ' - Usuário logado: ' + user);
	// 	}
	// }
}

/**
 * Open chat window
 */
ipcMain.on('openChatWindow', () => {
	openChatWindow();
});

/**
 * Main screen menu template
 */
const mainMenuTemplate = [{
	label: 'Aplicativo',
	submenu: [{
		label: 'Configuração',
		submenu: [{
			label: 'Servidores',
			accelerator: process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S',
			click(item, focusedWindow) {
				if (focusedWindow) {
					openServersWindow();
				}
			}
		}, {
			label: 'Tabelas',
			accelerator: process.platform === 'darwin' ? 'Command+T' : 'Ctrl+T',
			click(item, focusedWindow) {
				if (focusedWindow) openTablesWindow();
			}
		}, {
			label: 'Exceções',
			accelerator: process.platform === 'darwin' ? 'Command+E' : 'Ctrl+E',
			click(item, focusedWindow) {
				if (focusedWindow) openSyncsWindow();
			}
		}, {
			label: 'Configurações',
			accelerator: process.platform === 'darwin' ? 'Command+G' : 'Ctrl+G',
			click(item, focusedWindow) {
				if (focusedWindow) openConfigWindow();
			}
		}]
	}, {
		type: 'separator'
	}, {
		label: 'Comunicar Início',
		accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
		click(item, focusedWindow) {
			focusedWindow.webContents.send('startSyncComunication');
			// let msg = {
			//     username: os.userInfo().username,
			//     message: 'syncing'
			// };
			// socket.emit('messages', JSON.stringify(msg));
			// dialog.showMessageBox({
			//     title: "Informativo",
			//     message: "Notificação enviada!",
			//     buttons: ["OK"]
			// });
		}
	}, {
		label: 'Comunicar Término',
		accelerator: process.platform === 'darwin' ? 'Command+F' : 'Ctrl+F',
		click(item, focusedWindow) {
			focusedWindow.webContents.send('endSyncComunication');
			// let msg = {
			//     username: os.userInfo().username,
			//     message: 'doneSyncing'
			// };
			// socket.emit('messages', JSON.stringify(msg));
			// dialog.showMessageBox({
			//     title: "Informativo",
			//     message: "Notificação enviada!",
			//     buttons: ["OK"]
			// });
		}
	}, {
		type: 'separator'
	}, {
		label: 'Chat',
		accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
		click(item, focusedWindow) {
			if (focusedWindow) openChatWindow();
		}
	}, {
		type: 'separator'
	}, {
		label: 'Recarregar',
		accelerator: 'CmdOrCtrl+R',
		click(item, focusedWindow) {
			if (focusedWindow) focusedWindow.reload()
		}
	}]
}, {
	label: 'Ferramentas',
	submenu: [{
		label: 'Diagnóstico',
		accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
		click(item, focusedWindow) {
			if (focusedWindow) focusedWindow.webContents.toggleDevTools()
		}
	}]
}, {
	label: 'Sair',
	click() {
		app.quit();
	}
}, {
	label: 'Sobre',
	click(item, focusedWindow) {
		openAboutWindow();
	}
}];

/**
 * Basic menu template
 */
const basicMenuTemplate = [{
	label: 'Recarregar',
	accelerator: 'CmdOrCtrl+R',
	click(item, focusedWindow) {
		if (focusedWindow) focusedWindow.reload()
	}
}, {
	label: 'Ferramentas',
	submenu: [{
		label: 'Diagnóstico',
		accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
		click(item, focusedWindow) {
			if (focusedWindow) focusedWindow.webContents.toggleDevTools()
		}
	}]
},
{
	label: 'Fechar',
	click(item, focusedWindow) {
		if (focusedWindow) focusedWindow.close()
	}
}
];

/**
 * Listen for the app to be ready
 */
app.on('ready', createMainWindow);

app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		socket.emit('eraseMessages');
		app.quit()
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createMainWindow()
	}
});

/**
 * Auto updates from here on down
 */
const sendStatusToWindow = (text) => {
	log.info(text);
	aboutWindow.webContents.send('update-content', text);
};

ipcMain.on('checkForUpdates', checkForUpdates);

function checkForUpdates() {
	// trigger autoupdate check
	autoUpdater.checkForUpdates();
}

autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Procurando por atualização...');
});

autoUpdater.on('update-available', info => {
	sendStatusToWindow('Atualização disponível.');
});

autoUpdater.on('update-not-available', info => {
	sendStatusToWindow('Atualização não disponível.');
});

autoUpdater.on('error', err => {
	sendStatusToWindow(`Error no atualizador: ${err.toString()}`);
});

autoUpdater.on('download-progress', progressObj => {
	sendStatusToWindow(
		`Velocidade: ${formatBytes(progressObj.bytesPerSecond)} /seg
         <br />Baixado: ${progressObj.percent.toFixed(2)}%
         <br />(${formatBytes(progressObj.transferred)} de ${formatBytes(progressObj.total)} + )`
	);
});

autoUpdater.on('update-downloaded', info => {
	sendStatusToWindow('Atualização baixada; Começando a atualização...');
});

autoUpdater.on('update-downloaded', info => {
	// Wait 5 seconds, then quit and install
	// In your application, you don't need to wait 500 ms.
	// You could call autoUpdater.quitAndInstall(); immediately
	autoUpdater.quitAndInstall();
});

function formatBytes(bytes, decimals) {
	if (bytes == 0) return '0 Bytes';
	var k = 1024,
		dm = decimals <= 0 ? 0 : decimals || 2,
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}