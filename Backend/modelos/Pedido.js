const { Schema, model } = require("mongoose");

const PedidoSchema = Schema({
    idpedido: {
        type: String,
        required: true
    },
    fechapedido: {
        type: Date,
        default: Date.now
    },
    estadopedido: {
        type: String,
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    costopedido: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
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

module.exports = model("Pedido", PedidoSchema, "pedidos");