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
    pedido: {   // para sacar costo del pedido
                // //para referenciar al pedido, se puede extraer todos los datos de ahi
        type: mongoose.Schema.Types.ObjectId, ref: 'Pedido',
        required: null
    },

    servicio: {
                //Para sacar costo del servicio en la reserva, 
                // //para referenciar al producto, se pued extraer todos los datos de ahi
        type: mongoose.Schema.Types.ObjectId, ref: 'Servicio',
        required: null
    },
});

module.exports = model("Pago", ArticuloSchema, "pagos");