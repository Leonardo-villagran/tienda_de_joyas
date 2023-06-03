// Importar los módulos necesarios
const { Pool } = require('pg'); // Módulo para la conexión con PostgreSQL
const format = require('pg-format'); // Módulo para formatear las consultas SQL
require('dotenv').config(); // Módulo para cargar variables de entorno desde un archivo .env

// Configurar la conexión a la base de datos PostgreSQL a través de variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});

// Función para obtener joyas de una base de datos, aplicando restricciones a través de solicitudes desde el cliente con respecto a límite, orden y página de los distintos objetos almacenados.  
const obtenerJoyas = async (req, res) => {
    try {
        const { limits = 10, order_by = "id_ASC", page = 1 } = req.query;

        const [campo, direccion] = order_by.split("_");
        
        let fix;
        if (!page){
            fix = 0;
        }
        else if (page==0){
            fix = 0;
        }
        else{
            fix = Math.abs(page-1);
        }
    
        console.log(fix);
        const offset = (fix * limits);
        console.log(offset);
        const consulta = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);
        const result = await pool.query(consulta);
        const joyas = result.rows;

        const HATEOAS = await prepararHATEOAS(joyas);
        res.json(HATEOAS);
    } catch (error) {
        console.log("Error al obtener las joyas");
        res.status(500).json({ error: "Error al obtener las joyas" });
    }
}
// Función para obtener datos de una joya, a través de un ID obtenido como parámetro. 
const obtenerJoya = async (req, res) => {
    try {
        const { id } = req.params;

        const consulta = format("SELECT * FROM inventario WHERE id = %s", id);
        const result = await pool.query(consulta);
        const joya = result.rows[0];

        if (!joya) {
            console.log("Error, joya no encontrada.");
            res.status(404).json({ error: "Joya no encontrada." });
        } else {
            res.json(joya);
        }
    } catch (error) {
        console.log("Error al obtener la joya.");
        res.status(500).json({ error: "Error al obtener la joya." });
    }
};
const obtenerJoyasPorFiltro = async (req, res) => {
    try {
        const { precio_max, precio_min, categoria, metal } = req.query;
        let filtros = [];
        let values = [];

        // Función auxiliar para agregar un filtro a la consulta
        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor);
            const { length } = filtros;
            filtros.push(`${campo} ${comparador} $${length + 1}`);
        };

        if (precio_max) agregarFiltro('precio', '<=', precio_max);
        if (precio_min) agregarFiltro('precio', '>=', precio_min);
        if (categoria) agregarFiltro('categoria', 'LIKE', `%${categoria}%`);
        if (metal) agregarFiltro('metal', 'LIKE', `%${metal}%`);

        let consulta = "SELECT * FROM inventario";

        if (filtros.length > 0) {
            filtros = filtros.join(" AND ");
            consulta += ` WHERE ${filtros}`;
        }

        const result = await pool.query(consulta, values);
        const joyas = result.rows;

        res.json(joyas);
    } catch (error) {
        console.log("Error al obtener las joyas por filtro.");
        res.status(500).json({ error: "Error al obtener las joyas por filtro." });
    }
};

// Función para preparar un objeto HATEOAS
const prepararHATEOAS = (joyas) => {
    try {
        const results = joyas.map((m) => {
            return {
                name: m.nombre,
                href: `/joyas/joya/${m.id}`,
            };
        }).slice(0, 6);

        const total = joyas.length;
        const stockTotal = joyas.reduce((total, producto) => total + producto.stock, 0);

        const HATEOAS = {
            total,
            stockTotal,
            results,
        };

        return HATEOAS;
    } catch (error) {
        console.log("Error al obtener al realizar el HATEOAS.");
        res.status(500).json({ error: "Error al obtener al realizar el HATEOAS." });
    }
};

// Middleware para registrar información de las solicitudes recibidas
const reportMiddleware = (req, res, next) => {
    try {
        console.log(`---------------------`);
        console.log(`SOLICITUD DESDE LA WEB`);
        console.log('Url original:', req.hostname);
        console.log(`Solicitud recibida: ${req.method}`);
        console.log(`Ruta: ${req.path}`);
        console.log('req.params:', JSON.stringify(req.params, null, 2));
        console.log('req.query: ', JSON.stringify(req.query, null, 2));
        console.log(`---------------------`);
        next();
    } catch (error) {
        console.log("Error al obtener al realizar el reporte.");
        res.status(500).json({ error: "Error al obtener al realizar el reporte." });
    }
};

// Exportar las funciones para ser utilizadas por otros módulos
module.exports = { obtenerJoyas, obtenerJoyasPorFiltro, obtenerJoya, reportMiddleware };