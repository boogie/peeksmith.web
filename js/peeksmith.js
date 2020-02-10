const SERVICE_UUID = 0xFFE0;
const CHARACTERISTIC_UUID = 0xFFE1;

let encoder = new TextEncoder('utf-8');
let characteristic;

const connectButton = document.getElementById('button-connect');
const messageTextField = document.getElementById('textarea-message');

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
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    await characteristic.writeValue(encoder.encode("/T5\n"));
    document.getElementById('initial-screen').style.display = 'none';
    document.getElementById('when-connected').style.display = 'block';
    messageTextField.focus();
    setInterval(_display, 100);
}

let queue = [];
let inProgress = false;

function messageKeyUp() {
    const message = this.value;
    display(`#${message.substring(0, 84)}\n`);
}

function display(message) {
    if (message[0] === '#') {
        queue = queue.filter(message => message[0] !== '#');
    }
    queue.unshift(message);
}

function _display() {
    if (inProgress) return;
    let buffer = queue.pop();
    if (typeof buffer === 'undefined') return;
    inProgress = true;
    console.log(buffer);
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
