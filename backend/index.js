import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const express = require('express');
const fetch = require('isomorphic-fetch');

const app = express();
const PORT = 5000; // Choose any available port number

app.use(express.json());

// CORS middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/currencies/:date', async (req, res) => {
  const { date } = req.params;
  const apiUrl = `https://cbar.az/currencies/${date}.xml`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const xmlText = await response.text();
    res.set('Content-Type', 'text/xml');
    res.send(xmlText);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
