const fs = require('fs');
const credentials = fs.readFileSync('credentials.json', 'utf8');
const base64 = Buffer.from(credentials).toString('base64');
console.log(base64);
