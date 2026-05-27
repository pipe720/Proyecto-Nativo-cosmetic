const { Schema, model } = require("mongoose");

const PedidoSchema = Schema({
    idpedido: {
        type: String,
        required: true
    },
    fechapedido: {
        type: Date,
        default: Date.now
    },
    estadopedido: {
        type: String,
        required: true
    },
    nombrecliente: { // nombre del cliente,
                    // se referencia a tabla Cliente
        type: mongoose.Schema.Types.ObjectId, ref: 'Cliente',
        required: true
    }, //Para referenciar al cliente, se puede extraer todos los datos de ahi.

    correocliente: { // correo del cliente,
                    // se referencia a tabla Cliente
        type: mongoose.Schema.Types.ObjectId, ref: 'Cliente',
        required: true
    }, //Para referenciar al cliente, se puede extraer todos los datos de ahi.

    idproducto:  {  //Id del producto, para sacar costo 
                    // se referencia a tabla Producto
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto',
        required: true
    },

    precioproducto: { // precio del producto,
                    // se referencia a tabla Producto
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto',
        required: true
    }, //Para referenciar al producto, se puede extraer todos los datos de ahi.

    cantidadproducto: { // cantidad de productos ,
                    // se referencia a tabla Producto
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto',
        required: true
    },
    costopedido: { // variable donde se almacenara
                //  el costo total de los pedidos
        type: Number,
        required: true
    },
    
    descripcion: {
        type: String,
        required: true
    },

    direccion: {
        type: String,
        required:true
    },

    telefono: {
        type: String,
        required:true
    }
});

module.exports = model("Pedido", ArticuloSchema, "pedidos");