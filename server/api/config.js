const config = {
  MeLiEndpoints: {
    search: (q) => `https://api.mercadolibre.com/sites/MLA/search?q=${q}`,
    categories: (c) => `https://api.mercadolibre.com/categories/${c}`,
    items: (id) => `https://api.mercadolibre.com/items/${id}`,
    description: (id) => `https://api.mercadolibre.com/items/${id}/description`,
  },
  port: 3232,
  maxResults: 4,
  author: {
    name: 'Diego',
    lastname: 'Amil',
  },
  routes: {
    itemInfo: '/api/items/:id',
    search: '/api/items',
  },
};

module.exports = {config};
