const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 2555;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/proxy', async (req, res) => {
  try {
    const url = 'https://luatvietnam.vn/bang-gia-xang-dau-hom-nay.html';
    const response = await fetch(url);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(500).send('Error fetching the data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
