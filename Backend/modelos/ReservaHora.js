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
    nombrecliente: { // para obtener el nombre del cliente
                     // se referencia a tabla cliente
        type: mongoose.Schema.Types.ObjectId, ref: "Cliente",
        required: true
    },
    correocliente: { //para obtener correo del cliente
                    // se referencia a tabla Cliente
        type: mongoose.Schema.Types.ObjectId, ref: "Cliente",
        required: true
    },
    idservicio: { //para obtener id del servicio, 
                // se referencia a tabla Servicio
        type: mongoose.Schema.Types.ObjectId, ref: 'Servicio',
        required: true
    },
    precioservicio: {
        type: mongoose.Schema.Types.ObjectId, ref: "Servicio",
        required: true
    },
});


module.exports = model("ReservaHora", ArticuloSchema, "reservahoras");