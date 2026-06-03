const express = require("express");
const multer = require("multer");
const path = require("path");

const Producto = require("../modelos/Producto");
const Cliente = require("../modelos/Cliente");
const Servicio = require("../modelos/Servicio");
const ReservaHora = require("../modelos/ReservaHora");

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
router.post("/productos", subidas.single("imagen"), async (req, res) => {
    try {
        const productoData = {
            idproducto: req.body.idproducto,
            nombreproducto: req.body.nombreproducto,
            precioproducto: parseFloat(req.body.precioproducto),
            descripcionproducto: req.body.descripcionproducto,
            categoriaproducto: req.body.categoriaproducto,
            stock: parseInt(req.body.stock),
            fechavencimiento: req.body.fechavencimiento || Date.now(),
            imagenUrl: req.file ? `/imagenes/articulos/${req.file.filename}` : null
        };

        const producto = new Producto(productoData);
        await producto.save();
        return res.status(201).json(producto);
    } catch (error) {
        return res.status(400).json({ error: "Datos de producto inválidos", detalle: error.message });
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

// GET - Listar todas las reservas (con datos del cliente y servicio)
router.get("/reservas", async (req, res) => {
    try {
        const reservas = await ReservaHora.find()
            .populate("cliente", "nombre correo rut")
            .populate("servicio", "nombreservicio precioservicio duracionservicio");
        return res.status(200).send({ status: "success", total: reservas.length, reservas });
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para crear una nueva reserva (POST)
router.post('/crear-reserva', async (req, res) => {
    try {
        const { dia, hora, profesional, tipoCorte, cliente } = req.body;

        const nuevaReserva = new ReservaHora({
            dia,
            hora,
            profesional,
            tipoCorte,
            cliente
        });

        await nuevaReserva.save();
        res.status(201).json({ mensaje: "Reserva creada con éxito", reserva: nuevaReserva });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la reserva", error });
    }
});

// Ruta para consultar las reservas (GET)
router.get('/reservas', async (req, res) => {
    try {
        const reservas = await ReservaHora.find();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener reservas", error });
    }
});

module.exports = router;