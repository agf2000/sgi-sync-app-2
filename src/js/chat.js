const {
    ipcRenderer,
    remote
} = eRequire('electron');
const fse = eRequire('fs-extra');
const notifier = eRequire('node-notifier');
const path = eRequire('path');
const pjson = eRequire('./../../package.json');
const os = require('os');

const mainWin = remote.getCurrentWindow();

const destPath = 'c:\\softer\\sincronizador\\config';

fse.readFile(`${destPath}\\config.json`, function (err, data) {
    if (err) {
        return console.log(err);
    }

    let fileRead = fse.readFileSync(`${destPath}\\config.json`, 'utf8');
    config = JSON.parse(fileRead);

    let socket = io(`http://${config.chatServer}`);

    let typing = false,
        typingTimer = null;

    let author = os.userInfo().username; // $('input[name="username"]').val();
    $('input[name="username"]').val(author);
    let message = $('input[name="message"]').val();

    function renderMessages(message) {
        $('#chatWindow').append(`
            <div class="d-flex flex-justify-between">
                <div class="author p-1">${message.author}</div>
                <div class="timing">${(new Date().format("%k:%M"))}</div>
            </div>
            <div class="msg sb2">${message.message}</div>`);
        $('#message').val('');

        // let newColor = getRandomColor();
        // presentColor = newColor;
        // $('#messages .msg').css({ 'background-color': newColor });
        // $('#messages .author').css({ 'color': newColor });

        if (message.author !== author) {
            if (!mainWin.isFocused() && mainWin.isDestroyed()) {
                notifier.notify({
                    title: 'Chat',
                    message: `${message.author} diz: ${message.message}`,
                    sound: true, // true | false.
                    wait: true, // Wait for User Action against Notification
                    icon: path.join(__dirname, '../img/icon.png'),
                    // timeout: 10
                },
                    function (err, response) {
                        // Response is response from notification
                        console.log(response);
                    }
                );

                notifier.on('click', function (notifierObject, options) {
                    if (mainWin.isVisible()) {
                        mainWin.focus();
                    } else if (mainWin.isDestroyed()) {
                        mainWin.show();
                    }
                });
            }
        }
    }

    function isTyping(message) {
        $('#typingIndicator').html('<strong>' + message.author + '</strong> ' + message.message);
    }

    socket.on('previewsMessages', messages => {
        for (message of messages) {
            renderMessages(message);
        }
    });

    socket.on('receivedMessage', message => {
        renderMessages(message);
    });

    socket.on('typing', message => {
        isTyping(message);
        if (mainWin.isMinimized()) {
            // mainWin.restore();
            notifier.notify({
                title: 'Chat',
                message: `${message.author} está digitando.`,
                sound: true, // true | false.
                wait: true, // Wait for User Action against Notification
                icon: path.join(__dirname, '../img/icon.png'),
                // timeout: 10
            },
                function (err, response) {
                    // Response is response from notification
                    console.log(response);
                }
            );

            notifier.on('click', function (notifierObject, options) {
                if (mainWin.isVisible()) {
                    mainWin.focus();
                } else if (mainWin.isDestroyed()) {
                    mainWin.show();
                } else if (mainWin.isMinimized()) {
                    mainWin.restore();
                }
            });
        }
    });

    socket.on('done-typing', message => {
        isTyping(message);
    });

    $('input[name="message"]').keypress(function (event) {
        const username = $('input[name="username"]').val();
        if (!typing) {
            typing = true;
            socket.emit('typing', { username });
        }
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
        typingTimer = setTimeout(() => {
            typing = false;
            socket.emit('done-typing', { username });
        }, 5000);
    });

    $('#btnSend').click(function (event) {
        event.preventDefault();

        if (author.length && $('input[name="message"]').val().length) {
            let messageObject = {
                author: $('input[name="username"]').val(),
                message: $('input[name="message"]').val()
            };

            renderMessages(messageObject);

            socket.emit('sendMessage', messageObject);
        }
    });

    function getRandomColor() {
        let letters = '0123456789'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 10)];
        }
        return color;
    }

    $('#message').focus();

    $('#appVersion').html(`${pjson.version}`);

});