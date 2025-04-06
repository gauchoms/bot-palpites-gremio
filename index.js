// Importa o módulo 'axios' para fazer requisições HTTP
import axios from 'axios';

// Importa a classe GoogleAuth para autenticar com a API do Google
import { GoogleAuth } from 'google-auth-library';

// Importa o módulo googleapis para interagir com serviços do Google como o Sheets
import { google } from 'googleapis';

// Lê a variável de ambiente GOOGLE_CREDENTIALS_B64, que contém as credenciais codificadas em base64
// Decodifica a string base64 para texto e transforma em um objeto com JSON.parse
// Isso é necessário pois as credenciais são armazenadas de forma segura como texto codificado
const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, 'base64').toString('utf-8'));

// Cria um cliente de autenticação usando as credenciais do Google
const auth = new GoogleAuth({
  credentials, // o objeto com os dados do serviço
  scopes: ['https://www.googleapis.com/auth/spreadsheets'], // escopo de acesso à planilha
});

// Inicializa o cliente da API Google Sheets com autenticação
// Esta linha configura a instância do cliente da API Google Sheets, utilizando a autenticação criada acima
// Assim, podemos realizar operações como leitura e escrita na planilha
const sheets = google.sheets({ version: 'v4', auth });

// Função principal que atualiza a planilha
async function atualizarPlanilha() {
  // Requisição para a API-Football para obter os próximos 10 jogos do Grêmio (ID 130)
  const response = await axios.get('https://v3.football.api-sports.io/fixtures?team=130&next=10', {
    headers: {
      'x-apisports-key': process.env.APIFOOTBALL_KEY, // chave da API passada via variável de ambiente
    },
  });

  // Processa os dados recebidos para extrair os campos desejados para a planilha
  const jogos = response.data.response.map((jogo) => {
    const data = new Date(jogo.fixture.date); // transforma a string da data em um objeto Date
    return [
      data.toLocaleString(),       // Coluna A: data e hora do jogo, no formato local
      jogo.league.name,            // Coluna B: nome da competição
      jogo.teams.away.name,        // Coluna C: nome do time adversário
      jogo.teams.home.name         // Coluna D: nome do time mandante (Grêmio)
    ];
  });

  // Atualiza os dados da planilha no intervalo definido (A2 até D)
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID, // ID da planilha vindo da variável de ambiente
    range: 'Jogos!A2:D',                       // Aba 'Jogos', da célula A2 até a D (excluindo cabeçalhos)
    valueInputOption: 'RAW',                   // Insere os valores exatamente como estão
    requestBody: {
      values: jogos,                           // Array com os dados dos jogos a serem inseridos
    },
  });

  console.log('Planilha atualizada com sucesso!'); // Confirmação no log
}

// Executa a função principal e mostra qualquer erro no console
atualizarPlanilha().catch(console.error);
