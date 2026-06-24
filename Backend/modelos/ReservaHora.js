const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
    dia: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    profesional: {
        type: String,
        required: true
    },
    tipoCorte: {
        type: String,
        required: true
    },
    cliente: {
        type: String, // O puedes poner un ref: 'Usuario' si tienes el modelo de usuario
        required: true
    },
    estado: {
        type: String,
        default: 'pendiente'
    }
});

module.exports = mongoose.model('ReservaHora', ReservaSchema);