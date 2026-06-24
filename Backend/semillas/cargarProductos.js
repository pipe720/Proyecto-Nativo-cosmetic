const mongoose = require("mongoose");
const { conexion } = require("../basedatos/conexion");
const Producto = require("../modelos/Producto");
const productosIniciales = require("../datos/productosIniciales");

async function cargarProductos() {
    try {
        await conexion();

        const operaciones = productosIniciales.map((producto) => ({
            updateOne: {
                filter: { idproducto: producto.idproducto },
                update: { $set: producto },
                upsert: true
            }
        }));

        const resultado = await Producto.bulkWrite(operaciones);

        console.log("Catalogo inicial cargado correctamente.");
        console.log(`Insertados: ${resultado.upsertedCount || 0}`);
        console.log(`Actualizados: ${resultado.modifiedCount || 0}`);
    } catch (error) {
        console.error("No se pudo cargar el catalogo inicial:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
}

cargarProductos();
