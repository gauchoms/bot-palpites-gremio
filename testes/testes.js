const axios = require('axios');

async function testarJogosGremio() {
  const teamId = 130; // Grêmio
  const url = `https://v3.football.api-sports.io/fixtures?team=${teamId}&next=5`;

  try {
    const response = await axios.get(url, {
      headers: {
        'x-apisports-key': process.env.API_FOOTBALL_KEY || 'SUA_CHAVE_AQUI',
      },
    });

    const jogos = response.data.response.map(jogo => ({
      data: jogo.fixture.date,
      adversario: jogo.teams.home.id === teamId ? jogo.teams.away.name : jogo.teams.home.name,
      local: jogo.teams.home.id === teamId ? 'Casa' : 'Fora',
      campeonato: jogo.league.name,
    }));

    console.log(jogos);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error.response?.data || error.message);
  }
}

testarJogosGremio();
