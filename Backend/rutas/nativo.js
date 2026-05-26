const express = require("express");
const multer = require("multer");

// Aqui se van a cargar las rutas para todas las api del backend ej

//const ProductoControlador = require("../controladores/productos"); 

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});

//rutas para pacientes
//router.post("/crearProducto", ProductoControlador.crear_producto);