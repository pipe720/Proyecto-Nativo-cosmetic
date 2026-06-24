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
    pedido: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido',
        required: false
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
        required: false
    }
});

module.exports = model("Pago", PagoSchema, "pagos");