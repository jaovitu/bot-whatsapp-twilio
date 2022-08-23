const express = require('express');
const twilio = require('twilio');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const options = [ 'pedra', 'papel', 'tesoura' ];

const wins = {
  pedra: 'tesoura',
  papel: 'pedra',
  tesoura: 'papel'
};

app.post('/message', (request, response) => {
  const { Body: userChoice } = request.body;

  if ( !(options.includes(userChoice)) ) {
    return response.send('<Response><Message>Escolha pedra, papel ou tesoura.</Message></Response>');
  }

  const botChoice = options[ Math.floor( Math.random() * options.length ) ];

  const isUserWinner = wins[userChoice.toLowerCase()] === botChoice;

  if (!isUserWinner) {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(`*${botChoice}* ganha de *${userChoice}*`);
    twiml.message(`Eu ganhei!!!`);

    return response.send(twiml.toString());
  }

  const twiml = twilio.twiml.MessagingResponse();
  twiml.message(`*${userChoice}* ganha de *${botChoice}*`);
  twiml.message('Você ganhou :(... Quero revanche!');

  response.send(twiml.toString());

});

app.listen(3000, () => console.log('Server is running on port 3000...'));
