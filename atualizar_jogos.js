async function atualizarPlanilha() {
  try {
    console.log('Iniciando atualização da planilha...');

    const response = await axios.get('https://v3.football.api-sports.io/fixtures?team=130&next=10', {
      headers: {
        'x-apisports-key': process.env.APIFOOTBALL_KEY,
      },
    });

    console.log('Resposta bruta da API-Football:');
    console.log(JSON.stringify(response.data, null, 2));

    const jogos = response.data.response.map((jogo) => {
      const data = new Date(jogo.fixture.date);
      return [
        data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        jogo.teams.home.name,
        jogo.teams.away.name,
        jogo.league.name,
      ];
    });
    console.log('Jogos a serem inseridos na planilha:');
    console.log(JSON.stringify(jogos, null, 2)); // <-- Esse aqui imprime bonitinho
    
    
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
