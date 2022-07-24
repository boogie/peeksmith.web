function decode(m) {
    const dict = {
        '|-|': 'h',
        '[-': 'e',
        '|_': 'l',
        '()': 'o',
        ']3': 'b',
        '|': 'i',
        '|^': 'p'
    };
    const separator = m[0];
    const letters = m.split(separator).filter(letter => letter !== '').reverse().map(letter => dict[letter] || letter);
    console.log(letters);
}


decode('..[-.|_.|^....().[-.|^.__..|)...|.|^.|_|..~|~._\\~.__...[-..|.|)..');