const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('✅ EXPRESS SERVER IS RUNNING - ' + new Date());
});

app.get('/api/test', (req, res) => {
  res.json({ message: "API works!", server: "Express", time: new Date() });
});

app.listen(3000, '127.0.0.1', () => {
  console.log('='.repeat(50));
  console.log('EXPRESS SERVER STARTED ON PORT 3000');
  console.log('Test URL: http://127.0.0.1:3000/');
  console.log('API Test: http://127.0.0.1:3000/api/test');
  console.log('='.repeat(50));
});