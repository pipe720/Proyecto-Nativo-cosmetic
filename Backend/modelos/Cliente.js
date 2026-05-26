const { Schema, model } = require("mongoose");

const ClienteSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true,
        trim: true //Elimina espacios blancos al inicio o final
    },
    rut: {
        type: String,
        required: true
    }
});


module.exports = model("Cliente", ArticuloSchema, "clientes");