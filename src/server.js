const express = require('express'); // Importar el módulo express
require('dotenv').config(); // Cargar variables de entorno desde un archivo .env
const cors = require('cors'); // Módulo para habilitar el middleware de CORS

// Instancia de Express para la creación de las rutas solicitadas
const app = express();

//Obtener las funciones que poseen los callbacks
const { obtenerJoyas, obtenerJoyasPorFiltro, obtenerJoya, reportMiddleware } = require('./controllers/consultas');

const PORT = process.env.PORT || 3000; // Puerto a utilizar para el servidor

app.use(cors()); // Habilitar el middleware de CORS para permitir comunicación entre diferentes dominios

app.use(express.json()); // Configurar body-parser para parsear las solicitudes JSON

app.get('/joyas', reportMiddleware, obtenerJoyas); // Ruta para obtener todas las joyas

app.get('/joyas/joya/:id', reportMiddleware, obtenerJoya); // Ruta para obtener una joya específica por su ID

app.get('/joyas/filtros', reportMiddleware, obtenerJoyasPorFiltro); // Ruta para obtener joyas filtradas

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe"); // Ruta para manejar todas las demás rutas no definidas
});

app.listen(PORT, () => {
    console.log(`Servidor de Express escuchando en el puerto ${PORT}`); // Iniciar el servidor y escuchar en el puerto especificado
});
