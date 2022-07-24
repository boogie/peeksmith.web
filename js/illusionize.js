const lang = 'en-GB';
const say = async (text) => {
  const message = new SpeechSynthesisUtterance(text);
  message.rate = 1.2;
  message.lang = lang;
  await speechSynthesis.speak(message);
};

document.body.addEventListener('click', ()=>{
    let insight = new InsightDevice();
    insight.connect();
    insight.onMessage(data => {
        let colors = ['', 'Clubs', 'Hearts', 'Spades', 'Diamonds'];
        let values = ['', 'Ace', 'Two', 'Three', 'Four', 'Fice', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];
        let esp = ['', 'circle', 'cross', 'waves', 'square', 'star']
        let cards = data.filter(c => c > 0).map(c => {
            let color = ~~(c / 16);
            let value = c % 16;
            if (color === 0) return esp[value];
            return values[value] + ' of ' + colors[color];
        });
        say(cards[0]);
    });
});

