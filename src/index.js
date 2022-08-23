require('dotenv').config();

const express = require('express');
const twilio = require('twilio');

const app = express();

const PORT = process.env.PORT || 3000;

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

  if ( !(options.includes(userChoice.toLowerCase())) ) {
    return response.send('<Response><Message>Escolha pedra, papel ou tesoura.</Message></Response>');
  }

  const botChoice = options[ Math.floor( Math.random() * options.length ) ];

  if (botChoice === userChoice.toLowerCase()) {
    return response.send('<Response><Message>Ops! Parece que empatamos...</Message></Response>');
  }

  const isUserWinner = wins[userChoice.toLowerCase()] === botChoice;

  if (!isUserWinner) {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(`*${botChoice}* ganha de *${userChoice}*`);
    twiml.message(`Eu ganhei!!!`);

    return response.send(twiml.toString());
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(`*${userChoice}* ganha de *${botChoice}*`);
  twiml.message('Você ganhou :(... Quero revanche!');

  response.send(twiml.toString());

});

app.listen(PORT, () => console.log('Server is running...'));
