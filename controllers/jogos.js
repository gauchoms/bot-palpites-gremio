const api = require('../services/api-football');

async function buscarJogosDoGremio() {
  const timeId = 185; // ID do Grêmio na API-Football
  const anoAtual = new Date().getFullYear();

  const { data } = await api.get('/fixtures', {
    params: {
      team: timeId,
      season: anoAtual,
      next: 10, // buscar os próximos 10 jogos
    },
  });

  return data.response.map(jogo => ({
    data: jogo.fixture.date,
    adversario: jogo.teams.away.name === 'Gremio' ? jogo.teams.home.name : jogo.teams.away.name,
    casa: jogo.teams.home.name === 'Gremio',
    campeonato: jogo.league.name,
  }));
}

module.exports = { buscarJogosDoGremio };
