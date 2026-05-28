const { Schema, model } = require("mongoose");

const ReservaHoraSchema = Schema({
    idreserva: {
        type: String,
        required: true
    },
    fechareserva: {
        type: Date,
        required: true
    },
    cliente: { // para obtener el nombre y correo del cliente
                     // //para referenciar al cliente, se pued extraer todos los datos de ahi
        type: mongoose.Schema.Types.ObjectId, ref: "Cliente",
        required: true
    },
    servicio: { //para obtener id y precio del servicio, 
                // //para referenciar al servicio, se pued extraer todos los datos de ahi
        type: mongoose.Schema.Types.ObjectId, ref: 'Servicio',
        required: true
    }
});


module.exports = model("ReservaHora", ArticuloSchema, "reservahoras");