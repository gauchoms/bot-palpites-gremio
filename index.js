require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handlePalpite } = require('./services/sheets');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webhook', async (req, res) => {
  const twiml = new MessagingResponse();
  const message = req.body.Body;
  const from = req.body.From;

  const result = await handlePalpite(from, message);
  twiml.message(result);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(process.env.PORT, () => {
  console.log(`Bot rodando na porta ${process.env.PORT}`);
});
