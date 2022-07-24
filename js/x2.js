
function findSecretMessage(paragraph) {
    let words = paragraph.match(/\w+/gsm).map(word => word.toLowerCase());
    let message = [];
    for (let i = 0; i < words.length; i += 3) {
        message.push(words[i]);
    }
    return message.join(' '); //?
}

findSecretMessage('This is a test. this test is fun.', 'this test is');
findSecretMessage('asdf qwer zxcv. zxcv fdsa rewq. qazw asdf sxed. qwer crfv.', 'zxcv asdf qwer');
findSecretMessage('asdf qwer zxcv. zxcv fdsa rewq. qazw asdf sxed. qwer crfv asdf.', 'zxcv asdf qwer');
findSecretMessage('there is a secret message in the first six sentences of this kata description. have you ever felt like there was something more being said? was it hard to figure out that unspoken meaning? never again! never will a secret go undiscovered. find all duplicates from our message!', 'there was never a secret message');
findSecretMessage('', '');
findSecretMessage('', '');
findSecretMessage('', '');
findSecretMessage('', '');
