const SERVICE_UUID = 0xFFE0;
const CHARACTERISTIC_UUID = 0xFFE1;

let encoder = new TextEncoder('utf-8');
let characteristic;

const connectButton = document.getElementById('button-connect');
const messageTextField = document.getElementById('textarea-message');
const checkboxWrapText = document.getElementById('checkbox-wrap-text');

connectButton.addEventListener('click', connectDevice);
messageTextField.addEventListener('keyup', messageKeyUp);

async function requestDevice() {
    return navigator.bluetooth.requestDevice({
        filters: [{
            namePrefix: 'PeekSmith-'
        }],
        optionalServices: [SERVICE_UUID]
    });
}

async function connectDevice() {
    const device = await requestDevice();
    device.addEventListener('gattserverdisconnected', deviceDisconnected);
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    await characteristic.writeValue(encoder.encode("/T5\n"));
    messageTextField.value = '';
    document.getElementById('initial-screen').style.display = 'none';
    document.getElementById('when-connected').style.display = 'block';
    messageTextField.focus();
    setInterval(_display, 100);
}

function deviceDisconnected() {
    document.getElementById('initial-screen').style.display = 'block';
    document.getElementById('when-connected').style.display = 'none';
}

let queue = [];
let inProgress = false;

function messageKeyUp() {
    const message = this.value;
    const wrap = checkboxWrapText.checked;
    const formattedMessage = formatMessage(message, wrap);    
    display(formattedMessage);
}

function formatMessage(message, wrap) {
    let formattedMessage = wrap ? wrapMessage(message) : message;
    return `#${formattedMessage}\n`;
}

function wrapMessage(message, step = 0) {
    const steps = [
        { columns: 7, rows: 1 },
        { columns: 10, rows: 2 },
        { columns: 21, rows: 4 }
    ];
    const constraints = steps[step];
    let words = message.split(/\s+/);
    let rows = [''];
    words.forEach(word => {
        if (rows[0].length === constraints.columns) {
            rows.unshift('');
        }
        let needsSpace = rows[0].length > 0;
        if (rows[0].length + (needsSpace ? 1 : 0) + word.length <= constraints.columns) {
            if (needsSpace) rows[0] += ' ';
            rows[0] += word;
        } else {
            if (word.length < constraints.columns) {
                rows.unshift(word);
            } else {
                while (word.length) {
                    rows.unshift(word.substring(0, constraints.columns));
                    word = word.substring(constraints.columns);
                }
            }
        }
    });
    rows = rows.map(row => row + ' '.repeat(constraints.columns - row.length));
    if (rows.length > constraints.rows && step < 2) return wrapMessage(message, step + 1);
    return rows.reverse().join('');
}

function display(message) {
    if (message[0] === '#') {
        queue = queue.filter(message => message[0] !== '#');
    }
    queue.unshift(message);
}

function _display() {
    if (inProgress || queue.length === 0) return;
    let buffer = queue.pop();
    inProgress = true;
    const maxLength = 19;
    function send() {
        if (buffer.length === 0) {
            inProgress = false;
            return;
        }
        characteristic.writeValue(encoder.encode(buffer.substring(0, maxLength))).then(()=>{
            buffer = buffer.substring(maxLength);
            setTimeout(send, 50);
        });
    }
    send();
}
