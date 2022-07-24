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
        }
        lines[currentLine] += char;
    }
    if (lines.length > dimensions.rows && fontSize > 1) return wrapText(text, wrap, fontSize - 1);
    return { fontSize, lines, dimensions };
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
    function displayOneRowWithSpaces(x, y, fontSize, fontWidth, spaceWidths, text) {
        let pieces = [];
        let words = text.split(' ');
        for (let i = 0; i < words.length; x += fontWidth * words[i].length + spaceWidths[words.length][i], i++)
            pieces.push(`@T${x},${y},${fontSize},0,${words[i]}\n`);
        return pieces;
    }
 
    if (fontSize === 1) {
        return displaySimple(lines);
    }
    if (lines.length === 1 && fontSize >= 2) {
        const lineLength = lines[0].length;
        if (lineLength < 8)
            return displaySimple(lines);
        if (lineLength === 8) {
            let words = lines[0].split(' ');
            if (words.length < 3)
                return displaySeparately(displayOneRow(0, 7, 3, 16, lines[0]));
                return displaySeparately(displayOneRowWithSpaces(0, 7, 3, 16, {
                    3: [13, 12],
                    4: [14, 14, 14]
                }, lines[0]));
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
                pieces.push(...displayOneRowWithSpaces(0, y, 2, 12, {
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
const { fontSize, lines, dimensions } = wrapText(text, wrap);
return displayText(fontSize, lines, dimensions);
