const { Schema, model } = require("mongoose");

const CarritoCompraSchema = Schema({
    pedido: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        required: true
    }, 
});





module.exports = model("CarritoCompra", ArticuloSchema, "carritocompras");