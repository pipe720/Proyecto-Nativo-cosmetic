const { Schema, model } = require("mongoose");

const PagoSchema = Schema({
    idpago: {
        type: String,
        required: true
    },
    fechapago: {
        type: Date,
        default: Date.now
    },
    metodopago: {
        type: String,
        required: true
    },
    totalpago: { //totalpago = valor a pagar == costopedido, 
                // se referencia a tabla Pedido 
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        required: true
    }
});

module.exports = model("Pago", ArticuloSchema, "pagos");