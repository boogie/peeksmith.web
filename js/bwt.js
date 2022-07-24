function encode(s) {
    let rows = [...s].map((_, i) => (s + s).substr(i, s.length)).sort();
    let originalIndex = rows.findIndex(row => row == s);
    let lastColumn = rows.map(row => row[row.length - 1]).join('');
    return [lastColumn, originalIndex];
}

function decode(s, i) {
    let columns = Array.from(s).map(_ => []);
    columns[s.length - 1] = [...s];
    columns[0] = [...s].sort();
    let pairs = columns[0].reduce((pairs, firstChar, i) => {
        let lastChar = columns[s.length - 1][i];
        if (!pairs[lastChar]) {
            pairs[lastChar] = [firstChar];
        } else {
            pairs[lastChar].push(firstChar);
        }
        return pairs;
    }, {});
    let i = 0;
    Object.keys(pairs).forEach(firstChar => {
        pairs[firstChar].forEach(secondChar => columns[1][i++] = secondChar);
    });

    }
    pairs; //?
    lastColumn.reduce((pairs, lastChar, i) => pairs[lastChar]);
    return pairs;
}

encode('bananabar'); //?
encode('Humble Bundle'); //?
encode('Mellow Yellow'); //?

decode(...encode('bananabar')); //?
decode(...encode('Humble Bundle')); //?
decode(...encode('Mellow Yellow')); //?
