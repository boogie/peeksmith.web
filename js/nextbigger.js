const nextBigger = n => {
    const digits = n.toString().split('').map(n => +n);

    let candidateDigit = digits.length - 2;
    while (digits[candidateDigit + 1] <= digits[candidateDigit]) candidateDigit--;
    if (candidateDigit < 0) return -1;

    let digitsRight = digits.splice(candidateDigit);
    const candidate = digitsRight.shift();
    let { minDigit, minIndex } = digitsRight.reduce(({ minDigit, minIndex }, digit, i) => {
        if (digit > candidate && (minDigit === null || digit < minDigit)) { minDigit = digit; minIndex = i; }
        return { minDigit, minIndex };
    }, { minDigit: null, minIndex: null });
    if (minIndex == null) return -1;
    digitsRight.splice(minIndex, 1);
    digitsRight.push(candidate);
    digitsRight = digitsRight.sort();

    return +digits.concat([minDigit]).concat(digitsRight).join('');
}

nextBigger(2023498431); // ?

nextBigger(4321); //?
nextBigger(12); // ?
nextBigger(513); // ?
nextBigger(2017); // ?
nextBigger(414); // ?
nextBigger(144); // ?