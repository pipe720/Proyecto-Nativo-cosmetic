const { Schema, model } = require("mongoose");

const PedidoSchema = Schema({
    idpedido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    estado: {
        type: String,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Cliente',
        required: true
    }, //Para referenciar al cliente, se puede extraer todos los datos de ahi.

    producto: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto',
        required: true
    }, //Para referenciar al producto, se puede extraer todos los datos de ahi.
    
    total: {
        type: Number,
        required: true
    },

    descripcion: {
        type: String,
    },

    direccion: {
        type: String,
        required:true
    },

    telefono: {
        type: String,
        required:true
    }
});

module.exports = model("Pedido", ArticuloSchema, "pedidos");