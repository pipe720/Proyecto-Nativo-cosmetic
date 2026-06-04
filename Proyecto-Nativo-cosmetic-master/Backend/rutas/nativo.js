const express = require("express");
const multer = require("multer");
const path = require("path");

const Producto = require("../modelos/Producto");
const Cliente = require("../modelos/Cliente");
const Servicio = require("../modelos/Servicio");
const Reserva = require("../modelos/ReservaHora");

const router = express.Router();

const storagePath = path.join(__dirname, '..', 'imagenes', 'articulos');
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, storagePath);
    },
    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now() + path.extname(file.originalname));
    }
});

const subidas = multer({storage: almacenamiento});

// ─── PRODUCTOS ───────────────────────────────────────────────────────────────

// GET - Listar todos los productos
router.get("/productos", async (req, res) => {
    try {
        const productos = await Producto.find();
        return res.status(200).json(productos);
    } catch (error) {
        return res.status(500).json({ error: "Error interno al obtener productos" });
    }
});

// GET - Obtener un producto por ID
router.get("/productos/:id", async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
        return res.status(200).json(producto);
    } catch (error) {
        return res.status(500).json({ error: "Error interno al obtener el producto" });
    }
});

// POST - Crear producto (con imagen opcional)
router.post("/reservas", async (req, res) => {
    try {
        console.log("Datos que llegaron del Frontend:", req.body);
        
        // Creamos una nueva reserva usando el modelo de tus compañeros
        const nuevaReserva = new Reserva(req.body);
        
        // ¡La guardamos en MongoDB!
        await nuevaReserva.save();
        
        console.log("¡Reserva guardada con éxito en MongoDB!");
        res.status(200).send({ status: "success", message: "Reserva guardada" });
    } catch (error) {
        console.error("Error al guardar en MongoDB:", error);
        res.status(500).send({ status: "error", message: "Error al guardar la reserva" });
    }
});

// PATCH - Actualizar stock de un producto
router.patch("/productos/:id/stock", async (req, res) => {
    try {
        const { stock } = req.body;
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
        producto.stock = stock;
        await producto.save();
        return res.status(200).json(producto);
    } catch (error) {
        return res.status(400).json({ error: "No se pudo actualizar el stock" });
    }
});

// ─── CLIENTES ────────────────────────────────────────────────────────────────

// GET - Listar todos los clientes
router.get("/clientes", async (req, res) => {
    try {
        const clientes = await Cliente.find();
        return res.status(200).json(clientes);
    } catch (error) {
        return res.status(500).json({ error: "Error interno al obtener clientes" });
    }
});

// POST - Crear cliente
router.post("/clientes", async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        return res.status(201).json(cliente);
    } catch (error) {
        return res.status(400).json({ error: "Datos de cliente inválidos", detalle: error.message });
    }
});

// ─── SERVICIOS ───────────────────────────────────────────────────────────────

// GET - Listar todos los servicios
router.get("/servicios", async (req, res) => {
    try {
        const servicios = await Servicio.find();
        return res.status(200).json(servicios);
    } catch (error) {
        return res.status(500).json({ error: "Error interno al obtener servicios" });
    }
});


// ─── RESERVAS ────────────────────────────────────────────────────────────────

// POST - Crear reserva
router.post('/crear-reserva', async (req, res) => {
    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.status(201).json({ mensaje: "Reserva creada con éxito", reserva: nuevaReserva });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la reserva", error });
    }
});

// GET - Listar todas las reservas
router.get("/reservas", async (req, res) => {
    try {
        // Usamos la versión con .populate si tienes esas relaciones definidas en tu modelo, 
        // o simplemente ReservaHora.find() si prefieres una lista básica.
        const reservas = await Reserva.find();
        return res.status(200).send({ status: "success", total: reservas.length, reservas });
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        return res.status(500).send({ status: "error", message: error.message });
    }
});
// DELETE - Eliminar reserva por ID
router.delete("/reservas/:id", async (req, res) => {
    try {

        const reservaEliminada = await Reserva.findByIdAndDelete(req.params.id);

        if (!reservaEliminada) {
            return res.status(404).json({
                status: "error",
                message: "Reserva no encontrada"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Reserva eliminada correctamente"
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message
        });

    }
});
module.exports = router;