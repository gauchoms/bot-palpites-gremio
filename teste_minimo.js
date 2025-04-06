console.log('🧪 Rodando teste mínimo...');
console.log('GOOGLE_CREDENTIALS_B64 existe?', !!process.env.GOOGLE_CREDENTIALS_B64);
console.log('SPREADSHEET_ID:', process.env.SPREADSHEET_ID);
console.log('APIFOOTBALL_KEY:', process.env.APIFOOTBALL_KEY ? '✅ ok' : '❌ falta');
