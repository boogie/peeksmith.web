const batteryData = {};

class Logger {
    constructor(id) {
        this._id = id;
        this._el = document.getElementById(this._id);
        this._rows = [];
    }
    _add(html) {
        this._rows.push(html);
        if (this._rows.length > 350) {
            this._rows.shift();
        }
        this._el.innerHTML = this._rows.join('');
    }
    info(message) {
        const time = new Date().toISOString().substr(11, 12);
        this._add(`<p class="info"><span class="time">${time}</span> - <span class="message">${message}</span></p>`);
    }
    error(message) {
        const time = new Date().toISOString().substr(11, 12);
        this._add(`<p class="error"><span class="time">${time}</span> - <span class="message">${message}</span></p>`);
    }
}

class TextScroller {
    constructor(width, interval = 500) {
        this.width = width;
        this.interval = interval;
        this.timer = false;
        this.callback = null;
        this.text = '';
        this.scrollPos = 0;
        this.gapSize = 3;
    }
    onNewMessage(callback) {
        this.callback = callback;
    }
    setText(text) {
        this.text = text;
        this.scrollPos = 0;
    }
    start() {
        if (this.timer) return;
        if (this.text.length < this.width) { // don't scroll
            if (this.callback) this.callback(text);
            return;
        }
        this.timer = true;
        this.calculateNextText();
    }
    stop() {
        if (!this.timer) return;
        this.timer = false;
    }
    calculateNextText() {
        if (!this.timer) return;
        let text = (this.text + ' '.repeat(this.gapSize) + this.text).substr(this.scrollPos, this.width + 1);
        if (this.callback) this.callback(text);
        this.scrollPos++;
        let maxScrollPos = this.text.length + this.gapSize;
        if (this.scrollPos >= maxScrollPos) this.scrollPos = 0;
        setTimeout(this.calculateNextText.bind(this), this.interval);
    }
}

let cr = { x: 0, y: 0, z: 0 };

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
// var geometry = new THREE.BoxGeometry(300, 300, 300, 1, 1, 1);
// geometry.faces[0].color = new THREE.Color(0xd9d9d9);
// geometry.faces[1].color = new THREE.Color(0xd9d9d9);

// /*Left of spawn face*/
// geometry.faces[2].color = new THREE.Color(0x2196f3);
// geometry.faces[3].color = new THREE.Color(0x2196f3);

// /*Above spawn face*/
// geometry.faces[4].color = new THREE.Color(0xffffff);
// geometry.faces[5].color = new THREE.Color(0xffffff);

// /*Below spawn face*/
// geometry.faces[6].color = new THREE.Color(1, 0, 0);
// geometry.faces[7].color = new THREE.Color(1, 0, 0);

// /*Spawn face*/
// geometry.faces[8].color = new THREE.Color(0, 1, 0);
// geometry.faces[9].color = new THREE.Color(0, 1, 0);

// /*Opposite spawn face*/
// geometry.faces[10].color = new THREE.Color(0, 0, 1);
// geometry.faces[11].color = new THREE.Color(0, 0, 1);

// var material = new THREE.MeshBasicMaterial( {color: 0xffffff, vertexColors: THREE.FaceColors} );
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// camera.position.z = 1000;        
// function render() {
// requestAnimationFrame(render);
// cube.rotation.x = cr.x;
// cube.rotation.y = cr.y;
// cube.rotation.z = cr.z;
// renderer.render(scene, camera);
// };
// render();

let gdata = 0;

const screens = {
    initial: document.getElementById('initial-screen'),
    connecting: document.getElementById('connecting-screen'),
    connected: document.getElementById('connected-screen')
};
const deviceName = document.getElementById('device-name');
const deviceVoltage = document.getElementById('device-voltage');
const connectButton = document.getElementById('button-connect');
const runCodeButton = document.getElementById('button-run-code');
const testVibrationsButton = document.getElementById('button-test-vibrations');

const psAlignLeft = document.getElementById('button-ps-align-left');
const psAlignCenter = document.getElementById('button-ps-align-center');
const psAlignRight = document.getElementById('button-ps-align-right');

const psFontAuto = document.getElementById('button-ps-font-au');
const psFont16 = document.getElementById('button-ps-font-16');
const psFont24 = document.getElementById('button-ps-font-24');
const psFont32 = document.getElementById('button-ps-font-32');
const psFont64 = document.getElementById('button-ps-font-64');
const psFontRoboto = document.getElementById('button-ps-font-roboto');
const psFontSeven44 = document.getElementById('button-ps-font-seven44');

const psLongChar = document.getElementById('button-ps-long-f');
const psLongWord = document.getElementById('button-ps-long-t');
const psLongScroll = document.getElementById('button-ps-long-s');

const psScrollSpeed = document.getElementById('input-scroll-speed');

const startDiscoveryButton = document.getElementById('button-start-discovery');
const listPeersButton = document.getElementById('button-list-peers');
// const drawButton = document.getElementById('button-draw');
const messageTextField = document.getElementById('textarea-message');
const codeTextArea = document.getElementById('textarea-code');
const checkboxWrapText = document.getElementById('checkbox-wrap-text');

const sbWatchconnectButton = document.getElementById('button-sbwatch-connect');

const spottedConnectButton = document.getElementById('button-spotted-connect');

const espyonConnectButton = document.getElementById('button-espyon-connect');

const insightConnectButton = document.getElementById('button-insight-connect');
const secondSightConnectButton = document.getElementById('button-secondsight-connect');
const pitataBoardConnectButton = document.getElementById('button-pitataboard-connect');
const isknSlateConnectButton = document.getElementById('button-isknslate-connect');
const mindbusterConnectButton = document.getElementById('button-mindbuster-connect');
const bambooSlateConnectButton = document.getElementById('button-bambooslate-connect');

const boardCanvasWrapper = document.getElementById('board-canvas-wrapper');
const boardCanvas = document.getElementById('board-canvas');

const ghostMoveConnectButton = document.getElementById('button-ghostmove-connect');

const espyon = new EspyonDevice();
espyonConnectButton.addEventListener('click', async () => {
    await espyon.connect();
});

const insight = new InsightDevice();
insightConnectButton.addEventListener('click', async () => {
    await insight.connect();
});

const secondSight = new SecondSightDevice();
secondSightConnectButton.addEventListener('click', async () => {
    await secondSight.connect();
});

boardCanvasWrapper.style.display = 'none';

const mindbusterData = {
    lastX: 0,
    lastY: 0,
    lastPenDown: false,
};

const mindbuster = new MindBusterDevice();
mindbusterConnectButton.addEventListener('click', async () => {
    await mindbuster.connect();
    mindbuster.onMessage(data => {
        boardCanvasWrapper.style.display = 'block';
        console.log(data);
        if (data.type === 'pen write') {
            let x = data.x / 15;
            let y = 600 - data.y / 15;

            if (mindbusterData.lastPenDown === false) {
                mindbusterData.lastX = x - 1;
                mindbusterData.lastY = y - 1;
            }

            const diff = Math.abs(mindbusterData.lastX - x) + Math.abs(mindbusterData.lastY - y);
            if (diff > 20) {
                mindbusterData.lastX = x - 1;
                mindbusterData.lastY = y - 1;
            }

            ctx = boardCanvas.getContext('2d');
            ctx.fillStyle = '#F0DB4F';
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mindbusterData.lastX, mindbusterData.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            mindbusterData.lastX = x;
            mindbusterData.lastY = y;
            mindbusterData.lastPenDown = true;
        }
        if (data.type === 'pen up') {
            mindbusterData.lastPenDown = false;
        }
    });
});

const isknData = {
    lastX: 0,
    lastY: 0,
    lastStrength: 0,
};
const isknSlate = new ISKNSlateDevice();
const isknSlateEvents = ['0', '1', '2', 'status', '4', '5', '6', '7', 'button', '9', '10'];
isknSlateConnectButton.addEventListener('click', async () => {
    let chain = 0, data = [];
    await isknSlate.connect();
    isknSlate.onMessage((source, message) => {
        boardCanvasWrapper.style.display = 'block';
        if (source === 0) {
            // console.log(source, message);
            if (chain === 0) {
                let [c0, c1, c2, eventType, ...eventData] = message;
                if (eventType === 23) {
                    chain = 1;
                    data = eventData;
                }
            }
            else if (chain > 0) {
                chain--;
                data.push(...message);
                if (chain === 0) {
                    data = data.slice(0, 25);
                    // const blocks = [];
                    while (data.length) {
                        const [xLow, xHigh, yLow, yHigh, penDown] = data.splice(0, 5);
                        if (penDown <= 1) {
                            const x = ((xHigh << 8) | xLow) / 60;
                            const y = ((yHigh << 8) | yLow) / 60;
                            console.log(penDown, x, y);

                            ctx = boardCanvas.getContext('2d');
                            ctx.fillStyle = '#F0DB4F';
                            ctx.strokeStyle = 'red';
                            if (penDown > 0) {
                                if (isknData.lastpenDown === 0) {
                                    isknData.lastX = x;
                                    isknData.lastY = y;
                                }
                                ctx.lineWidth = 1; // + penDown / 10;
                                ctx.beginPath();
                                ctx.moveTo(isknData.lastX, isknData.lastY);
                                ctx.lineTo(x, y);
                                ctx.stroke();
                            }
                            isknData.lastX = x;
                            isknData.lastY = y;
                            isknData.lastpenDown = penDown;
                            // d(x, y, strength);
                        } else {
                            console.log(penDown);
                        }
                        // .map(x => x.toString(16).padStart(2, '0')).join(' ');
                        // blocks.push( block );
                        // console.log(block);
                    }
                    // console.log(quads);
                }
                // console.log('-------------');
            }
        }
        if (source === 1) {
            let [c0, c1, c2, eventType, ...eventData] = message;
            if (eventType === 3) {
                eventData = eventData.slice(0, 4);
            }
            if (eventType === 8) {
                eventData = eventData.slice(0, 3);
                console.log(eventType, isknSlateEvents[eventType], eventData);
                ctx = boardCanvas.getContext('2d');
                ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
            }
            // console.log(eventType, isknSlateEvents[eventType], eventData);
        }
        // 179, 165, 225, 3, 255, 3, 156, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

        // 179, 165, 225, 8, 2, 66, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    });
});

const bambooSlate = new BambooSlateDevice();
bambooSlateConnectButton.addEventListener('click', async () => {
    await bambooSlate.connect();
});
bambooSlate.onMessage(({ type, data, rawData }) => {
    boardCanvasWrapper.style.display = 'block';
    console.log(type, data);
    // console.log(rawData.map(b => b.toString(16).padStart(2, '0')).join(' '));
});

const pitataBoard = new PitataBoardDevice();
pitataBoardConnectButton.addEventListener('click', async () => {
    await pitataBoard.connect();
});
const pitataData = {
    lastX: 0,
    lastY: 0,
    lastStrength: 0,
};

let s = [];

let c = () => {
    display.send('#\n');
    s = [];
};

let d = (x, y, strength) => {
    if (strength > 0) {
        x = Math.floor(x / 10); if (x > 127) x = 127;
        y = Math.floor(y / 10); if (y > 31) y = 31;
        const m = `@P${Math.floor(y)},${Math.floor(x)}\n@D\n`;
        if (!s.includes(m)) {
            console.log(m);
            display.send(m);
            s.push(m);
            console.log(display._queue.length);
        }
    }
};
pitataBoard.onMessage(data => {
    boardCanvasWrapper.style.display = 'block';
    ctx = boardCanvas.getContext('2d');
    ctx.fillStyle = '#F0DB4F';
    ctx.strokeStyle = 'red';
    while (data.length > 0) {
        const chunk = data.splice(0, 10);
        const [
            msgType,
            tip,
            yLow,
            yHi,
            xLow,
            xHi,
            strengthLow,
            strengthHi,
            zero0,
            zero1
        ] = chunk;
        const x = (xLow + (xHi << 8)) / 20;
        const y = (yLow + (yHi << 8)) / 20;
        const strength = strengthLow + (strengthHi << 8);

        // console.log({ x, y, strength, tip });

        if (x < 10 && y < 10 && strength > 0) {
            ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
        }

        if (strength > 0) {
            if (pitataData.lastStrength === 0) {
                pitataData.lastX = x;
                pitataData.lastY = y;
            }
            ctx.lineWidth = 1; // + strength / 10;
            ctx.beginPath();
            ctx.moveTo(pitataData.lastX, pitataData.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        pitataData.lastX = x;
        pitataData.lastY = y;
        pitataData.lastStrength = strength;
        d(x, y, strength);
    }
});

const logger = new Logger('log');
const display = new PeekSmithDevice({ logger });
display.onConnecting(() => {
    console.log('connecting...');
    screens.connecting.style.display = 'block';
    screens.initial.style.display = 'none';
    screens.connected.style.display = 'none';
});
display.onConnect(() => {
    if (display._hardwareType === 'Display') {
        if (display._hardwareVersion === 1) {
            deviceName.innerText = 'PeekSmith One';
        } else if (display._hardwareVersion === 2) {
            deviceName.innerText = 'PeekSmith Two';
        } else {
            deviceName.innerText = 'PeekSmith Three';
        }
    } else
        if (display._hardwareType === 'Gyro') {
            deviceName.innerText = 'PeekSmith Gyro';
        } else {
            deviceName.innerText = 'Unknown';
        }
    messageTextField.value = '';
    screens.connecting.style.display = 'none';
    screens.initial.style.display = 'none';
    screens.connected.style.display = 'block';
    messageTextField.focus();
    for (button of document.getElementsByClassName('button-ps-align')) button.classList.remove('active');
    psAlignCenter.classList.add('active');
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFontAuto.classList.add('active');
    for (button of document.getElementsByClassName('button-ps-long')) button.classList.remove('active');
    psLongChar.classList.add('active');
    psScrollSpeed.value = "50";
});
display.onDisconnect(() => {
    deviceName.innerText = 'PeekSmith';
    deviceVoltage.innerText = '';
    screens.connecting.style.display = 'none';
    screens.initial.style.display = 'block';
    screens.connected.style.display = 'none';
});
display.onMessage(message => {
    // console.log(`message: ${message}`);
});
display.onBatteryVoltage(voltage => {
    deviceVoltage.innerText = `(${voltage / 1000}v)`;
    logger.info(`battery voltage: ${voltage}`);
    batteryData[new Date().toISOString().substr(11, 5)] = voltage;
});
connectButton.addEventListener('click', async () => {
    await display.connect();
});
const sendPSText = () => {
    const message = messageTextField.value;
    const wrap = checkboxWrapText.checked;
    display.displayText(message, wrap);
};
messageTextField.addEventListener('keyup', () => {
    sendPSText();
});
checkboxWrapText.addEventListener('click', () => {
    const message = messageTextField.value;
    const wrap = checkboxWrapText.checked;
    display.displayText(message, wrap);
});
psAlignLeft.addEventListener('click', () => {
    psAlignLeft.classList.add('active');
    psAlignCenter.classList.remove('active');
    psAlignRight.classList.remove('active');
    display.send('/Tal\n');
});
psAlignCenter.addEventListener('click', () => {
    psAlignLeft.classList.remove('active');
    psAlignCenter.classList.add('active');
    psAlignRight.classList.remove('active');
    display.send('/Tac\n');
});
psAlignRight.addEventListener('click', () => {
    psAlignLeft.classList.remove('active');
    psAlignCenter.classList.remove('active');
    psAlignRight.classList.add('active');
    display.send('/Tar\n');
});
psFontAuto.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFontAuto.classList.add('active');
    display.send('/Tfau\n');
    sendPSText();
});
psFont16.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFont16.classList.add('active');
    display.send('/Tf16\n');
    sendPSText();
});
psFont24.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFont24.classList.add('active');
    display.send('/Tf24\n');
    sendPSText();
});
psFont32.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFont32.classList.add('active');
    display.send('/Tf32\n');
    sendPSText();
});
psFont64.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFont64.classList.add('active');
    display.send('/Tf64\n');
    sendPSText();
});
psFontRoboto.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFontRoboto.classList.add('active');
    display.send('/Tfro\n');
    sendPSText();
});
psFontSeven44.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-font')) button.classList.remove('active');
    psFontSeven44.classList.add('active');
    display.send('/Tfs44\n');
    sendPSText();
});
psLongChar.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-long')) button.classList.remove('active');
    psLongChar.classList.add('active');
    display.send('/Twf\n');
    sendPSText();
});
psLongWord.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-long')) button.classList.remove('active');
    psLongWord.classList.add('active');
    display.send('/Twt\n');
    sendPSText();
});
psLongScroll.addEventListener('click', () => {
    for (button of document.getElementsByClassName('button-ps-long')) button.classList.remove('active');
    psLongScroll.classList.add('active');
    display.send('/Tws\n');
    sendPSText();
});
psScrollSpeed.addEventListener('change', () => {
    let value = +psScrollSpeed.value;
    if (value > 255) value = 255;
    display.send(`/Ts${value}\n`);
    sendPSText();
});

runCodeButton.addEventListener('click', async () => {
    // await display.writeCode(codeTextArea.value);
    console.log('huhu');
    await display.runCode();
});
testVibrationsButton.addEventListener('click', () => {
    display.testVibrations();
});
startDiscoveryButton.addEventListener('click', () => {
    display.startDiscovery();
});
listPeersButton.addEventListener('click', () => {
    display.listPeers();
});
// drawButton.addEventListener('click', () => {
//     const code = codeTextField.value;

//     const errors = [];
//     const messages = [];
//     const operations = [
//         { name: 'circle', argCount: 3, message: '@C' },
//         { name: 'rectangle', argCount: 4, message: '@R' },
//         { name: 'dot', argCount: 2, message: '@P' },
//         { name: 'line', argCount: 4, message: '@L' },
//         { name: 'text', argCount: 4, message: '@T' }
//     ];

//     const processCommand = command => {
//         const errors = [];
//         const [_, name, argsStr] = command.match(/^(\w+)\((.*?)\)$/);
//         const args = argsStr.split(/,/).map(arg => {
//             arg = arg.trim();
//             if (arg[0] === '"' && arg[arg.length - 1] === '"') {
//                 arg = arg.substring(1, arg.length - 1);
//             } else
//             if (arg[0] === '\'' && arg[arg.length - 1] === '\'') {
//                 arg = arg.substring(1, arg.length - 1);
//             } else
//             if (arg.match(/^\d+$/)) {
//                 arg = parseInt(arg, 10);
//             } else {
//                 arg = '';
//                 errors.push('Cannot process arguments.');
//             }
//             return arg;
//         });
//         if (errors.length) return { errors };
//         return { name, args };
//     }

//     const translateCommand = (command, operation) => {
//         return operation.message + command.args.join(',') + '\n';
//     };

//     code
//         .split('\n')
//         .map((row, index) => ({ line: index, command: row.replace(/\s*(\/\/|\#).*?$/, '').trim() }))
//         .filter(row => row.command !== '')
//         .forEach(row => {
//             let command = processCommand(row.command);
//             if (command.error) {
//                 return errors.push({ line: row.line, error: command.error });
//             }
//             let operation = operations.find(c => c.name === command.name);
//             if (!operation) {
//                 return { line: row.line, error: 'Unknown command.' }
//             }
//             let message = translateCommand(command, operation);
//             messages.push(message);
//         });

//     display._queue.unshift('@E\n' + messages.join('') + '@D\n');
// })

let timeout;
espyon.onMessage(code => {
    code = code.trim();
    console.log(code);
    const cards = {
        '04 34 9B 12 BD 66 81': 'A of ' + String.fromCharCode(6),
        '04 66 87 12 BD 66 81': '2 of ' + String.fromCharCode(6),
        '04 2D 84 12 BD 66 81': '3 of ' + String.fromCharCode(6),
        '04 7C 82 12 BD 66 80': '4 of ' + String.fromCharCode(6),
        '04 60 75 12 BD 66 80': '5 of ' + String.fromCharCode(6),
        '04 57 84 12 BD 66 80': '7 of ' + String.fromCharCode(6),
        '04 78 93 12 BD 66 80': '8 of ' + String.fromCharCode(6), // S
        '04 B3 9C 12 BD 66 80': '6 of ' + String.fromCharCode(4), // D
        '04 74 94 12 BD 66 80': '2 of ' + String.fromCharCode(3), // H
        '04 1A 98 12 BD 66 81': '8 of ' + String.fromCharCode(4), // D
        '04 01 93 12 BD 66 81': '9 of ' + String.fromCharCode(6), // S
        '04 5D 9B 12 BD 66 81': 'K of ' + String.fromCharCode(3), // H
        '04 2F 92 12 BD 66 80': 'J of ' + String.fromCharCode(4), // D
        '04 6E 62 12 BD 66 81': 'Q of ' + String.fromCharCode(3), // H
        '04 69 62 12 BD 66 81': 'A of ' + String.fromCharCode(4), // D
        '04 AB 95 12 BD 66 80': 'J of ' + String.fromCharCode(6), // S
        '04 35 7C 12 BD 66 81': '10 of ' + String.fromCharCode(5),
        '04 A6 9B 12 BD 66 80': '9 of ' + String.fromCharCode(4), // D
        '04 F0 A5 12 BD 66 80': '10 of ' + String.fromCharCode(4), // D
        '04 84 96 12 BD 66 80': 'Q of ' + String.fromCharCode(6), // S
        '04 CC A0 12 BD 66 80': 'J of ' + String.fromCharCode(4), // D
    }
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => { display.displayText(''); }, 200);
    if (cards[code]) {
        display.displayText(cards[code]);
    } else {
        // console.log(code);
    }
})

insight.onMessage(code => {
    console.log(code);
    let colors = ['', String.fromCharCode(5), String.fromCharCode(3), String.fromCharCode(6), String.fromCharCode(4)];
    let values = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let esp = ['', 'circle', 'cross', 'waves', 'square', 'star']
    let message = code.filter(c => c > 0).map(c => {
        let color = ~~(c / 16);
        let value = c % 16;
        if (color === 0) return esp[value];
        return colors[color] + values[value];
    }).join(' ');
    console.log(message);
    display.displayText(message);
});

secondSight.onMessage(data => {
    const color = data[9];
    const value = data[10];
    const description = data.slice(11).filter(ascii => ascii > 0).map(ascii => String.fromCharCode(ascii)).join('');
    if (color && value) {
        console.log(color, value);
    } else
        if (description) {
            console.log(description);
        }
});

// ghostMove.onOrientation(orientation => {
//     let orientationColors = ['white', 'yellow', 'blue', 'green', 'orange', 'red'];
//     display.displayText(orientationColors[orientation]);
// });

const bookTest = {
    dexterBook: {
        11: 'Mely levegot vettem Lassan es egyenletesen',
        12: 'Ez nagyon jo volt igy Elindultunk',
        13: 'fuszalakat Ezt meg melyebb csend kovette',
        14: 'a kertben megallt ram akart nezni',
        15: 'szabad hagynom hogy attorjon jeghideg onuralmamom',
        16: 'Orange-dzsal ott harom volt vagy kifelejtettem',
        21: 'hogy a bun elleni harc a',
        22: 'oroltkave-zacc rothado gyumolcs es romlott disznohus',
        23: 'elhallgatott majd egyszer csak valami egeszen',
        24: 'munkajukat a termszetes kozegukben feleltem talalkoztal',
        25: 'Ezt most meg nehez megmondani felelte',
        26: 'Van abban valami kulonos es lefegyverzo',
        31: 'Udv kapitany koszontotte LaGuerta megkertem Morgan',
        32: 'Aha Es mar ot perce azon gondolkozik',
        33: 'voltam hires a megerzeseim gyakran egeszen',
        34: 'aznap ejjel munka utan kihajoztam hogy',
        35: 'pontosan tudva milyen szivet tepo suletlensegeket',
        36: 'reszig amikor szetdarabolja a testet hogy',
        41: 'nem az idonk legalabb feleben Persze',
        42: 'Masnap reggel esett az utakon urra',
        43: 'Deb raktam az asztalomra a feher',
        44: 'eloszor Harry tekintete volt ugyanazok a',
        45: 'de tudja hogy valami nincs rendben',
        46: 'O nehogy mar te is higgy',
        51: 'osszes lakoja megszunne letezni termeszetesen magamon',
        52: 'nem jelentette ki halkan Cody viccelodott',
        53: 'most jo ejszakat gyerekek legyetek jok',
        54: 'kupac gondosan becsomagolt emberi testreszt talatak',
        55: 'felideztem a gondosan elrendezett testreszeket a',
        56: 'ideje mar nem probaltam kitalalni hanem',
        61: 'meg mindig a titokzatos szemtanu utan',
        62: 'nekialltam az evesnek es elkezdtem Deborah',
        63: 'hmm talan bar a tegnapi hulla',
        64: 'elmeletben a rendorkapitanysag hetvenket oras eligazitasa',
        65: 'szobaban miert o volt az egyetlen',
        66: 'Az utolso aldozatnal szeretnem ellenorizni hogy',
    },
    winnieThePoohBook: {
        11: 'So Winnie-the-Pooh went round to his',
        12: 'I wonder if you\'ve got such',
        13: 'a big blue one and had',
        14: 'you took your gun with you',
        15: 'After a little while he called',
        16: 'you did that it would help',
        21: 'That\'s just how I feel I',
        22: 'Edward Bear known to his friends',
        23: 'Tra-la-la tra-la-la tra-la-la tra-la-la rum-tum-tiddle-um-um Tiddle-iddle',
        24: 'Well he was humming this hum',
        25: 'No said Rabbit in a different',
        26: 'So Pooh pushed and pushed and',
        31: 'So for a week Christopher Robin',
        32: 'So he took hold of Pooh\'s',
        33: 'And Christopher Robin and Rabbit and',
        34: 'The Piglet lived in a very',
        35: 'Well there you are that proves',
        36: 'something else and when Piglet called',
        41: 'Do you see Piglet Look at their',
        42: 'the whistle again he looked up',
        43: 'Christopher Robin came slowly down his',
        44: 'The old grey donkey Eeyore stood',
        45: 'Why and sometimes he thought Wherefore',
        46: 'What has happened to it said',
        51: 'Excuse me Pooh I didn\'t You',
        52: 'For some time now Pooh had',
        53: 'I just came across it in',
        54: 'and as nobody seemed to want',
        55: 'Who found the Tail I said',
        56: 'One day when Christopher Robin and',
        61: 'let remembered that if they put',
        62: 'you never can tell said Pooh',
        63: 'Yes but it isn\'t quite a',
        64: 'should know it was honey That\'s',
        65: 'he lay there miseably but when',
        66: 'shape and no more But as',
    }

};

const spottedDevices = [];
const spottedValues = [];
const spottedMovemenets = [];
const spottedMagnets = [];
spottedConnectButton.addEventListener('click', async () => {
    const spotted = new SpottedDevice();
    await spotted.connect();
    let spottedDeviceID = spottedDevices.length;
    spottedDevices.push(spotted);
    spottedValues.push(' ');
    spottedMovemenets.push(' ');
    spottedMagnets.push(' ');
    spotted.onMessage(data => {
        console.log(data);
        if (data.substr(0, 3) === 'iso') {
            spottedValues[spottedDeviceID] = data[3];
            spottedMovemenets[spottedDeviceID] = ' ';
        }
        if (data.substr(0, 3) === 'iem') {
            spottedMovemenets[spottedDeviceID] = 'x';
        }
        if (data.substr(0, 3) === 'ier') {
            spottedMagnets[spottedDeviceID] = data[3] === 'c' ? 'x' : ' ';
        }
        // console.log(spottedValues, spottedMovemenets, spottedMagnets);
        deviceName.innerText = `[${spottedValues[spottedDeviceID]}] [${spottedMovemenets[spottedDeviceID]}] [${spottedMagnets[spottedDeviceID]}]`;

        // display.displayText(spottedValues.join(' '));

        // let dice = ['@E\n'];
        // let x = 0;
        // spottedValues.forEach(value => {
        //     dice.push(`@R${x},0,31,31,0,5\n`);
        //     if (value == 1) dice.push(`@C${x + 15},15,3,1\n`);
        //     if (value == 2) dice.push(`@C${x + 8},8,3,1\n@C${x + 22},22,3,1\n`);
        //     if (value == 3) dice.push(`@C${x + 8},8,3,1\n@C${x + 15},15,3,1\n@C${x + 22},22,3,1\n`);
        //     if (value == 4) dice.push(`@C${x + 8},8,3,1\n@C${x + 8},22,3,1\n@C${x + 22},8,3,1\n@C${x + 22},22,3,1\n`);
        //     if (value == 5) dice.push(`@C${x + 8},8,3,1\n@C${x + 8},22,3,1\n@C${x + 22},8,3,1\n@C${x + 22},22,3,1\n@C${x + 15},15,3,1\n`);
        //     if (value == 6) dice.push(`@C${x + 8},8,3,1\n@C${x + 8},22,3,1\n@C${x + 15},8,3,1\n@C${x + 15},22,3,1\n@C${x + 22},8,3,1\n@C${x + 22},22,3,1\n`);
        //     x += 48;
        // })
        // dice.push('@D\n');
        // console.log(dice);
        // display._queue = display._queue.filter(message =>
        //     message[0] !== '#' &&
        //     message.substring(0, 5) !== '@E\n@R' &&
        //     message.substring(0, 5) !== '@E\n@T'
        // );
        // display._queue.unshift(dice.join(''));

        // let [p1, p2, w] = spottedValues;
        // display.displayText(bookTest.winnieThePoohBook[p1 + p2].split(' ')[w - 1]);
    });
});

const ghostMoveDevices = [];
const ghostMoveMovements = [];
const ghostMoveTimers = [];
ghostMoveConnectButton.addEventListener('click', async () => {
    const ghostMoveDeviceID = 0; // ghostMoveDevices.length;
    const ghostMove = new GhostMoveDevice();
    await ghostMove.connect();
    // await ghostMove.subscribeToOrientationData();
    await ghostMove.subscribeToButtonEvents();
    await ghostMove.subscribeToTapEvents();
    ghostMoveDevices.push(ghostMove);
    ghostMoveMovements.push(false);
    ghostMove.onMovement(() => {
        console.log(ghostMoveDeviceID);
        ghostMoveMovements[ghostMoveDeviceID] = true;
        if (ghostMoveTimers[ghostMoveDeviceID]) {
            clearTimeout(ghostMoveTimers[ghostMoveDeviceID]);
        }
        display.displayText(ghostMoveMovements.map(v => v ? 'X' : '-').join(' '));
        ghostMoveTimers[ghostMoveDeviceID] = setTimeout(() => {
            ghostMoveMovements[ghostMoveDeviceID] = false;
            display.displayText(ghostMoveMovements.map(v => v ? 'X' : '-').join(' '));
        }, 500);
    });
    // await ghostMove.subscribeToAcceleratorData();
    // display.displayText(bookTest.dexterBook[p1 + p2].split(' ')[w-1]);
});

const sbWatchDevice = new SBWatchDevice();
sbWatchconnectButton.addEventListener('click', async () => {
    await sbWatchDevice.connect();
});

const canvas = [];

const clear = () => {
    for (y = 0; y <= 79; y++) { canvas[y] = []; for (x = 0; x <= 159; x++) { canvas[y][x] = 0; } };
}

const circle = () => {
    for (i = 0; i < 359; i += 0.5) {
        y = Math.floor(40 + 35 * Math.sin(i / Math.PI / 2));
        x = Math.floor(80 + 35 * Math.cos(i / Math.PI / 4));
        canvas[y][x] = 1;
    }
}

const draw = async (_x = 0, _y = 0) => {
    await display._characteristicCustom.writeValueWithoutResponse(Uint8Array.from([0x21, 0]));
    color = 1; {
        for (y = 0; y < 79; y++) {
            buffer = [];
            buffer.push(color, 0, y);
            for (let x = 0; x < 159; x += 8) {
                bits = canvas[y + _y][x + _x + 0] * 128 + canvas[y + _y][x + _x + 1] * 64 + canvas[y + _y][x + _x + 2] * 32 + canvas[y + _y][x + _x + 3] * 16 + canvas[y + _y][x + _x + 4] * 8 + canvas[y + _y][x + _x + 5] * 4 + canvas[y + _y][x + _x + 6] * 2 + canvas[y + _y][x + _x + 7] * 1;
                buffer.push(bits);
            }
            y++;
            for (let x = 0; x < 159; x += 8) {
                bits = canvas[y + _y][x + _x + 0] * 128 + canvas[y + _y][x + _x + 1] * 64 + canvas[y + _y][x + _x + 2] * 32 + canvas[y + _y][x + _x + 3] * 16 + canvas[y + _y][x + _x + 4] * 8 + canvas[y + _y][x + _x + 5] * 4 + canvas[y + _y][x + _x + 6] * 2 + canvas[y + _y][x + _x + 7] * 1;
                buffer.push(bits);
            }
            await display._characteristicCustom.writeValueWithoutResponse(Uint8Array.from([0x21, ...buffer]));
        }
    }
    await display._characteristicCustom.writeValueWithoutResponse(Uint8Array.from([0x21, 255]));
}