const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


const regex = /^([\wÀ-ú]+)\s+(\d+)\s*x\s*(\d+)\s+([\wÀ-ú]+)$/i;

async function handlePalpite(user, palpite) {
  const match = palpite.match(regex);

  if (!match) {
    return 'Formato inválido! Use: Grêmio 2 x 1 Inter';
  }

  const [, time1, gols1, gols2, time2] = match;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const date = new Date().toLocaleString('pt-BR');

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Palpites!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[user, time1, gols1, gols2, time2, date]],
    },
  });

  return 'Palpite registrado com sucesso!';
}
module.exports = { handlePalpite };
