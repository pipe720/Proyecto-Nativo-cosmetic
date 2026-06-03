const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
    idproducto: {
        type: String,
        required: true
    },
    nombreproducto: {
        type: String,
        required: true
    },
    precioproducto: {
        type: Number,
        required: true
        
    },
    descripcionproducto: { 
        type: String,
        required: true
    },
    categoriaproducto: { 
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },  
    fechavencimiento: {
        type: Date,
        default: Date.now
    },
    imagenUrl: {
        type: String,
        default: null
    }
});

module.exports = model("Producto", ProductoSchema, "productos");