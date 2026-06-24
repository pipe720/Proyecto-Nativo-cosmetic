const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Inicializar app
console.log("App de node arrancada");

// Configurar servidor
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Crear carpeta de imágenes si no existe
const imagenesPath = path.join(__dirname, "imagenes", "articulos");
if (!fs.existsSync(imagenesPath)) {
    fs.mkdirSync(imagenesPath, { recursive: true });
}

// Servir imágenes estáticamente
app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

// Convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// RUTAS
const rutas_nativo = require("./rutas/nativo"); 
app.use("/api", rutas_nativo);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Empezando a crear un api rest con node</h1>");
});

// Conectar a la base de datos y arrancar el servidor
const iniciarServidor = async () => {
    try {
        await conexion();
        app.listen(puerto, () => {
            console.log("Servidor corriendo en el puerto " + puerto);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor por error de conexión:", error);
    }
};

iniciarServidor();