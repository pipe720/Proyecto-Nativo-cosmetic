const { Schema, model } = require("mongoose");

const CarritoCompraSchema = Schema({
    pedido: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido',
        required: true
    }
});

module.exports = model("CarritoCompra", CarritoCompraSchema, "carritocompras");