const express = require('express');
const utils = require('./utils');
const cors = require('cors');
const port = 3232;
const app = express();

app.use(cors());
app.options('*', cors());
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

app.get('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  if (!itemId) {
    res.status(400).send("Bad request");
  }

  utils.getItemInfo(itemId).then(responseData => {
    res.status(200).send(responseData);
  });
});

app.get('/api/items', (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.status(400).send("Bad request");
  }
  
  utils.getSearchResults(searchQuery).then(searchResults => {
    res.status(200).send(searchResults);
  });
});
