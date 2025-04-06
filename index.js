// atualizar_jogos.js

import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

// Verifica se a variável está definida
console.log('GOOGLE_CREDENTIALS_B64 existe?', !!process.env.GOOGLE_CREDENTIALS_B64);
console.log('Valor (parcial):', (process.env.GOOGLE_CREDENTIALS_B64 || '').slice(0, 50));

// Decodifica a variável de ambiente
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, 'base64').toString('utf-8')
);

const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function atualizarPlanilha() {
  const response = await axios.get(
    'https://v3.football.api-sports.io/fixtures?team=130&next=10',
    {
      headers: {
        'x-apisports-key': process.env.APIFOOTBALL_KEY,
      },
    }
  );

  const jogos = response.data.response.map((jogo) => {
    const data = new Date(jogo.fixture.date);
    return [
      data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      jogo.teams.home.name,
      jogo.teams.away.name,
      jogo.league.name,
    ];
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Jogos!A2:D',
    valueInputOption: 'RAW',
    requestBody: {
      values: jogos,
    },
  });

  console.log('Planilha atualizada com sucesso!');
}

atualizarPlanilha().catch(console.error);
