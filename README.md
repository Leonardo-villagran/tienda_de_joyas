# tienda_de_joyas 

>Tarea 5: Diseño avanzado de API REST de DesafioLatam para el módulo: Backend con Node y Express (G27)

API para gestionar joyas. Permite obtener información sobre las joyas disponibles, filtrarlas por diferentes criterios y obtener detalles de una joya específica.

## Requisitos previos

- Node.js y npm instalados en el sistema.
- PostgreSQL instalado y configurado.
- Archivo `.env` con las siguientes variables de entorno configuradas:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=joyas
```

## Instalación

1. Clona este repositorio: `git clone https://github.com/Leonardo-villagran/tienda_de_joyas`
2. Ve al directorio del proyecto: `cd tienda_de_joyas`
3. Instala las dependencias: `npm install`


## Uso

1. Inicia el servidor: `npm run dev`
2. Realiza las solicitudes HTTP a través de la API utilizando las rutas y métodos disponibles.

### Rutas disponibles

- `GET /joyas`: Obtiene la estructura HATEOAS de todas las joyas almacenadas en la base de datos. Permite la paginación y ordenamiento mediante los siguientes parámetros de query string:
  - `limits`: Limita la cantidad de joyas a devolver por página.
  - `page`: Define la página con joyas que debe ser mostrada.
  - `order_by`: Ordena las joyas según el valor de este parámetro. Puede ser uno de los siguientes valores:
    - `id_ASC`: Orden ascendente por ID.
    - `id_DESC`: Orden descendente por ID.
    - `nombre_ASC`: Orden ascendente por nombre.
    - `nombre_DESC`: Orden descendente por nombre.
    - `categoria_ASC`: Orden ascendente por categoría.
    - `categoria_DESC`: Orden descendente por categoría.
    - `metal_ASC`: Orden ascendente por metal.
    - `metal_DESC`: Orden descendente por metal.
    - `precio_ASC`: Orden ascendente por precio.
    - `precio_DESC`: Orden descendente por precio.
    - `stock_ASC`: Orden ascendente por stock.
    - `stock_DESC`: Orden descendente por stock.
    
    Si no se especifica el orden ascendente o descendente, se asume que es ascendente.

  - Ejemplo de ruta para obtener todas las joyas con estructura HATEOAS:
    ```
        - GET /joyas?limits=10&page=1&order_by=id_ASC
        - Esta ruta obtiene las primeras 10 joyas, en la página 1, ordenadas por ID de forma ascendente.
    ```

- `GET /joyas/joya/:id`: Obtiene los detalles de una joya específica por su ID.

  - Ejemplo de ruta para obtener una joya específica por su ID:
    ```
        - GET /joyas/joya/2
        - Esta ruta obtiene la joya con ID igual a 2.
    ```

- `GET /joyas/filtros`: Filtra las joyas por diferentes criterios. Permite filtrar las joyas utilizando los siguientes parámetros de query string:
  - `precio_max`: Filtra las joyas hasta un precio máximo definido.
  - `precio_min`: Filtra las joyas desde un precio mínimo definido.
  - `categoria`: Filtra las joyas por la categoría.
  - `metal`: Filtra las joyas por el metal.

  - Ejemplo de ruta para filtrar las joyas por diferentes criterios:
    ```
        - GET /joyas/filtros?precio_max=10000&categoria=anillo&metal=oro
        - Esta ruta filtra las joyas con un precio máximo de 1000 y pertenecientes a la categoría "anillos".
    ```

### Middlewares

El servidor utiliza un middleware como capa de reporte en cada una de las rutas. Esto permite imprimir información detallada de cada solicitud recibida.

Además, se utiliza `try...catch` para capturar posibles errores durante una consulta o la lógica de cada ruta.
