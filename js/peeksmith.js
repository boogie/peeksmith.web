
class PeekSmithDevice {
    constructor() {
        this.SERVICE_UUID = 0xFFE0;
        this.CHARACTERISTIC_UUID = 0xFFE1;
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
        this._batteryVoltageCallback = null;
        this._queue = [];
        this._communicationIsInProgress = false;
        this._displayInterval = null;
        this._hardwareVersion = 1;
        this._batteryVoltage = null;
        this._characteristicLimit = 19;
    }
    onConnecting(callback) {
        this._connectingCallback = callback;
        return this;
    }
    onConnect(callback) {
        this._connectCallback = callback;
        return this;
    }
    onDisconnect(callback) {
        this._disconnectCallback = callback;
        return this;
    }
    onMessage(callback) {
        this._messageCallback = callback;
        return this;
    }
    onBatteryVoltage(callback) {
        this._batteryVoltageCallback = callback;
        return this;
    }
    _notification(event) {
        const characteristicValue = event.target.value;
        Array.from(new Uint8Array(characteristicValue.buffer))
            .map(ascii => String.fromCharCode(ascii))
            .join('')
            .match(/(.*)\n/gm)
            .map(message => message.trim())
            .forEach(message => {
                const messageType = message[0];
                if (this._messageCallback) this._messageCallback(message);
                if (messageType === 'i') {
                    const variableName = message[1];
                    const variableValue = message.substring(2);
                    if (variableName === 'v') this._hardwareVersion = +variableValue;
                    if (variableName === 'b') {
                        this._batteryVoltage = +variableValue;
                        if (this._batteryVoltageCallback) this._batteryVoltageCallback(this._batteryVoltage);
                    }
                }
            });
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            console.log(device.name);
            if (device.name.match(/-02/)) {
                this._hardwareVersion = 2;
                this._characteristicLimit = 70;
            } else {
                this._hardwareVersion = 1;
                this._characteristicLimit = 19;
            }
            console.log(this._hardwareVersion);
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
            if (this._hardwareVersion >= 2) await this._queryBatteryInfo();
        } catch (error) {
            console.log(error.message);
            return;
        }
        await this._connected();
    }
    displayText(message, wrap = false) {
        this._queue = this._queue.filter(message =>
            message[0] !== '#' &&
            message.substring(0,5) !== '@E\n@T'
        );
        let formattedText = this._formatText(message, wrap);
        this._queue.unshift(formattedText);
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'PeekSmith-'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
        await this._sendString('/T5\n');
        this._queue.unshift('/?b\n');
        this._queue.unshift('#Welcome\n');
        this._queue.unshift('/VL511\n~.\n');
        setTimeout(()=>{
            this._queue.unshift('/VL211\n~.\n');
        }, 1500);
        this._displayInterval = setInterval(this._display.bind(this), 100);
        if (this._hardwareVersion >= 2 ) {
            this._batteryInterval = setInterval(this._queryBatteryInfo.bind(this), 1000 * 30);
        }
    }
    async _disconnected() {
        if (this._displayInterval) clearInterval(this._displayInterval);
        if (this._batteryInterval) clearInterval(this._batteryInterval);
        if (this._disconnectCallback) this._disconnectCallback();
        deviceName.innerText = 'PeekSmith';
        deviceVoltage.innerText = '';
        this._hardwareVersion = null;
        this._batteryVoltage = null;
        this._characteristicLimit = 19;
    }
    _sendString(string) {
        const encoder = new TextEncoder('utf-8');
        return this._characteristic.writeValue(encoder.encode(string));
    }
    _formatText(text, wrap) {
        function wrapText(text, wrap, fontSize = 3) {
            const dimensions = {
                3: { columns: 7, rows: 1 },
                2: { columns: 11, rows: 2 },
                1: { columns: 21, rows: 4 }
            }[fontSize];
            const textLength = text.length;
            const lines = [];
            let currentLine = 0;
            for (let index = 0; index < textLength; index++) {
                let char = text[index];
                if (lines.length === currentLine) lines.push('');
                if (char === '\r') {
                    continue;
                }
                if (char === '\n') {
                    currentLine++;
                    continue;
                }
                if (wrap && char === ' ') {
                    let nextSpace = text.indexOf(' ', index + 1);
                    if (nextSpace === -1) nextSpace = text.length;
                    if (nextSpace - index + lines[currentLine].length > dimensions.columns) {
                        currentLine++;
                        continue;
                    }
                }
                if (lines[currentLine].length === dimensions.columns) {
                    currentLine++;
                    lines.push('');
                    if (char === ' ') continue;
                }
                lines[currentLine] += char;
            }
            if (lines[currentLine] === '') lines.pop();
            if (lines.length > dimensions.rows && fontSize > 1) return wrapText(text, wrap, fontSize - 1);
            return { fontSize, lines: lines.slice(0, 4), dimensions };
        }
        function displayText(fontSize, lines, dimensions) {
            function displaySimple(lines) {
                for (let lineIndex = 0; lineIndex < lines.length -1; lineIndex++)
                    lines[lineIndex] += ' '.repeat(dimensions.columns - lines[lineIndex].length);
                return `#${lines.join('')}\n`;
            }
            function displaySeparately(commands) { return `@E\n${commands.join('')}@D\n`; }
            function displayOneRow(x, y, fontSize, fontWidth, text) {
                let pieces = [];
                for (let i = 0; i < text.length; x += fontWidth, i++)
                    if (text[i] !== ' ')
                        pieces.push(`@T${x},${y},${fontSize},0,${text[i]}\n`);
                return pieces;
            }
            function calculateSpaceWidths(fontSize, words) {
                let screenWidth = 128;
                let charWidth = fontSize === 3 ? 16 : 10;
                let spaceBetweenChars = fontSize === 3 ? 1 : 2;
                let spaces = words.length - 1;
                let chars = words.reduce((count, word) => count + word.length, 0);
                let spaceLeft = screenWidth - (charWidth * chars + (chars - words.length) * spaceBetweenChars);
                let spaceWidths = [];
                while (spaces) {
                    let spaceWidth = Math.floor(spaceLeft / spaces);
                    spaceWidths.push(spaceWidth - spaceBetweenChars);
                    spaceLeft -= spaceWidth;
                    spaces--;
                }
                return spaceWidths;
            }
            function displayOneRowWithSpaces(x, y, fontSize, fontWidth, text) {
                let pieces = [];
                let words = text.split(' ');
                let spaceWidths = calculateSpaceWidths(fontSize, words);
                // console.log(spaceWidths);
                for (let i = 0; i < words.length; x += fontWidth * words[i].length + spaceWidths[i], i++)
                    pieces.push(`@T${x},${y},${fontSize},0,${words[i]}\n`);
                return pieces;
            }
            return displaySimple(lines);

            if (fontSize === 1) {
                return displaySimple(lines);
            }
            if (lines.length === 1 && fontSize >= 2) {
                const lineLength = lines[0].length;
                if (lineLength < 8)
                    return displaySimple(lines);
                if (lineLength === 8) {
                    let words = lines[0].split(' ');
                    return displaySeparately(words.length < 3 ? displayOneRow(0, 7, 3, 16, lines[0]) : displayOneRowWithSpaces(0, 7, 3, 16, lines[0]));
                }
                if (lineLength === 9 || lineLength === 10)
                    return displaySeparately([`@T0,11,2,0,${lines[0]}\n`]);
                return displaySeparately(displayOneRow(0, 11, 2, 11, lines[0]));
            }
            let y = 0;
            let pieces = [];
            lines.forEach(line => {
                if (line.length < 11) {
                    pieces.push(`@T0,${y},2,0,${line}\n`);
                } else {
                    let words = lines[0].split(' ');
                    if (words.length === 1) {
                        pieces.push(...displayOneRow(0, y, 2, 11, line));
                    } else {
                        pieces.push(...displayOneRowWithSpaces(0, y, 2, 12, line));
                    }
                }
                y += 16;
            });
            return displaySeparately(pieces);
        }
        const { fontSize, lines, dimensions } = wrapText(text, wrap);
        // console.log(lines);
        return displayText(fontSize, lines, dimensions);
    }
    async _queryBatteryInfo() {
        this._queue.unshift('/?b\n');
        // await this._sendString('/?b\n');
    }
    _display() {
        if (this._communicationIsInProgress || this._queue.length === 0) return;
        let buffer = this._queue.pop();
        this._communicationIsInProgress = true;
        function send() {
            if (buffer.length === 0) {
                this._communicationIsInProgress = false;
                return;
            }
            this._sendString(buffer.substring(0, this._characteristicLimit)).then(()=>{
                buffer = buffer.substring(this._characteristicLimit);
                setTimeout(send.bind(this), 40);
            });
        }
        send.call(this);
    }    
}

const screens = {
    initial: document.getElementById('initial-screen'),
    connecting: document.getElementById('connecting-screen'),
    connected: document.getElementById('connected-screen')
};
const deviceName = document.getElementById('device-name');
const deviceVoltage = document.getElementById('device-voltage');
const connectButton = document.getElementById('button-connect');
const drawButton = document.getElementById('button-draw');
const messageTextField = document.getElementById('textarea-message');
const codeTextField = document.getElementById('textarea-code');
const checkboxWrapText = document.getElementById('checkbox-wrap-text');

const display = new PeekSmithDevice();
display.onConnecting(() => {
    console.log('connecting...');
    screens.connecting.style.display = 'block';
    screens.initial.style.display = 'none';
    screens.connected.style.display = 'none';
});
display.onConnect(() => {
    deviceName.innerText = display._hardwareVersion === 1 ? "PeekSmith One" : "PeekSmith Two";
    messageTextField.value = '';
    screens.connecting.style.display = 'none';
    screens.initial.style.display = 'none';
    screens.connected.style.display = 'block';
    messageTextField.focus();
});
display.onDisconnect(() => {
    screens.connecting.style.display = 'none';
    screens.initial.style.display = 'block';
    screens.connected.style.display = 'none';
});
display.onMessage(message => {
    console.log(`message: ${message}`);
});
display.onBatteryVoltage(voltage => {
    deviceVoltage.innerText = `(${voltage / 1000}v)`;
});
connectButton.addEventListener('click', async () => {
    await display.connect();
});
messageTextField.addEventListener('keyup', () => {
    const message = messageTextField.value;
    const wrap = checkboxWrapText.checked;
    display.displayText(message, wrap);
});
checkboxWrapText.addEventListener('click', () => {
    const message = messageTextField.value;
    const wrap = checkboxWrapText.checked;
    display.displayText(message, wrap);
});
drawButton.addEventListener('click', () => {
    const code = codeTextField.value;

    const errors = [];
    const messages = [];
    const operations = [
        { name: 'circle', argCount: 3, message: '@C' },
        { name: 'rectangle', argCount: 4, message: '@R' },
        { name: 'dot', argCount: 2, message: '@P' },
        { name: 'line', argCount: 4, message: '@L' },
        { name: 'text', argCount: 4, message: '@T' }
    ];

    const processCommand = command => {
        const errors = [];
        const [_, name, argsStr] = command.match(/^(\w+)\((.*?)\)$/);
        const args = argsStr.split(/,/).map(arg => {
            arg = arg.trim();
            if (arg[0] === '"' && arg[arg.length - 1] === '"') {
                arg = arg.substring(1, arg.length - 1);
            } else
            if (arg[0] === '\'' && arg[arg.length - 1] === '\'') {
                arg = arg.substring(1, arg.length - 1);
            } else
            if (arg.match(/^\d+$/)) {
                arg = parseInt(arg, 10);
            } else {
                arg = '';
                errors.push('Cannot process arguments.');
            }
            return arg;
        });
        if (errors.length) return { errors };
        return { name, args };
    }

    const translateCommand = (command, operation) => {
        return operation.message + command.args.join(',') + '\n';
    };

    code
        .split('\n')
        .map((row, index) => ({ line: index, command: row.replace(/\s*(\/\/|\#).*?$/, '').trim() }))
        .filter(row => row.command !== '')
        .forEach(row => {
            let command = processCommand(row.command);
            if (command.error) {
                return errors.push({ line: row.line, error: command.error });
            }
            let operation = operations.find(c => c.name === command.name);
            if (!operation) {
                return { line: row.line, error: 'Unknown command.' }
            }
            let message = translateCommand(command, operation);
            messages.push(message);
        });

    display._queue.unshift('@E\n' + messages.join('') + '@D\n');
})