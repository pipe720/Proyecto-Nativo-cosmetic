const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true, // No permite correos duplicados en MongoDB
    lowercase: true, // Guarda siempre en minúsculas
    trim: true
  },
  contrasena: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  rol: {
    type: String,
    required: true,
    enum: ['usuario', 'admin'], // AQUÍ: Solo permite estos dos valores estrictamente
    default: 'usuario'          // Por defecto, todo registro nuevo será usuario común
  },
  telefono: {
    type: String,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Exportamos el modelo para usarlo en las rutas
module.exports = mongoose.model('Cliente', clienteSchema);