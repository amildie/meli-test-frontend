const axios = require('axios');
const {config} = require('./config.js');

const emptySignedResponse = () => {
  return {author: config.author};
};

const port = config.port;
const itemInfoRoute = config.routes.itemInfo;
const searchRoute = config.routes.search;

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
    if (countedItems >= config.maxResults) {
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
    decimals: latestPriceSplt[1] ? parseInt(latestPriceSplt[1]) : 00,
  };
}

function getCategoryWithMaxResults(available_filters, filters) {
  const categoryList = [...available_filters, ...filters].find((filter) => filter.id === 'category').values;
  const maxResultsCategory = categoryList.reduce((prev, current) => (prev.results > current.results) ? prev : current);
  return maxResultsCategory.id;
}

async function getItemDetails(itemId) {
  const requestURL = config.MeLiEndpoints.items(itemId);
  return axios.get(requestURL).then((itemResponse) => itemResponse);
}

async function getCategories(categoryId) {
  const requestURL = config.MeLiEndpoints.categories(categoryId);
  return axios.get(requestURL).then((categoryResponse) => categoryResponse.data.path_from_root.map((c) => c.name));
}

async function getItemDescription(itemId) {
  const requestURL = config.MeLiEndpoints.description(itemId);
  return axios.get(requestURL).then((descriptionResponse) => descriptionResponse.data.plain_text);
}

async function doSearch(searchQuery) {
  const requestURL = config.MeLiEndpoints.search(searchQuery);
  return axios.get(requestURL).then((response) => response.data);
}

async function getItemInfo(itemId) {
  const itemResponse = await getItemDetails(itemId);
  const responseData = emptySignedResponse();
  responseData.item = parseItemDetails(itemResponse.data);
  responseData.item.description = await getItemDescription(itemId);
  responseData.categories = await getCategories(itemResponse.data.category_id);
  return responseData;
}

async function getSearchResults(searchQuery) {
  const doSearchResponse = await doSearch(searchQuery);
  const categoryIdMaxResults = getCategoryWithMaxResults(doSearchResponse.available_filters, doSearchResponse.filters);
  const responseData = emptySignedResponse();
  responseData.items = formatItems(doSearchResponse.results);
  responseData.categories = await getCategories(categoryIdMaxResults);
  return responseData;
}

module.exports = {getItemInfo, getSearchResults, port, itemInfoRoute, searchRoute};
