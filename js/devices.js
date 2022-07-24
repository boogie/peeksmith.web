peeksmith_3 = true;

function displayWrappedText(text, wrap = true) {
    function wrapText(text, wrap, fontSize = 3, cheat = false) {
        const dimensions = {
            3: { columns: 8, rows: 1 },
            2: { columns: cheat ? 10 : 11, rows: cheat ? 3 : 2 },
            1: { columns: 13, rows: 5 }
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
        if (lines.length > 2 && fontSize === 2 && !cheat) return wrapText(text, wrap, fontSize, true);
        if (lines.length > dimensions.rows && fontSize > 1) return wrapText(text, wrap, fontSize - 1);
        return { fontSize, lines: lines.slice(0, 5), dimensions };
    }
    function displayText(fontSize, lines, dimensions) {
        function displaySimple(lines) {
            for (let lineIndex = 0; lineIndex < lines.length - 1; lineIndex++)
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
            return displayOneRow(x, y, fontSize, fontWidth, text);
            let pieces = [];
            let words = text.split(' ');
            let spaceWidths = calculateSpaceWidths(fontSize, words);
            console.log(spaceWidths);
            for (let i = 0; i < words.length; x += fontWidth * words[i].length + spaceWidths[i], i++)
                pieces.push(`@T${x},${y},${fontSize},0,${words[i]}\n`);
            return pieces;
        }
        if (lines.length > 2) return displaySimple(lines);

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
                    pieces.push(...displayOneRowWithSpaces(0, y, 2, 11, line));
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

function displayWrappedText_(text, wrap = true) {
    const newLineChr = 10;
    const spaceChr = 32;
    const textChr = 35;
    const drawChr = 64;
    const emptyScreenChr = 69;
    const drawCommandsChr = 68;

    function wrapText(text, wrap, fontSize = 3, cheat) {
        let dimensions = {
            3: {
                columns: 8,
                rows: 1
            },
            2: {
                columns: 11,
                rows: 2
            },
            1: {
                columns: 21,
                rows: 4
            }
        } [fontSize];

        if (peeksmith_3) {
            dimensions = {
                3: {
                    columns: 8,
                    rows: 1
                },
                2: {
                    columns: cheat ? 10 : 11,
                    rows: cheat ? 3 : 2
                },
                1: {
                    columns: 13,
                    rows: 5
                }
            } [fontSize];
        }

        const textLength = text.length;
        const lines = [];
        let currentLine = 0;
        for (let index = 0; index < textLength; index++) {
            let char = text[index];
            if (lines.length === currentLine) lines.push([]);
            if (char === newLineChr) {
                currentLine++;
                continue;
            }
            if (wrap && char === spaceChr) {
                let nextSpace = text.indexOf(spaceChr, index + 1);
                if (nextSpace === -1) nextSpace = text.length;
                if (nextSpace - index + lines[currentLine].length > dimensions.columns) {
                    currentLine++;
                    continue;
                }
            }
            if (lines[currentLine].length === dimensions.columns) {
                currentLine++;
                lines.push([]);
            }
            lines[currentLine].push(char);
        }
        if (lines.length > 2 && fontSize === 2 && !cheat) return wrapText(text, wrap, fontSize, true);
        if (lines.length > dimensions.rows && fontSize > 1) return wrapText(text, wrap, fontSize - 1);
        if (peeksmith_3 && dimensions.rows === 5 && (lines.length === 2 || lines.length === 3)) {
            lines.push([spaceChr, spaceChr, spaceChr, spaceChr, spaceChr]);
        }
        return {
            fontSize,
            lines: lines.slice(0, 5),
            dimensions
        };
    }

    function displayText(fontSize, lines, dimensions) {
        function splitWords(text) {
            const words = [];
            let word = [];
            text.forEach(char => {
                if (char !== spaceChr) return word.push(char);
                if (word.length > 0) {
                    words.push(word);
                    word = [];
                }
            });
            if (word.length) words.push(word);
            return words;
        }
        function displaySimple(lines) {
            for (let lineIndex = 0; lineIndex < lines.length - 1; lineIndex++) {
                for (let i = dimensions.columns - lines[lineIndex].length; i > 0; i--) {
                    lines[lineIndex].push(spaceChr);
                }
            }
            let formatted = [textChr];
            lines.forEach(line => formatted = formatted.concat(line));
            formatted.push(newLineChr);
            return formatted;
        }

        function displaySeparately(commands) {
            let formatted = [drawChr, emptyScreenChr, newLineChr];
            commands.forEach(command => formatted = formatted.concat(command));
            return formatted.concat([drawChr, drawCommandsChr, newLineChr]);
        }

        function displayOneRow(x, y, fontSize, fontWidth, text) {
            let pieces = [];
            for (let i = 0; i < text.length; x += fontWidth, i++) {
                if (text[i] !== spaceChr) {
                    let oneCharacter = `@T${x},${y},${fontSize},0,`.split('').map(chr => chr.charCodeAt(0));
                    oneCharacter = oneCharacter.concat([text[i], newLineChr]);
                    pieces = pieces.concat(oneCharacter);
                }
            }
            return pieces;
        }

        function displayOneRowWithSpaces(x, y, fontSize, fontWidth, spaceWidths, text) {
            let pieces = [];
            let words = splitWords(text);
            for (let i = 0; i < words.length; x += fontWidth * words[i].length + spaceWidths[words.length][i], i++) {
                let oneWord = `@T${x},${y},${fontSize},0,`.split('').map(chr => chr.charCodeAt(0));
                oneWord = oneWord.concat(words[i]).concat(newLineChr);
                pieces = pieces.concat(oneWord);
            }
            return pieces;
        }
        if (lines.length > 2) return displaySimple(lines);

        if (fontSize === 1) {
            return displaySimple(lines);
        }
        if (lines.length === 1 && fontSize >= 2) {
            const lineLength = lines[0].length;
            if (lineLength < 8)
                return displaySimple(lines);
            if (lineLength === 8) {
                let words = splitWords(lines[0]);
                if (words.length < 3) {
                    return displaySeparately(displayOneRow(0, 7, 3, 16, lines[0]));
                }
                return displaySeparately(displayOneRowWithSpaces(0, 7, 3, 16, {
                    3: [13, 12],
                    4: [14, 14, 14]
                }, lines[0]));
            }
            if (lineLength === 9 || lineLength === 10) {
                const oneLine = `@T0,11,2,0,`.split('').map(chr => chr.charCodeAt(0));
                return displaySeparately(oneLine.concat(lines[0]).concat([newLineChr]));
            }
            return displaySeparately(displayOneRow(0, 11, 2, 11, lines[0]));
        }
        let y = 0;
        let pieces = [];
        lines.forEach(line => {
            if (line.length < 11) {
                const oneLine = `@T0,${y},2,0,`.split('').map(chr => chr.charCodeAt(0));
                pieces.push(...oneLine, ...line, newLineChr);
            } else {
                let words = splitWords(lines[0]);
                if (words.length === 1) {
                    pieces.push(...displayOneRow(0, y, 2, 11, line));
                } else
                if (words.length === 2 && peeksmith_3) {
                    pieces.push(...displayOneRow(0, y, 2, 11, line));
                } else {
                    pieces.push(...displayOneRowWithSpaces(0, y, 2, peeksmith_3 ? 10 : 11, peeksmith_3 ? {
                        2: [10],
                        3: [14, 19],
                        4: [11, 12, 11],
                        5: [11, 12, 11, 12],
                        6: [11, 12, 11, 12, 12]
                    } : {
                        2: [10],
                        3: [11, 11],
                        4: [11, 12, 11],
                        5: [11, 12, 11, 12],
                        6: [11, 12, 11, 12, 12]
                    }, line));
                }
            }
            y += 16;
        });
        return displaySeparately(pieces);
    }
    const {
        fontSize,
        lines,
        dimensions
    } = wrapText(text, wrap);
    return displayText(fontSize, lines, dimensions);
}

const crcTable = Int32Array.of(
    0x00000000, 0xf26b8303, 0xe13b70f7, 0x1350f3f4,
    0xc79a971f, 0x35f1141c, 0x26a1e7e8, 0xd4ca64eb,
    0x8ad958cf, 0x78b2dbcc, 0x6be22838, 0x9989ab3b,
    0x4d43cfd0, 0xbf284cd3, 0xac78bf27, 0x5e133c24,
    0x105ec76f, 0xe235446c, 0xf165b798, 0x030e349b,
    0xd7c45070, 0x25afd373, 0x36ff2087, 0xc494a384,
    0x9a879fa0, 0x68ec1ca3, 0x7bbcef57, 0x89d76c54,
    0x5d1d08bf, 0xaf768bbc, 0xbc267848, 0x4e4dfb4b,
    0x20bd8ede, 0xd2d60ddd, 0xc186fe29, 0x33ed7d2a,
    0xe72719c1, 0x154c9ac2, 0x061c6936, 0xf477ea35,
    0xaa64d611, 0x580f5512, 0x4b5fa6e6, 0xb93425e5,
    0x6dfe410e, 0x9f95c20d, 0x8cc531f9, 0x7eaeb2fa,
    0x30e349b1, 0xc288cab2, 0xd1d83946, 0x23b3ba45,
    0xf779deae, 0x05125dad, 0x1642ae59, 0xe4292d5a,
    0xba3a117e, 0x4851927d, 0x5b016189, 0xa96ae28a,
    0x7da08661, 0x8fcb0562, 0x9c9bf696, 0x6ef07595,
    0x417b1dbc, 0xb3109ebf, 0xa0406d4b, 0x522bee48,
    0x86e18aa3, 0x748a09a0, 0x67dafa54, 0x95b17957,
    0xcba24573, 0x39c9c670, 0x2a993584, 0xd8f2b687,
    0x0c38d26c, 0xfe53516f, 0xed03a29b, 0x1f682198,
    0x5125dad3, 0xa34e59d0, 0xb01eaa24, 0x42752927,
    0x96bf4dcc, 0x64d4cecf, 0x77843d3b, 0x85efbe38,
    0xdbfc821c, 0x2997011f, 0x3ac7f2eb, 0xc8ac71e8,
    0x1c661503, 0xee0d9600, 0xfd5d65f4, 0x0f36e6f7,
    0x61c69362, 0x93ad1061, 0x80fde395, 0x72966096,
    0xa65c047d, 0x5437877e, 0x4767748a, 0xb50cf789,
    0xeb1fcbad, 0x197448ae, 0x0a24bb5a, 0xf84f3859,
    0x2c855cb2, 0xdeeedfb1, 0xcdbe2c45, 0x3fd5af46,
    0x7198540d, 0x83f3d70e, 0x90a324fa, 0x62c8a7f9,
    0xb602c312, 0x44694011, 0x5739b3e5, 0xa55230e6,
    0xfb410cc2, 0x092a8fc1, 0x1a7a7c35, 0xe811ff36,
    0x3cdb9bdd, 0xceb018de, 0xdde0eb2a, 0x2f8b6829,
    0x82f63b78, 0x709db87b, 0x63cd4b8f, 0x91a6c88c,
    0x456cac67, 0xb7072f64, 0xa457dc90, 0x563c5f93,
    0x082f63b7, 0xfa44e0b4, 0xe9141340, 0x1b7f9043,
    0xcfb5f4a8, 0x3dde77ab, 0x2e8e845f, 0xdce5075c,
    0x92a8fc17, 0x60c37f14, 0x73938ce0, 0x81f80fe3,
    0x55326b08, 0xa759e80b, 0xb4091bff, 0x466298fc,
    0x1871a4d8, 0xea1a27db, 0xf94ad42f, 0x0b21572c,
    0xdfeb33c7, 0x2d80b0c4, 0x3ed04330, 0xccbbc033,
    0xa24bb5a6, 0x502036a5, 0x4370c551, 0xb11b4652,
    0x65d122b9, 0x97baa1ba, 0x84ea524e, 0x7681d14d,
    0x2892ed69, 0xdaf96e6a, 0xc9a99d9e, 0x3bc21e9d,
    0xef087a76, 0x1d63f975, 0x0e330a81, 0xfc588982,
    0xb21572c9, 0x407ef1ca, 0x532e023e, 0xa145813d,
    0x758fe5d6, 0x87e466d5, 0x94b49521, 0x66df1622,
    0x38cc2a06, 0xcaa7a905, 0xd9f75af1, 0x2b9cd9f2,
    0xff56bd19, 0x0d3d3e1a, 0x1e6dcdee, 0xec064eed,
    0xc38d26c4, 0x31e6a5c7, 0x22b65633, 0xd0ddd530,
    0x0417b1db, 0xf67c32d8, 0xe52cc12c, 0x1747422f,
    0x49547e0b, 0xbb3ffd08, 0xa86f0efc, 0x5a048dff,
    0x8ecee914, 0x7ca56a17, 0x6ff599e3, 0x9d9e1ae0,
    0xd3d3e1ab, 0x21b862a8, 0x32e8915c, 0xc083125f,
    0x144976b4, 0xe622f5b7, 0xf5720643, 0x07198540,
    0x590ab964, 0xab613a67, 0xb831c993, 0x4a5a4a90,
    0x9e902e7b, 0x6cfbad78, 0x7fab5e8c, 0x8dc0dd8f,
    0xe330a81a, 0x115b2b19, 0x020bd8ed, 0xf0605bee,
    0x24aa3f05, 0xd6c1bc06, 0xc5914ff2, 0x37faccf1,
    0x69e9f0d5, 0x9b8273d6, 0x88d28022, 0x7ab90321,
    0xae7367ca, 0x5c18e4c9, 0x4f48173d, 0xbd23943e,
    0xf36e6f75, 0x0105ec76, 0x12551f82, 0xe03e9c81,
    0x34f4f86a, 0xc69f7b69, 0xd5cf889d, 0x27a40b9e,
    0x79b737ba, 0x8bdcb4b9, 0x988c474d, 0x6ae7c44e,
    0xbe2da0a5, 0x4c4623a6, 0x5f16d052, 0xad7d5351,
);
const calculateCRC32c = data => (data.reduce((crc, value) => crcTable[(crc ^ value) & 0xff] ^ (crc >>> 8), 0xffffffff) ^ 0xffffffff) >>> 0;
const numToLittleEndianBytes = (num, numberOfBytes) => {
    let bytes = [];
    while (bytes.length < numberOfBytes) {
        let byte = num % 256;
        num = num >> 8;
        bytes.push(byte);
    }
    return bytes;
}

const SMP_OP_READ       = 0;
const SMP_OP_READ_RSP   = 1;
const SMP_OP_WRITE      = 2;
const SMP_OP_WRITE_RSP  = 3;

const SMP_GROUP_DEFAULT = 0;
const SMP_GROUP_IMAGES  = 1;

// default group
const SMP_ID_DEFAULT_ECHO     = 0;
const SMP_ID_DEFAULT_TASKSTAT = 2;
const SMP_ID_DEFAULT_MPSTAT   = 3;
const SMP_ID_DEFAULT_RESET    = 5;

// images group
const SMP_ID_IMAGES_LIST = 0;

class PeekSmithDevice {
    constructor(di = {}) {
        this.SERVICE_UUID = 0xFFE0;
        this.SERVICE_SMP_UUID = '8d53dc1d-1db7-4cd3-868b-8a527460aa84';
        this.CHARACTERISTIC_UUID = 0xFFE1;
        this.CHARACTERISTIC_CUSTOM_UUID = 0xFFE2;
        this.CHARACTERISTIC_PROXY_UUID = 0xFFE3;
        this.CHARACTERISTIC_DEBUG_UUID = 0xFFFF;
        this.CHARACTERISTIC_SMP_UUID = 'da2e7828-fbce-4e01-ae9e-261174997c48';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
        this._batteryVoltageCallback = null;
        this._queue = [];
        this._communicationIsInProgress = false;
        this._displayInterval = null;
        this._hardwareType = '';
        this._hardwareVersion = 1;
        this._batteryVoltage = null;
        this._characteristicLimit = 19;
        this._sendInterval = 40;
        this._messageBuffer = '';
        this._brightness = 3;
        this._smpBuffer = new Uint8Array();
        this._logger = di.logger || { info: () => {}, error: () => {} };
        this._devices = {};
        this._smpSeq = 0;
        this.cntr = 0;
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
    _decodeSmpMessage(message) {
        const [op, _flags, length_hi, length_lo, group_hi, group_lo, _seq, id] = message;
        const data = CBOR.decode(message.slice(8).buffer);
        const length = length_hi * 256 + length_lo;
        const group = group_hi * 256 + group_lo;
        console.log(message, data);
        switch (op) {
            case SMP_OP_READ:
                console.log('SMP_OP_READ');
                break;
            case SMP_OP_READ_RSP:
                console.log('SMP_OP_READ_RSP');
                break;
            case SMP_OP_WRITE:
                console.log('SMP_OP_WRITE');
                break;
            case SMP_OP_WRITE_RSP:
                console.log('SMP_OP_WRITE_RSP');
                break;
            default:
                console.log('unknown SMP operation');
                break;
        }
        switch (group) {
            case SMP_GROUP_DEFAULT:
                switch (id) {
                    case SMP_ID_DEFAULT_TASKSTAT:
                        console.log('SMP_ID_DEFAULT_TASKSTATS');
                        console.table(data.tasks);
                        break;
                }
                break;
            case SMP_GROUP_IMAGES:
                switch (id) {
                    case SMP_ID_IMAGES_LIST:
                        console.log('SMP_ID_IMAGES_LIST');
                        console.table(data.images);
                        break;
                }
                break;
            default:
                console.log('unknown SMP group');
                console.log(data);
                break;
        }        
    }
    _smpNotification(event) {
        const message = new Uint8Array(event.target.value.buffer);
        this._smpBuffer = new Uint8Array([...this._smpBuffer, ...message]);
        const messageLength = this._smpBuffer[2] * 256 + this._smpBuffer[3];
        if (this._smpBuffer.length < messageLength + 8) return;
        this._decodeSmpMessage(this._smpBuffer.slice(0, messageLength + 8));
        this._smpBuffer = this._smpBuffer.slice(messageLength + 8);
    }
    _notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer))
            .map(ascii => String.fromCharCode(ascii))
            .join('');
        this._messageBuffer += message;
        let newlinePos;
        while ((newlinePos = this._messageBuffer.indexOf('\n')) >= 0) {
            let messagePart = this._messageBuffer.substring(0, newlinePos);
            console.log(messagePart);
            this._messageBuffer = this._messageBuffer.substring(newlinePos + 1);
            const messageType = messagePart[0];
            if (this._messageCallback) this._messageCallback(messagePart);
            if (messageType === 'i') {
                const variableName = messagePart[1];
                const variableValue = messagePart.substring(2);
                if (variableName === 'v') this._hardwareVersion = +variableValue;
                if (variableName === 'b') {
                    this._batteryVoltage = +variableValue;
                    if (this._batteryVoltageCallback) this._batteryVoltageCallback(this._batteryVoltage);
                }
                if (variableName === 's') {
                    let [targetId, eventName] = variableValue.split(',');
                    console.log({ targetId, eventName });
                    if (targetId === 'b0') {
                        if (eventName === 'press') {
                            document.body.style.background = '#AFF';
                        }
                        if (eventName === 'release') {
                            document.body.style.background = '#FFF';
                        }
                        if (eventName === 'repeatpress') {
                            this.increaseBrightness();
                        }
                    }
                }
            }
        }
    }
    _notificationCustom(event) {
        const characteristicValue = event.target.value;
        const rawMessage = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log(rawMessage);
        if (rawMessage[0] === 64) {
            if (rawMessage[1] === 1) {
                const offset = rawMessage[2] * 256 + rawMessage[3];
                this._code.splice(offset, rawMessage.length - 4, ...rawMessage.slice(4));
            }
            if (rawMessage[1] === 2) {
                console.log('write')
            }
            if (rawMessage[1] === 3) {
                console.log('run', rawMessage[2]);
            }
            if (rawMessage[1] === 255) {
                console.log(this._code.map(ascii => String.fromCharCode(ascii)).join(''));
            }
        } else {
            console.log(rawMessage);
        }
    }
    _notificationProxy(event) {
        const PROXY_ADDRESS = '00:00:00:00:00:00';
        const hex2 = v => v.toString(16).padStart(2, '0');
        const deviceTypes = {
            1: 'spotted',
            2: 'ancs',
            3: 'insight',
            4: 'peeksmith',
            5: 'kmd',
            6: 'rainbox',
            7: 'omnisensor',
            8: 'pitaboard',
            9: 'labco',
        };
        const messageTypes = {
            0x81: 'notification',
            0x82: 'list_begin',
            0x83: 'list_device',
            0x84: 'list_end'
        }
        const characteristicValue = event.target.value;
        const rawMessage = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log(rawMessage.map(hex2).join(' '));
        const message = {
            type: messageTypes[rawMessage[0]],
            source: rawMessage.slice(1, 7).map(hex2).join(':'),
        };
        if (message.source === PROXY_ADDRESS) {
            if (message.type === 'list_begin') {
                this._table = '<table><th>Address</th><th>Type</th><th>Name</th>';
                this._devices = {};
            }
            if (message.type === 'list_device') {
                this._table += '<tr>';
                message.device = {
                    addr: rawMessage.slice(7, 13).map(hex2).join(':'),
                    type: deviceTypes[rawMessage[13]],
                    name: rawMessage.slice(14, rawMessage.length - 1).map(c => String.fromCharCode(c)).join(''),
                };
                this._devices[message.device.addr] = message.device;
                this._table += `<td>${message.device.addr}</td><td>${message.device.type}</td><td>${message.device.name}</td>`;
                this._table += '</tr>';
            }
            if (message.type === 'list_end') {
                this._table += '</table>';
                document.getElementById('device-table').innerHTML = this._table;
            }
        }
        if (message.source !== PROXY_ADDRESS) {
            message.device = { addr: rawMessage.slice(1, 6).map(hex2).join(':') };
            if (this._devices[message.device.addr]) {
                message.device = this._devices[message.device.addr];
            }
            message.char = [rawMessage[6], rawMessage[7]].map(hex2).join('');
            message.message = rawMessage.slice(9).map(c => String.fromCharCode(c)).join('');
        }
        console.log(message);
    }
    _notificationDebug(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer))
            .map(ascii => String.fromCharCode(ascii))
            .join('');
        if (message.match(/^Device discovered: \(0\) $/)) return;
        console.log(`${`${this.cntr++}`.padStart(10, ' ')} ${message}`);
        this._logger.info(message);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            this._sendInterval = 40;
            if (device.name.match(/-03/)) {
                this._hardwareType = 'Display';
                this._hardwareVersion = 3;
                this._characteristicLimit = 250;
                this._sendInterval = 0;
            } else if (device.name.match(/-02/)) {
                this._hardwareType = 'Display';
                this._hardwareVersion = 2;
                this._characteristicLimit = 19;
            } else {
                this._hardwareType = 'Display';
                this._hardwareVersion = 1;
                this._characteristicLimit = 19;
            }
            this._logger.info(`Connecting to PeekSmith ${this._hardwareVersion}...`);
            device.addEventListener('gattserverdisconnected', (event) => {
                console.log(event);
                this._disconnected();
            });
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            this._logger.info(`Server connected.`);
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._logger.info(`Primary service connected.`);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
            if (this._hardwareVersion >= 2) await this.queryBatteryInfo();

            if (this._hardwareVersion >= 3) {
                this._characteristicCustom = await service.getCharacteristic(this.CHARACTERISTIC_CUSTOM_UUID);
                this._characteristicCustom.addEventListener('characteristicvaluechanged', this._notificationCustom.bind(this));
                await this._characteristicCustom.startNotifications();
                this._characteristicProxy = await service.getCharacteristic(this.CHARACTERISTIC_PROXY_UUID);
                this._characteristicProxy.addEventListener('characteristicvaluechanged', this._notificationProxy.bind(this));
                await this._characteristicProxy.startNotifications();
                this._characteristicDebug = await service.getCharacteristic(this.CHARACTERISTIC_DEBUG_UUID);
                this._characteristicDebug.addEventListener('characteristicvaluechanged', this._notificationDebug.bind(this));
                await this._characteristicDebug.startNotifications();

                const smpService = await server.getPrimaryService(this.SERVICE_SMP_UUID);
                this._logger.info(`SMP service connected.`);
                this._smpCharacteristic = await smpService.getCharacteristic(this.CHARACTERISTIC_SMP_UUID);
                this._smpCharacteristic.addEventListener('characteristicvaluechanged', this._smpNotification.bind(this));
                await this._smpCharacteristic.startNotifications();
            }
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    displayText(message, wrap = true) {
        this._queue = this._queue.filter(message =>
            message[0] !== '#' &&
            message[0] !== '$' &&
            message.substring(0, 5) !== '@E\n@T'
        );
        // let formattedText = this._formatText(message, wrap);
        let formattedText = '$' + message.replace(/\n/g, '\r') + '\n';
        this.send(formattedText);
    }
    setBrightness(brightness) {
        if (brightness <= 1) brightness = 1;
        if (brightness > 8) brightness = 8;
        this._brightness = brightness;
        this.send(`/B${brightness - 1}\n`);
    }
    increaseBrightness() {
        let brightness = this._brightness + 1;
        if (brightness > 7) brightness = 0;
        this.setBrightness(brightness);
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'PeekSmith-'
            }],
            optionalServices: [this.SERVICE_UUID, this.SERVICE_SMP_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
        this.send('/T5\n');
        this.send('/?b\n');
        this.setBrightness(5);
        this.send('$PeekSmith\n');
        this.testVibrations();
        if (this._hardwareVersion >= 2) {
            this._batteryInterval = setInterval(this.queryBatteryInfo.bind(this), 1000 * 60 * 0.5);
        }
    }
    send(message) {
        this._queue.unshift(message);
        this._display();
    }
    async sendCustom(message) {
        console.log('hu');
        await this._characteristicCustom.writeValueWithoutResponse(Uint8Array.from(message));
    }
    async readCode() {
        const message = [64, 1];
        this._code = [];
        this.sendCustom(message);
    }
    async writeCode(contents) {
        const message = [64, 2, 0, 0, ...[...contents].map(c => c.charCodeAt(0)), 0];
        this.sendCustom(message);
    }
    async runCode() {
        const message = [64, 3];
        this.sendCustom(message);
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._displayInterval) clearInterval(this._displayInterval);
        if (this._batteryInterval) clearInterval(this._batteryInterval);
        if (this._disconnectCallback) this._disconnectCallback();
        this._hardwareVersion = null;
        this._batteryVoltage = null;
        this._characteristicLimit = 19;
    }
    _sendString(string) {
        const encoder = new TextEncoder('utf-8');
        return this._characteristic.writeValue(encoder.encode(string));
    }
    _sendProxyListQuery() {
        const proxyAddr = [0, 0, 0, 0, 0, 0];
        const message = [3, ...proxyAddr]; // CMD_PROXY_LIST
        this._characteristicProxy.writeValueWithoutResponse(Uint8Array.from(message));
    }
    async _sendSmpMessage(op, group, id, data) {
        const _flags = 0;
        let encodedData = [];
        if (data) {
            encodedData = [...new Uint8Array(data)];
        }
        const length_lo = encodedData.length & 255;
        const length_hi = encodedData.length >> 8;
        const group_lo = group & 255;
        const group_hi = group >> 8;
        const message = [op, _flags, length_hi, length_lo, group_hi, group_lo, this._smpSeq, id, ...encodedData];
        console.log(message.length, message);
        await this._smpCharacteristic.writeValueWithoutResponse(Uint8Array.from(message));
        this._smpSeq = (this._smpSeq + 1) % 256;
    }
    smpImageList() {
        return this._sendSmpMessage(SMP_OP_READ, SMP_GROUP_IMAGES, SMP_ID_IMAGES_LIST);
    }
    smpTaskStats() {
        return this._sendSmpMessage(SMP_OP_READ, SMP_GROUP_DEFAULT, SMP_ID_DEFAULT_TASKSTAT);
    }
    smpMpStats() {
        return this._sendSmpMessage(SMP_OP_READ, SMP_GROUP_DEFAULT, SMP_ID_DEFAULT_MPSTAT);
    }
    smpReset() {
        return this._sendSmpMessage(SMP_OP_WRITE, SMP_GROUP_DEFAULT, SMP_ID_DEFAULT_RESET);
    }
    smpEcho(message) {
        return this._sendSmpMessage(SMP_OP_WRITE, SMP_GROUP_DEFAULT, SMP_ID_DEFAULT_ECHO, { d: message });
    }
    _formatText(text, wrap) {
        // return displayWrappedText(text, wrap);

        const asciiText = text.split('').map(char => char.charCodeAt(0));
        const formattedText = displayWrappedText_(asciiText, wrap);
        return formattedText.map(char => String.fromCharCode(char)).join('');
    }
    async queryBatteryInfo() {
        this.send('/?b\n');
    }
    _display() {
        if (this._communicationIsInProgress) {
            setTimeout(this._display.bind(this), 5);
            return;
        }
        if (this._queue.length === 0) return;

        let buffer = this._queue.pop();
        this._communicationIsInProgress = true;
        function send() {
            if (buffer.length === 0) {
                this._communicationIsInProgress = false;
                if (this._queue.length > 0) setTimeout(this._display.bind(this), this._sendInterval);
                return;
            }
            this._sendString(buffer.substring(0, this._characteristicLimit)).then(() => {
                buffer = buffer.substring(this._characteristicLimit);
                setTimeout(send.bind(this), this._sendInterval);
            });
        }
        send.call(this);
    }
    testVibrations() {
        this.send('/VL511\n~..\n');
        setTimeout(() => {
            this.send('/VL211\n~....\n');
        }, 1500);
    }
    startDiscovery() {
        const proxyAddr = [0, 0, 0, 0, 0, 0];
        const message = [1, ...proxyAddr]; // CMD_PROXY_START_SCAN
        this._characteristicProxy.writeValueWithoutResponse(Uint8Array.from(message));
    }
    stopDiscovery() {
        const proxyAddr = [0, 0, 0, 0, 0, 0];
        const message = [2, ...proxyAddr]; // CMD_PROXY_STOP_SCAN
        this._characteristicProxy.writeValueWithoutResponse(Uint8Array.from(message));
    }
    listPeers() {
        this._sendProxyListQuery();
    }
}

class GhostMoveDevice {
    constructor() {
        this.SERVICE_UUID = 0xFFE0;
        this.CHARACTERISTIC_UUID = 0xFFE1;
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
        this._orientationCallback = null;
        this._movementCallback = null;
        this._batteryVoltageCallback = null;
        this._queue = [];
        this._communicationIsInProgress = false;
        this._hardwareType = '';
        this._hardwareVersion = 1;
        this._batteryVoltage = null;
        this._characteristicLimit = 19;
        this._sendInterval = 40;
        this._messageBuffer = '';
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
    onOrientation(callback) {
        this._orientationCallback = callback;
        return this;
    }
    onMovement(callback) {
        this._movementCallback = callback;
        return this;
    }
    onBatteryVoltage(callback) {
        this._batteryVoltageCallback = callback;
        return this;
    }
    _notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer))
            .map(ascii => String.fromCharCode(ascii))
            .join('');
        this._messageBuffer += message;
        let newlinePos;
        while ((newlinePos = this._messageBuffer.indexOf('\n')) >= 0) {
            let messagePart = this._messageBuffer.substring(0, newlinePos);
            console.log(messagePart);
            this._messageBuffer = this._messageBuffer.substring(newlinePos + 1);
            const messageType = messagePart[0];
            if (this._messageCallback) this._messageCallback(messagePart);
            if (messageType === 'i') {
                const variableName = messagePart[1];
                const variableValue = messagePart.substring(2);
                if (variableName === 'v') this._hardwareVersion = +variableValue;
                if (variableName === 'b') {
                    this._batteryVoltage = +variableValue;
                    if (this._batteryVoltageCallback) this._batteryVoltageCallback(this._batteryVoltage);
                }
                if (variableName === 's') {
                    let sensorId = variableValue[0];

                    if (sensorId === 'a') {
                        let [x, y, z] = variableValue.substring(1).split(',').map(v => +v);
                        let [absX, absY, absZ] = [x, y, z].map(Math.abs);
                        let orientation = -1;
                        if ((absZ > absX) && (absZ > absY)) {
                            if (z > 0) orientation = 0; else orientation = 1;
                        } else
                        if ((absY > absX) && (absY > absZ)) {
                            if (y > 0) orientation = 2; else orientation = 3;
                        } else {
                            if (x < 0) orientation = 4; else orientation = 5;
                        }
                        if (orientation !== -1 && this._orientationCallback) this._orientationCallback(orientation);
                    }

                    if (sensorId === 'o') {
                        let orientation = +variableValue.substring(1);
                        if (this._orientationCallback) this._orientationCallback(orientation);
                    }
                };
                if (variableName === 'e') {
                    let eventId = variableValue[0];
                    if (eventId === 'm') {
                        if (this._movementCallback) this._movementCallback();
                    }
                }
            }

        }
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            this._hardwareType = 'GhostMove';
            this._hardwareVersion = +device.name.substr(10, 2);
            console.log('HW version: ', this._hardwareVersion);
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
            this.queryBatteryInfo();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'GhostMove-'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
        this._messageChunkSenderInterval = setInterval(this._messageChunkSender.bind(this), 100);
        this._batteryInterval = setInterval(this.queryBatteryInfo.bind(this), 1000 * 60 * 5); // 5 minutes
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._messageChunkSenderInterval) clearInterval(this._messageChunkSenderInterval);
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
    queryBatteryInfo() {
        this._queue.unshift('/?b\n');
    }
    subscribeToAcceleratorData() {
        console.log('subscribeToAccel');
        this._queue.unshift('/Sa\n');
    }
    subscribeToOrientationData() {
        console.log('subscribeToOrient');
        this._queue.unshift('/So\n');
    }
    subscribeToButtonEvents() {
        console.log('subscribeToButton');
        this._queue.unshift('/Sb\n');
    }
    subscribeToTapEvents() {
        console.log('subscribeToTap');
        this._queue.unshift('/St\n');
    }
    _messageChunkSender() {
        if (this._communicationIsInProgress || this._queue.length === 0) return;
        let buffer = this._queue.pop();
        console.log('chunk', buffer);
        this._communicationIsInProgress = true;
        function send() {
            if (buffer.length === 0) {
                this._communicationIsInProgress = false;
                return;
            }
            this._sendString(buffer.substring(0, this._characteristicLimit)).then(() => {
                buffer = buffer.substring(this._characteristicLimit);
                setTimeout(send.bind(this), this._sendInterval);
            });
        }
        send.call(this);
    }
    startOTA() {
        console.log('startOTA');
        this._queue.unshift('/X\n');
    }
}

class EspyonDevice {
    constructor() {
        this.SERVICE_UUID = 0xFFE0;
        this.CHARACTERISTIC_UUID = 0xFFE1;
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer))
            .map(ascii => String.fromCharCode(ascii))
            .join('');
        this._messageBuffer += message;
        let newlinePos;
        let messagePart;
        while ((newlinePos = this._messageBuffer.indexOf('\n')) >= 0) {
            messagePart = this._messageBuffer.substring(0, newlinePos);
            this._messageBuffer = this._messageBuffer.substring(newlinePos + 1);
            if (this._messageCallback) this._messageCallback(messagePart);
        }
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Espyon-'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}
class InsightDevice {
    constructor() {
        this.SERVICE_UUID = '13630000-aeb9-10cf-ef69-81e145a91113';
        this.TAGID_CHARACTERISTIC_UUID = '13630001-aeb9-10cf-ef69-81e145a91113';
        this.SILENT_CHARACTERISTIC_UUID = '13630005-aeb9-10cf-ef69-81e145a91113';
        this._characteristic = null;
        this._silent_characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._messageCallback) this._messageCallback(message);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.TAGID_CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            this._silent_characteristic = await service.getCharacteristic(this.SILENT_CHARACTERISTIC_UUID);
            await this._characteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'IN-'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
    async muteVibration() {
        this._silent_characteristic.writeValue(Uint8Array.from([1]));
    }
    async unmuteVibration() {
        this._silent_characteristic.writeValue(Uint8Array.from([0]));
    }
}

class FossilDevice {
    constructor() {
        this.SERVICE_UUID = '3dda0001-957f-7d4a-34a6-74696673696d';
        this.X2_CHARACTERISTIC_UUID = '3dda0002-957f-7d4a-34a6-74696673696d';
        this.WRITE_CHARACTERISTIC_UUID = '3dda0003-957f-7d4a-34a6-74696673696d';
        this.UPLOAD_CHARACTERISTIC_UUID = '3dda0004-957f-7d4a-34a6-74696673696d';
        this.BUTTON_CHARACTERISTIC_UUID = '3dda0006-957f-7d4a-34a6-74696673696d';
        this.X7_CHARACTERISTIC_UUID = '3dda0007-957f-7d4a-34a6-74696673696d';
        this._x2Characteristic = null;
        this._writeCharacteristic = null;
        this._uploadCharacteristic = null;
        this._buttonCharacteristic = null;
        this._x7Characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._task = null;
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
    _writeNotification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._task.type === 'setTime' && this._task.step === 1 && message[2] === 8 && message[3] === 0) {
            this._task.step++;
            this.nextStep();
            return;
        }
        if (this._task.type === 'setTime' && this._task.step === 3 && message[2] === 8 && message[3] === 0) {
            console.log('hmmm');
            this._task.step++;
            this.nextStep();
            return;
        }
        if (this._task.type === 'setTime' && this._task.step === 5 && message[2] === 8 && message[3] === 0) {
            this._task.step++;
            // wait for next notification
            return;
        }
        if (this._task.type === 'setTime' && this._task.step === 6 && message[2] === 8 && message[3] === 0) {
            this._task.step++;
            this.nextStep();
            return;
        }
        console.log('write', message);
    }
    _uploadNotification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._task.type === 'setTime' && this._task.step === 3 && message[2] === 8 && message[3] === 0) {
            this._task.step++;
            this.nextStep();
            return;
        }
        console.log('upload', message);
    }
    _buttonNotification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log('button', message);
    }
    _x2Notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log('x2', message);
    }
    _x7Notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log('x7', message);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            console.log('0', device);
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            console.log('0.1');
            const server = await device.gatt.connect();
            console.log('0.2');
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            console.log('1');
            this._writeCharacteristic = await service.getCharacteristic(this.WRITE_CHARACTERISTIC_UUID);
            this._writeCharacteristic.addEventListener('characteristicvaluechanged', this._writeNotification.bind(this));
            await this._writeCharacteristic.startNotifications();
            console.log('2');
            this._uploadCharacteristic = await service.getCharacteristic(this.UPLOAD_CHARACTERISTIC_UUID);
            this._uploadCharacteristic.addEventListener('characteristicvaluechanged', this._uploadNotification.bind(this));
            await this._uploadCharacteristic.startNotifications();
            console.log('3');
            this._buttonCharacteristic = await service.getCharacteristic(this.BUTTON_CHARACTERISTIC_UUID);
            this._buttonCharacteristic.addEventListener('characteristicvaluechanged', this._buttonNotification.bind(this));
            await this._buttonCharacteristic.startNotifications();
            console.log('4');
            this._x2Characteristic = await service.getCharacteristic(this.X2_CHARACTERISTIC_UUID);
            this._x2Characteristic.addEventListener('characteristicvaluechanged', this._x2Notification.bind(this));
            await this._x2Characteristic.startNotifications();
            this._x7Characteristic = await service.getCharacteristic(this.X7_CHARACTERISTIC_UUID);
            this._x7Characteristic.addEventListener('characteristicvaluechanged', this._x7Notification.bind(this));
            await this._x7Characteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Fossil'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
    setTime(hours, minutes, seconds) {
        this.execute({
            type: 'setTime', step: 0, hours, minutes, seconds
        });
    }
    execute(task) {
        this._task = task;
        this.nextStep();
    }
    nextStep() {
        if (this._task.type === 'setTime' && this._task.step === 0) {
            this._task.step++;
            this._writeCharacteristic.writeValue(Uint8Array.from([0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x1b, 0x00, 0x00, 0x00, 0x1b, 0x00, 0x00, 0x00]));
            return;
        }
        if (this._task.type === 'setTime' && this._task.step === 2) {
            this._task.step++;
            const fileContents = [0x00, 0x00, 0x08, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00];
            const time = 1000 * (this._task.hours * 60 * 60 + this._task.minutes * 60 + this._task.seconds); // Date.now();
            const epoch = Math.floor(time / 1000);
            const millisecs = time % 1000;
            const tzMinutes = 0;
            const message = [0x0c, 0x00, 0x08, ...numToLittleEndianBytes(epoch, 4), ...numToLittleEndianBytes(millisecs, 2), ...numToLittleEndianBytes(tzMinutes, 2)];
            const checksum = numToLittleEndianBytes(calculateCRC32c(message), 4);
            fileContents.push(...message);
            fileContents.push(...checksum);
            this._uploadCharacteristic.writeValue(Uint8Array.from(fileContents));
            return;
        }
        if (this._task.type === 'setTime' && this._task.step === 4) {
            this._task.step++;
            this._writeCharacteristic.writeValue(Uint8Array.from([0x04, 0x00, 0x08]));
            return;
        }
        if (this._task.type === 'setTime' && this._task.step === 7) {
            this._task = null;
            console.log('SUCCESS');
            return;
        }
        console.log('ERROR', this._task);
    }
}

class SecondSightDevice {
    constructor() {
        this.SERVICE_UUID = '5735ac20-75fc-4b71-8d79-dac1d0053a9b';
        this.TAGID_CHARACTERISTIC_UUID = '5735ac21-75fc-4b71-8d79-dac1d0053a9b';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._messageCallback) this._messageCallback(message);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            console.log(this.TAGID_CHARACTERISTIC_UUID);
            this._characteristic = await service.getCharacteristic(this.TAGID_CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Sight'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
    async muteVibration() {
        this._silent_characteristic.writeValue(Uint8Array.from([1]));
    }
    async unmuteVibration() {
        this._silent_characteristic.writeValue(Uint8Array.from([0]));
    }
}

class SpottedDevice {
    constructor() {
        this.SERVICE_UUID = '6e40ffe0-b5a3-f393-e0a9-e50e24dcca9e';
        this.CHARACTERISTIC_UUID = '6e40ffe1-b5a3-f393-e0a9-e50e24dcca9e';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const characteristicString = String.fromCharCode(...Array.from(new Uint8Array(characteristicValue.buffer)));
        console.log(characteristicString);
        if (this._messageCallback) this._messageCallback(characteristicString);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Spotted-'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
    _sendString(string) {
        const encoder = new TextEncoder('utf-8');
        return this._characteristic.writeValue(encoder.encode(string));
    }
}

class HolyDiceDevice {
    constructor() {
        this.SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        this.CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const characteristicArray = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._messageCallback) this._messageCallback(characteristicArray);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'HolyIOT'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}

class PitataBoardDevice {
    constructor() {
        this.SERVICE_UUID = '0000fee1-0000-1000-8000-00805f9b34fb';
        this.CHARACTERISTIC_UUID = '0000fee4-0000-1000-8000-00805f9b34fb';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const characteristicArray = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._messageCallback) this._messageCallback(characteristicArray);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this._characteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic.startNotifications();
            console.log('connected.');
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'MSBOD'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}

class ISKNSlateDevice {
    constructor() {
        this.SERVICE_UUID = 'ffff6e80-cf3a-11e1-9ab4-0002a5d5c51b';
        this.CHARACTERISTIC0_UUID = 'fff06e80-cf3a-11e1-9ab4-0002a5d5c51b';
        this.CHARACTERISTIC1_UUID = 'fff16e80-cf3a-11e1-9ab4-0002a5d5c51b';
        this.CHARACTERISTIC2_UUID = 'fff26e80-cf3a-11e1-9ab4-0002a5d5c51b';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification0(event) {
        const characteristicValue = event.target.value;
        const characteristicArray = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._messageCallback) this._messageCallback(0, characteristicArray);
    }
    _notification1(event) {
        const characteristicValue = event.target.value;
        const characteristicArray = Array.from(new Uint8Array(characteristicValue.buffer));
        if (this._messageCallback) this._messageCallback(1, characteristicArray);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic_tx = await service.getCharacteristic(this.CHARACTERISTIC0_UUID);
            this._characteristic_tx.addEventListener('characteristicvaluechanged', this._notification0.bind(this));
            await this._characteristic_tx.startNotifications();
            this._characteristic1 = await service.getCharacteristic(this.CHARACTERISTIC1_UUID);
            this._characteristic1.addEventListener('characteristicvaluechanged', this._notification1.bind(this));
            await this._characteristic1.startNotifications();
            this._characteristic2 = await service.getCharacteristic(this.CHARACTERISTIC2_UUID);
            await this._send([0xB3, 0xA5, 0xE1, 0x33, 0x6A, 0x00, 0xE1, 0xE4]);
            console.log('connected.');
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _send(data) {
        this._characteristic2.writeValueWithoutResponse(Uint8Array.from(data));
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Slate'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}

class BambooSlateDevice {
    constructor() {
        // NORDIC UART service
        this.identifier = 'E/TRIX';
        this.SERVICE_NORDIC_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        this.CHARACTERISTIC_TX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        this.CHARACTERISTIC_RX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        this.SERVICE_WACOM_LIVE_UUID = '00001523-1212-efde-1523-785feabcd123';
        this.CHARACTERISTIC_PEN_DATA_UUID = '00001524-1212-efde-1523-785feabcd123';
        this._characteristic_tx = null;
        this._characteristic_rx = null;
        this._characteristic_pen = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
        this.commandCodes = {
            CONNECT: 0xe6,
            GETDIMENSIONS: 0xea,
            GETBATTERY: 0xb9,
            SETMODE: 0xb1,
            REGISTER: 0xe7,
        };
        this.responseCodes = {
            STATUS: 0xb3,
            GETDIMENSIONS: 0xeb,
            BATTERY: 0xba,
            PEN: 0xa1,
            ENTERPROXIMITY: 0xa2,
            REGCONFIRMED: 0xe4,
            // PressureAndButtons: 0x10,
            // UpdateF1: 0xf1,
            // GetFirmware: 0xb8,
            // GetName: 0xbc,
            // RegConfirmedE4: 0xe4,
            // RegStartedEF: 0xef
        }
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
    _notificationUart(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log('< ' + message.map(b => b.toString(16).padStart(2, '0')).join(' '));
        const responseType = message[0];
        let type = 'Unknown UART ' + message[0].toString(16).padStart(2, '0');
        // const dataLength = message[1];
        const data = {};
        const rawData = message.slice(2);
        switch (responseType) {
            case this.responseCodes.STATUS:
                type = 'status';
                data.status = rawData[0];
                data.message = 'Unknown error';
                if (data.status === 0) data.message = 'OK';
                if (data.status === 1) data.message = 'General error';
                if (data.status === 2) data.message = 'Invalid state';
                if (data.status === 3) data.message = 'Read only param';
                if (data.status === 4) data.message = 'Command not supported';
                if (data.status === 7) data.message = 'Authorization error';
                break;
            case this.responseCodes.GETDIMENSIONS:
                type = 'dimensions';
                const value = rawData[2] + (rawData[3] << 8) + (rawData[4] << 16) + (rawData[5] << 24);
                if (rawData[0] == 3) {
                    type = 'height';
                    data.height = value;
                }
                if (rawData[0] == 4) {
                    type = 'width';
                    data.width = value;
                }
                break;
            case this.responseCodes.BATTERY:
                type = 'battery';
                data.percentage = rawData[0];
                data.isCharging = rawData[1] > 0;
                break;
            case this.responseCodes.REGCONFIRMED:
                type = 'registration confirmed';
                data.percentage = rawData[0];
                data.isCharging = rawData[1] > 0;
                break;
    
        }
        if (this._messageCallback) this._messageCallback({ type, data, rawData });
    }
    _notificationPen(event) {
        const characteristicValue = event.target.value;
        const message = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log('< ' + message.map(b => b.toString(16).padStart(2, '0')).join(' '));
        const responseType = message[0];
        let type = 'Unknown PEN ' + message[0].toString(16).padStart(2, '0');
        // const dataLength = message[1];
        const data = {};
        const rawData = message.slice(2);
        switch (responseType) {
            case this.responseCodes.ENTERPROXIMITY:
                type = 'proximity entered';
                data.value = rawData;                break;
            case this.responseCodes.PEN:
                type = 'pen';
                while (rawData.length > 0) {
                    const data = {};
                    const rawDataPartial = rawData.splice(0, 6);
                    const [xHi, xLo, yHi, yLo, sHi, sLo] = rawDataPartial;
                    const x = xHi * 256 + xLo;
                    const y = yHi * 256 + yLo;
                    const s = sHi * 256 + sLo;                    
                    if (x === 0xffff && y === 0xffff) {
                        type = 'proximity left'
                    } else {
                        data.x = x;
                        data.y = y;
                        data.strength = s;
                    }
                    if (this._messageCallback) this._messageCallback({ type, data, rawData: rawDataPartial });
                }
                return;
        }
        if (this._messageCallback) this._messageCallback({ type, data, rawData });
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const uartService = await server.getPrimaryService(this.SERVICE_NORDIC_UUID);
            this._characteristic_tx = await uartService.getCharacteristic(this.CHARACTERISTIC_TX_UUID);
            this._characteristic_rx = await uartService.getCharacteristic(this.CHARACTERISTIC_RX_UUID);
            this._characteristic_rx.addEventListener('characteristicvaluechanged', this._notificationUart.bind(this));
            await this._characteristic_rx.startNotifications();
            const wacomService = await server.getPrimaryService(this.SERVICE_WACOM_LIVE_UUID);
            this._characteristic_pen = await wacomService.getCharacteristic(this.CHARACTERISTIC_PEN_DATA_UUID);
            this._characteristic_pen.addEventListener('characteristicvaluechanged', this._notificationPen.bind(this));
            await this._characteristic_pen.startNotifications();
            console.log('connected.');
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async send(cmd, data) {
        console.log('> ' + [cmd, data.length, ...data].map(b => b.toString(16).padStart(2, '0')).join(' '));
        return this._characteristic_tx.writeValue(Uint8Array.from([cmd, data.length, ...data]));
    }
    async cmdRegister(identifier) {
        const identifierBytes = this.identifier.split('').map(c => c.charCodeAt(0))
        return this.send(this.commandCodes.REGISTER, identifierBytes);
    }
    async cmdConnect(identifier) {
        const identifierBytes = this.identifier.split('').map(c => c.charCodeAt(0))
        return this.send(this.commandCodes.CONNECT, identifierBytes);
    }
    async cmdGetDimensions(byte0, byte1) {
        return this.send(this.commandCodes.GETDIMENSIONS, [byte0, byte1]);
    }
    async cmdGetBattery() {
        return this.send(this.commandCodes.GETBATTERY, [0]);
    }
    async cmdSetMode(mode) {
        return this.send(this.commandCodes.SETMODE, [mode]);
    }
    async startLive() {
        await this.cmdConnect(this.identifier);
        await this.cmdGetDimensions(3, 0);
        await this.cmdGetDimensions(4, 0);
        await this.cmdGetBattery();
        await this.cmdSetMode(0);
    }
    async startRegister() {
        await this.cmdRegister(this.identifier);
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Bamboo Slate'
            }],
            optionalServices: [this.SERVICE_NORDIC_UUID, this.SERVICE_WACOM_LIVE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}

class MindBusterDevice {
    constructor() {
        this.SERVICE_UUID = 'da2b84f1-6279-48de-bdc0-afbea0226079';
        this.CHARACTERISTIC_TX_UUID = '18cda784-4bd3-4370-85bb-bfed91ec86af';
        this.CHARACTERISTIC_MODE_UUID = 'a87988b9-694c-479c-900e-95dfa6c00a24';
        this._characteristic_tx = null;
        this._characteristic_mode = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
        this._buffer = [];
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
    _notification(event) {
        const characteristicValue = event.target.value;
        let data = Array.from(new Uint8Array(characteristicValue.buffer));
        console.log(data.length, ...data);

        this._buffer.push(...data);
        while (this._buffer.length >= 7) {
            let message = { type: 'unknown', rawData: this._buffer.slice(0, 7) };

            const header = this._buffer[0];
            switch (header) {
                case 0xcc:
                    message = {
                        type: 'live signal',
                        counter: this._buffer[1] & 0x0f,
                        batteryVoltage: (this._buffer[2] >> 4) + (this._buffer[3] >> 4) / 10,
                        firmwareVersion: (this._buffer[4] >> 4) + (this._buffer[4] & 0x0f) / 10,
                    };
                    break;
                case 0xdd:
                    message = {
                        type: 'pen write',
                        counter: this._buffer[1] & 0x0f,
                        x: (this._buffer[2] >> 4) * 1000 + (this._buffer[2] & 0x0f) * 100 + (this._buffer[3] >> 4) * 10 + (this._buffer[3] & 0x0f),
                        y: (this._buffer[4] >> 4) * 1000 + (this._buffer[4] & 0x0f) * 100 + (this._buffer[5] >> 4) * 10 + (this._buffer[5] & 0x0f),
                    };
                    // console.log(this._buffer.map(x => x.toString(16).padStart(2, '0')).join(' '));
                    break;
                case 0xaa:
                    message = {
                        type: 'pen up',
                        counter: this._buffer[1] && 0x0f,
                    };
                    break;
                default:
                    break;
            }
            if (this._messageCallback) this._messageCallback(message);
            this._buffer = this._buffer.slice(7);
        }
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._characteristic_tx = await service.getCharacteristic(this.CHARACTERISTIC_TX_UUID);
            this._characteristic_tx.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._characteristic_tx.startNotifications();
            this._characteristic_mode = await service.getCharacteristic(this.CHARACTERISTIC_MODE_UUID);
            await this._send([0x01]);
            console.log('connected.');
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _send(data) {
        this._characteristic_mode.writeValueWithoutResponse(Uint8Array.from(data));
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'BlueRadios'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}


class SBWatchDevice {
    constructor() {
        this.SERVICE_UUID = 0x6006;
        this.WRITE_CHARACTERISTIC_UUID = 0x8001;
        this.ACK_CHARACTERISTIC_UUID = 0x8002;
        this.REPLY_CHARACTERISTIC_UUID = 0x8003;
        this.NOTIFY_CHARACTERISTIC_UUID = 0x8004;
        this._write_characteristic = null;
        this._notify_characteristic = null;
        this._reply_characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
        this._callbacks = [];
        this._isAckInProgress = false;
        this._ackMessage = null;
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
    _log(prefix, message) {
        const string = message.map(v => v.toString(16).padStart(2, '0')).join(' ');
        console.log(prefix, string);
    }
    _ackNotification(event) {
        const message = Array.from(new Uint8Array(event.target.value.buffer));
        this._log('ack', message);
        if (!this._isAckInProgress) {
            this._ackMessage = message;
        } else {
            this._ackMessage.push(...message);
        }
        const dataLength = this._ackMessage[3] + this._ackMessage[4] * 256;
        if (this._ackMessage.length == dataLength + 6) {
            this._fullAckNotification(this._ackMessage);
            this._isAckInProgress = false;
            this._ackMessage = null;
        } else {
            this._isAckInProgress = true;
        }
    }
    _fullAckNotification(message) {
        const commandCode = message[1];
        const actionType = message[2];
        if (actionType === 0x80 && this._callbacks[commandCode]) {
            this._callbacks[commandCode](message);
            this._callbacks[commandCode] = null;
        }
    }
    _getData(message) {
        const dataLength = message[3] + message[4] * 256;
        return message.slice(5, 5 + dataLength);
    }
    _dataToString(data) {
        return data.map(c => String.fromCharCode(c)).join('');
    }
    _replyNotification(event) {
        const message = Array.from(new Uint8Array(event.target.value.buffer));
        this._log('rep', message);
    }
    _generalNotification(event) {
        const message = Array.from(new Uint8Array(event.target.value.buffer));
        this._log('gen', message);
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            document.getElementById('device-name').innerHTML = device.name;
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._writeCharacteristic = await service.getCharacteristic(this.WRITE_CHARACTERISTIC_UUID);
            this._ackCharacteristic = await service.getCharacteristic(this.ACK_CHARACTERISTIC_UUID);
            this._ackCharacteristic.addEventListener('characteristicvaluechanged', this._ackNotification.bind(this));
            await this._ackCharacteristic.startNotifications();
            this._replyCharacteristic = await service.getCharacteristic(this.REPLY_CHARACTERISTIC_UUID);
            this._notifyCharacteristic = await service.getCharacteristic(this.NOTIFY_CHARACTERISTIC_UUID);
            this._notifyCharacteristic.addEventListener('characteristicvaluechanged', this._generalNotification.bind(this));
            await this._notifyCharacteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'SBWatch-'
            }, {
                namePrefix: 'YoWatch#'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        document.getElementById('device-name').innerHTML = '?';
        if (this._disconnectCallback) this._disconnectCallback();
    }
    async sendMessage(commandCode, actionType, data, callback) {
        if (actionType === 0x70 && callback) this._callbacks[commandCode] = callback;
        const message = [0x6f, commandCode, actionType, data.length, 0x00, ...data, 0x8f];
        await this._writeCharacteristic.writeValueWithoutResponse(Uint8Array.from(message));
        this._log('wri', message);
    }
    async getWatchID() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x02, 0x70, [0x00], response => {
                resolve(this._dataToString(this._getData(response)));
            });
        });
    }
    async getDeviceType() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x03, 0x70, [0x00], response => {
                resolve(this._dataToString(this._getData(response).slice(1)));
            });
        });
    }
    async getDeviceVersion() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x03, 0x70, [0x01], response => {
                resolve(this._dataToString(this._getData(response).slice(1)));
            });
        });
    }
    async getDeviceVersionEx() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x03, 0x70, [0x05], response => {
                resolve(this._dataToString(this._getData(response).slice(1)));
            });
        });
    }
    async getDeviceVersionEx() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x03, 0x70, [0x06], response => {
                resolve(this._dataToString(this._getData(response).slice(1)));
            });
        });
    }
    async setTime(hours, minutes, seconds = 0) {
        // await this.sendMessage(0x04, 0x71, [0xe3, 0x07, 0x06, 0x06, hours, minutes, seconds, 0x00, 0x01, 0x00, 0x08, 0x00]);
        await this.sendMessage(0x04, 0x71, [0xe3, 0x07, 0x06, 0x06, hours, minutes, seconds]);
    }
    async setTimeLong0(hours, minutes, seconds = 0) {
        // await this.sendMessage(0x04, 0x71, [0xe3, 0x07, 0x06, 0x06, hours, minutes, seconds, 0x00, 0x01, 0x00, 0x08, 0x00]);
        await this.sendMessage(0x04, 0x71, [0xe3, 0x07, 0x06, 0x06, hours, minutes, seconds, 0, 0, 1, 1, 0]);
    }
    async setTimeLong1(hours, minutes, seconds = 0) {
        // await this.sendMessage(0x04, 0x71, [0xe3, 0x07, 0x06, 0x06, hours, minutes, seconds, 0x00, 0x01, 0x00, 0x08, 0x00]);
        await this.sendMessage(0x04, 0x71, [0xe3, 0x07, 0x06, 0x06, hours, minutes, seconds, 0, 1, 1, 1, 0]);
    }
    async getBatteryPower() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x08, 0x70, [0x00], response => {
                resolve(response[5]);
            });
        });
    }
    async getBatteryPowerWithChargingInfo() {
        return new Promise((resolve, _reject) => {
            this.sendMessage(0x08, 0x70, [0x01], response => {
                // highest bit is isCharging, ignored
                resolve(response[5] & 127);
            });
        });
    }
    async restoreFactory() {
        await this.sendMessage(0x0d, 0x71, [0x00]);
    }
    async setBindStart() {
        await this.sendMessage(0x93, 0x71, [1]);
    }
    async setBindEnd() {
        await this.sendMessage(0x94, 0x71, [1]);
    }
    async startCalibration() {
        await sbWatchDevice.sendMessage(0xB8, 0x71, [1, 1, 2]);
    }
    async endCalibration() {
        await sbWatchDevice.sendMessage(0xB8, 0x71, [1, 1, 3]);
    }
}

class RubiksConnectedDevice {
    constructor() {
        this.SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        this.RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        this.TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        this._characteristic = null;
        this._connectCallback = null;
        this._connectingCallback = null;
        this._disconnectCallback = null;
        this._messageCallback = null;
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
    _notification(event) {
        const characteristicValue = event.target.value;
        const messageRaw = Array.from(new Uint8Array(characteristicValue.buffer));
        // console.log(messageRaw);
        const messageType = messageRaw[2];
        const message = messageRaw.slice(3, messageRaw.length - 3);
        const messageStr = messageRaw.map(c => String.fromCharCode(c)).join('');
        if (messageType !== 3) {
            if (messageStr[0] === '*') {
                console.log(messageType, message);
            } else {
                console.log(messageStr);
            }
        }
    }
    async connect() {
        try {
            const device = await this._requestDevice();
            device.addEventListener('gattserverdisconnected', this._disconnected.bind(this));
            if (this._connectingCallback) this._connectingCallback();
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this._rxCharacteristic = await service.getCharacteristic(this.RX_CHARACTERISTIC_UUID);
            this._txCharacteristic = await service.getCharacteristic(this.TX_CHARACTERISTIC_UUID);
            this._txCharacteristic.addEventListener('characteristicvaluechanged', this._notification.bind(this));
            await this._txCharacteristic.startNotifications();
        } catch (error) {
            console.log('Error: ', error.message);
            this._disconnected();
            return;
        }
        await this._connected();
    }
    async _requestDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'Rubiks_'
            }, {
                namePrefix: 'GoCube_'
            }],
            optionalServices: [this.SERVICE_UUID]
        });
    }
    async sendCommand(...command) {
        await this._rxCharacteristic.writeValue(Uint8Array.from(command));
    }
    async _connected() {
        if (this._connectCallback) this._connectCallback();
    }
    async _disconnected() {
        console.log('disconnected.');
        if (this._disconnectCallback) this._disconnectCallback();
    }
}
