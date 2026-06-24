const { Schema, model } = require("mongoose");

const ServicioSchema = Schema({
    idservicio: {
        type: String,
        required: true
    },
    nombreservicio: {
        type: String,
        required: true
    },
    duracionservicio: {
        type: Number,
        required: true
    },
    precioservicio: {  
        type: Number,
        required: true
    }
});

module.exports = model("Servicio", ServicioSchema, "servicios");