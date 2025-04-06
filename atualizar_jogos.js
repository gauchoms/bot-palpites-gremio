import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

// Corrigido: nome da variável de ambiente está em maiúsculo
const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, 'base64').toString('utf-8'));

const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function atualizarPlanilha() {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures?team=130&next=10', {
      headers: {
        'x-apisports-key': process.env.APIFOOTBALL_KEY,
      },
    });

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
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Jogos!A2:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: jogos,
      },
    });

    console.log('Planilha atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar planilha:', error);
  }
}

atualizarPlanilha();
