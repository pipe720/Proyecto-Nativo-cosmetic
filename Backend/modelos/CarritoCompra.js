const { Schema, model } = require("mongoose");

const CarritoCompraSchema = Schema({
    idpedido: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        required: true
    },
    cantidadproducto: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        default: Date.now
    },
    totalpago: { //totalpago = valor a pagar, variable a la que hace referencia == costopedido, 
                // se referencia a tabla Pedido 
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        required: true
    }
});





module.exports = model("CarritoCompra", ArticuloSchema, "carritocompras");