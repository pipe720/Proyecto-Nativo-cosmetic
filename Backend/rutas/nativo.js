const express = require("express");
const multer = require("multer");

// Aqui se van a cargar las rutas para todas las api del backend ej

//const ProductoControlador = require("../controladores/productos"); 

const router = express.Router();
const ReservaHora = require("../modelos/ReservaHora");

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

router.post("/reservas", async (req, res) => {
    // 1. Ver qué recibimos EXACTAMENTE
    console.log("--- INICIO DE PETICIÓN ---");
    console.log("Datos recibidos:", JSON.stringify(req.body, null, 2));

    try {
        const reserva = new ReservaHora(req.body);
        
        // 2. Intentar validar antes de guardar
        const errorValidacion = reserva.validateSync();
        if (errorValidacion) {
            console.log("--- ERROR DE VALIDACIÓN ---");
            console.log(errorValidacion.errors);
            return res.status(400).send({ status: "error", message: "Faltan datos o formato incorrecto", errors: errorValidacion.errors });
        }

        const reservaGuardada = await reserva.save();
        console.log("--- ÉXITO ---");
        return res.status(200).send({ status: "success", reserva: reservaGuardada });
        
    } catch (error) {
        console.error("--- ERROR CRÍTICO ---", error);
        return res.status(500).send({ status: "error", message: error.message });
    }
});

const subidas = multer({storage: almacenamiento});

module.exports = router;

//rutas para pacientes
//router.post("/crearProducto", ProductoControlador.crear_producto);