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
    pagopedido: { //pagopedido = valor a pagar == costopedido, 
                // se referencia a tabla Pedido 
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        required: null
    },

    pagoreserva: {// pagoreserva = Valor a pagar == precioservicio
                //Para sacar costo del servicio en la reserva, 
                // se referencia a tabla Servicio 
        type: mongoose.Schema.Types.ObjectId, ref: 'Servicio',
        required: null
    },
});

module.exports = model("Pago", ArticuloSchema, "pagos");