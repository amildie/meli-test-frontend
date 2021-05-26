const express = require('express');
const api = require('./api/api');
const cors = require('cors');
const port = api.port;
const app = express();

app.use(cors());
app.options('*', cors());
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

app.get(api.itemInfoRoute, (req, res) => {
  const itemId = req.params.id;
  if (!itemId) {
    res.status(400).send('Bad request');
  }

  api.getItemInfo(itemId).then((responseData) => {
    res.status(200).send(responseData);
  });
});

app.get(api.searchRoute, (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.status(400).send('Bad request');
  }

  api.getSearchResults(searchQuery).then((searchResults) => {
    res.status(200).send(searchResults);
  });
});
