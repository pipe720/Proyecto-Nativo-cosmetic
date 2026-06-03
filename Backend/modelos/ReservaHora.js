const { Schema, model, mongoose } = require("mongoose");

const ReservaHoraSchema = Schema({
    idreserva: {
        type: String,
        required: true
    },
    fechareserva: {
        type: Date,
        required: true
    },
    cliente: { 
        // Usamos Schema.Types.ObjectId porque ya importamos Schema arriba
        type: Schema.Types.ObjectId, 
        ref: "Cliente",
        required: true
    },
    servicio: { 
        type: String, 
        ref: 'Servicio',
        required: true
    }
});

// El tercer parámetro es el nombre de la colección en la base de datos
module.exports = model("ReservaHora", ReservaHoraSchema, "reservahoras");