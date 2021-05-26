# Resolución del ejercicio

Este ejercicio cuenta con dos proyectos, un cliente y un servidor. Para correrlo hay que ejecutar `npm i` y `npm start` en ambas carpetas.

## El servidor

Es un servidor de ExpressJS que escucha en el puerto `3232` exponiendo los endpoints `/api/items/:id` y `/api/items?q=:query`.

Al recibir una request utiliza la API de MercadoLibre para obtener la información mediante `axios`. Luego de obtenerla realiza una serie de operaciones para darle el formato que espera la UI.

Por ejemplo, esta es la función interna del servidor que toma una `searchQuery` enviada por request, realiza el search con el endpoint de MeLi, busca las categorías para el breadcrumb, y le da el formato a los items; devolviendo todo en un objeto llamado `responseData` que sigue la especificación del enunciado:

```javascript
async function getSearchResults(searchQuery) {
  const doSearchResponse = await doSearch(searchQuery);
  const categoryIdMaxResults = getCategoryWithMaxResults(doSearchResponse.available_filters, doSearchResponse.filters);
  const responseData = emptySignedResponse();
  responseData.items = formatItems(doSearchResponse.results);
  responseData.categories = await getCategories(categoryIdMaxResults);
  return responseData;
}
```

## El cliente

El cliente está diseñado con un enfoque top-down minimalista usando componentes funcionales con responsabilidades aisladas:

* `<Main>` es el parent de todos los otros componentes y actúa como controlador de las tres vistas. Este componente tiene la responsabilidad de inferir el estado de la app dependiendo de los parámetros y la ruta en la URL. Por ejemplo, si la ruta es de la forma `/items?search=q` entonces `<Main>` va a setear el estado interno de la app como `searchView`, y en base a ese estado va a determinar qué componentes mostrar.
* `<SearchBar>` es la barra superior de búsqueda, se muestra en todas las vistas.
* `<Breadcrumb>` también se muestra en todas las vistas, pero solo tiene contenido cuando el usuario está realizando un search o viendo un ítem.
* `<SearchView>` se muestra cuando el estado de la app es `searchView`. Este componente recibe en sus `props` la query para buscar y se encarga de hacer un `fetch` al endpoint `/api/items?q=:query` del servidor. Al terminar el `fetch`, el componente crea un `<Result>` por cada ítem devuelto.
  * `<Result>` es el componente que muestra el rectángulo con la información de cada resultado obtenido (thumbnail, precio, etc). Hacer click en un `<Result>` te redirecciona a `/items/:id`, donde el `id` es una `prop` del `<Result>`.
* `<ItemView>` se muestra cuando el estado de la app es `itemView`. Este componente recibe dentro de sus `props` el `id` de un artículo y le hace un `fetch` al endpoint `/api/items/:id` del servidor. Al resolverse el `fetch` mostrará la información del ítem que fue pasado como parámetro en la ruta.

### Challenges

Como los componentes `<SearchView>` y `<ItemView>` son responsables de ir a buscar la información que necesitan, también son responsables de actualizar el `<Breadcrumb>` luego de obtenerla.

La información de las categorías necesaria para el `<Breadcrumb>` se puede obtener con la API de Search. Esto significa que si entro a la ruta `/items?search=q`, voy a tener las categorías en la respuesta de `/api/items?q=:query`.

Pero si el usuario quiere entrar directamente a la ruta `/items/:id`, el componente `<Main>` va a mostrar al componente `<ItemView>` directamente, sin hacer ningún search antes, y en la respuesta de `/api/items/:id` no hay información sobre categorías (ver enunciado).

Entonces, ¿cómo puedo completar el `<Breadcrumb>` si accedo directamente a `/items/:id`? Esto lo solucioné pasándole una callback a `<ItemView>` que actualiza el `<Breadcrumb>` al resolverse la promesa del fetch, y agregando a la respuesta de `/api/items/:id` un atributo `categories`.

### Tests del cliente

Se corren con `npm test` en `/client` y hay que tener el server corriendo. Son tests de Jest que usan testing-library. Tienen mucha latencia porque están usando el mismo server que la app. Se podría usar json-server para mejorar eso.

```
 PASS  src/index.test.js
  ✓ The Main app renders correctly (47 ms)
  ✓ The ItemView renders correctly (804 ms)
  ✓ The SearchView renders correctly (1490 ms)
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        5.141 s, estimated 23 s
Ran all test suites.
```
