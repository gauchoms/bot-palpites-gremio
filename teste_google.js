import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

// Decodifica as credenciais da variável de ambiente (em base64) e transforma em objeto
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, 'base64').toString('utf-8')
);

// Cria autenticação com as credenciais e o escopo necessário para acessar planilhas
const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Inicializa o cliente da API Google Sheets com a autenticação configurada
const sheets = google.sheets({ version: 'v4', auth });

async function testarGoogleSheets() {
  try {
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID, // ID da planilha
      range: 'Jogos!A1:B1',                      // Intervalo que vamos sobrescrever
      valueInputOption: 'RAW',                   // Insere os valores exatamente como estão
      requestBody: {
        values: [['Teste', 'Funcionando']],      // Conteúdo de teste
      },
    });

    console.log('✅ Escreveu na planilha com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao escrever na planilha:', err.message);
  }
}

testarGoogleSheets();
