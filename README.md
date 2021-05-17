# Resolución del ejercicio

Este ejercicio cuenta con dos proyectos, un cliente y un servidor. 

Para correrlo hay que ejecutar `npm i` y `npm start` en cada carpeta.

## El servidor

Es un servidor de ExpressJS escucha en el puerto `3232` exponiendo los endpoints `/api/items/:id` y `/api/items?q=:query`.

Al recibir una request utiliza la API de MercadoLibre para obtener la información mediante `axios`. Luego de obtenerla realiza una serie de operaciones para darle el formato correspondiente a lo que pide el enunciado.

Por ejemplo, esta es la función interna del servidor que toma una `searchQuery` enviada por request, realiza el search con el endpoint de MeLi, busca las categorías para el breadcrumb, y le da el formato a los items; devolviendo todo en un objeto llamado `responseData`:

```javascript
async function getSearchResults(searchQuery) {
  const responseData = { author: {name: 'Diego', lastname: 'Amil'} };
  const doSearchResponse = await doSearch(searchQuery);
  const categoryIdMaxResults = getCategoryWithMaxResults(doSearchResponse.available_filters, doSearchResponse.filters);
  responseData.items = formatItems(doSearchResponse.results);
  responseData.categories = await getCategories(categoryIdMaxResults);
  return responseData;
}
```

## El cliente

El cliente está diseñado con un enfoque top-down minimalista usando componentes funcionales con responsabilidades aisladas:

* `<Main>` es el parent de todos los otros componentes y engloba la totalidad de la app. Este componente tiene la responsabilidad de inferir el estado de la app dependiendo de los parámetros y la ruta en la URL. Por ejemplo, si la ruta es de la forma `/api/items?q=:query` entonces `<Main>` va a setear el estado interno de la app como `searchView`, y en base a ese estado va a determinar que componentes mostrar.
* `<SearchBar>` es la barra superior de búsqueda, se muestra en todas las vistas.
* `<Breadcrumb>` también se muestra en todas las vistas, pero sólo tiene contenido cuando el usuario está realizando un search o viendo un ítem.
* `<SearchView>` se muestra cuando el estado de la app es `searchView`. Este componente recibe en sus `props` la query para buscar y se encarga de hacer un `fetch` al endpoint `/api/items?q=:query` del servidor. Al terminar el `fetch`, el componente crea un `<Result>` por cada ítem devuelto.
  * `<Result>` es el componente que muestra el rectángulo con la información de cada resultado obtenido (thumbnail, precio, etc). Hacer click en un `<Result>` te redirecciona a la URL correspondiente a la vista detallada del ítem correspondiente.
* `<ItemView>` se muestra cuando el estado de la app es `itemView`. Este componente recibe dentro de sus `props` el `id` de un artículo y le hace un `fetch` al endpoint `/api/items/:id` del servidor. Al resolverse el `fetch` va a mostrar la vista del ítem que fue pasado como parámetro en la ruta.

## Challenges

Como los componentes `<SearchView>` y `<ItemView>` son responsables de ir a buscar la información que necesitan, también son responsables de actualizar el `<Breadcrumb>` luego de obtenerla.

Por ejemplo, si el usuario quiere entrar directamente a la vista `/items/:id`, el componente `<Main>` va a mostrar al componente `<ItemView>` directamente, sin hacer ningún search antes.

Entonces, cómo puedo completar el `<Breadcrumb>` si accedo directamente a la vista de un ítem? Lo solucioné pasándole una callback a `<ItemView>` que actualiza el `<Breadcrumb>` al resolverse la promesa del fetch.
