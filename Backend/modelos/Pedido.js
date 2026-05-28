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
    cliente: {
                // se referencia a tabla Cliente
        type: mongoose.Schema.Types.ObjectId, ref: 'Cliente',
        required: true
    }, //Para referenciar al cliente, se puede extraer todos los datos de ahi.


    producto:  {  //para referenciar al producto, se pued extraer todos los datos de ahi
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