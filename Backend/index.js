const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("App de node arrancada");

// Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); // form-urlencoded

// RUTAS
const rutas_nativo = require("./rutas/nativo"); 

// Cargo las rutas
app.use("/api", rutas_nativo);

app.get("/", (req, res) => {


    return res.status(200).send(
        "<h1>Empezando a crear un api rest con node</h1>"
    );

});


// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});
