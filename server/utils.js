const MAX_ITEMS_TO_DISPLAY = 4;
const axios = require('axios');

function parseItemDetails(itemDetails) {
  return {
    id: itemDetails.id,
    title: itemDetails.title,
    price: {
      currency: itemDetails.currency_id,
      amount: itemDetails.price,
      decimals: itemDetails.decimals,
    },
    picture: itemDetails.pictures[0].url,
    condition: itemDetails.condition,
    free_shipping: itemDetails.shipping.free_shipping,
    sold_quantity: itemDetails.sold_quantity,
  };
}

function formatItems(results) {
  let countedItems = 0;
  const items = [];
  for (const result of results) {
    if (countedItems >= MAX_ITEMS_TO_DISPLAY) {
      break;
    }
    const item = {
      id: result.id,
      title: result.title,
      price: getLatestPrice(result.prices.prices),
      picture: result.thumbnail,
      condition: result.condition,
      free_shipping: result.shipping.free_shipping,
    };
    items.push(item);
    countedItems++;
  }
  return items;
}

function getLatestPrice(prices) {
  prices.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
  const latestPrice = prices[0];
  const latestPriceSplt = String(latestPrice.amount).split('.');
  return {
    currency: latestPrice.currency_id,
    amount: parseInt(latestPriceSplt[0]),
    decimals: latestPriceSplt[1] ? parseInt(latestPriceSplt[1]) : 00
  };
}

function getCategoryWithMaxResults(available_filters, filters) {
  const categoryList = [...available_filters, ...filters].find(filter => filter.id === 'category').values;
  const maxResultsCategory = categoryList.reduce((prev, current) => (prev.results > current.results) ? prev : current);
  return maxResultsCategory.id;
}

async function getItemDetails(itemId) {
  const ITEM_URL = `https://api.mercadolibre.com/items/${itemId}`;
  return axios.get(ITEM_URL).then(itemResponse => itemResponse);
}

async function getCategories(categoryId) {
  const CATEGORY_URL = "https://api.mercadolibre.com/categories/"+categoryId;
  return axios.get(CATEGORY_URL).then(categoryResponse => categoryResponse.data.path_from_root.map(c => c.name));  
}

async function getItemDescription(itemId) {
  const ITEM_DESCRIPTION_URL = 'https://api.mercadolibre.com/items/'+itemId+'/description';
  return axios.get(ITEM_DESCRIPTION_URL).then(descriptionResponse => descriptionResponse.data.plain_text);
}

async function getItemInfo(itemId) {
  const responseData = { author: {name: 'Diego', lastname: 'Amil'} };
  const itemResponse = await getItemDetails(itemId);
  responseData.item = parseItemDetails(itemResponse.data);
  responseData.categories = await getCategories(itemResponse.data.category_id);
  responseData.item.description = await getItemDescription(itemId);
  return responseData;
}

async function doSearch(searchQuery) {
  const URL = 'https://api.mercadolibre.com/sites/MLA/search?q='+searchQuery;
  return axios.get(URL).then(response => response.data);
}

async function getSearchResults(searchQuery) {
  const responseData = { author: {name: 'Diego', lastname: 'Amil'} };
  const doSearchResponse = await doSearch(searchQuery);
  const categoryIdMaxResults = getCategoryWithMaxResults(doSearchResponse.available_filters, doSearchResponse.filters);
  responseData.items = formatItems(doSearchResponse.results);
  responseData.categories = await getCategories(categoryIdMaxResults);
  return responseData;
}

module.exports = {formatItems, getLatestPrice, getCategoryWithMaxResults, getCategories, getItemDescription, getItemInfo, getSearchResults};
