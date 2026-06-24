import { useState, useEffect } from "react";

function Stock() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [stockEdicion, setStockEdicion] = useState({});
  const [actualizando, setActualizando] = useState({});
  const [editando, setEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({});

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3900/api/productos");
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProductos(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleStockChange = (productoId, nuevoStock) => {
    setStockEdicion({ ...stockEdicion, [productoId]: nuevoStock });
  };

  const actualizarStock = async (productoId) => {
    const nuevoStock = stockEdicion[productoId];
    if (!nuevoStock) {
      setError("Ingresa una cantidad válida");
      return;
    }
    try {
      setActualizando({ ...actualizando, [productoId]: true });
      const response = await fetch(
        `http://localhost:3900/api/productos/${productoId}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: parseInt(nuevoStock) }),
        }
      );
      if (!response.ok) throw new Error("Error al actualizar stock");
      await cargarProductos();
      setStockEdicion({ ...stockEdicion, [productoId]: "" });
      setError("");
    } catch (err) {
      setError(`Error al actualizar: ${err.message}`);
    } finally {
      setActualizando({ ...actualizando, [productoId]: false });
    }
  };

  const eliminarProducto = async (productoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const response = await fetch(
        `http://localhost:3900/api/productos/${productoId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Error al eliminar producto");
      await cargarProductos();
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  const iniciarEdicion = (producto) => {
    setEditando(producto._id);
    setFormEdicion(producto);
  };

  const handleEdicionChange = (e) => {
    const { name, value } = e.target;
    setFormEdicion({ ...formEdicion, [name]: value });
  };

  const guardarEdicion = async () => {
    try {
      const response = await fetch(
        `http://localhost:3900/api/productos/${editando}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formEdicion),
        }
      );
      if (!response.ok) throw new Error("Error al modificar producto");
      await cargarProductos();
      setEditando(null);
      setFormEdicion({});
    } catch (err) {
      setError(`Error al modificar: ${err.message}`);
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return "bg-red-500";
    if (stock <= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Gestión de productos y stock
      </h2>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {cargando ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Código</th>
              <th className="px-4 py-2 border">Producto</th>
              <th className="px-4 py-2 border">descripción</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Categoria</th>
              <th className="px-4 py-2 border">fecha de vencimiento</th>
              <th className="px-4 py-2 border">Stock actual</th>
              <th className="px-4 py-2 border">Nuevo stock</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{producto.idproducto}</td>
                <td className="px-4 py-2 border text-center">{producto.nombreproducto}</td>
                <td className="px-4 py-2 border text-center">{producto.descripcionproducto}</td>
                <td className="px-4 py-2 border text-center">{producto.precioproducto}</td>
                <td className="px-4 py-2 border text-center">{producto.categoriaproducto}</td>
                <td className="px-4 py-2 border text-center">
                {(() => {
                    const fecha = new Date(producto.fechavencimiento);
                    const dia = String(fecha.getDate()+1).padStart(2, "0");
                    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); //
                    const anio = fecha.getFullYear();
                      return `${dia}/${mes}/${anio}`;
                })()}
                </td>
                <td
                  className={`px-4 py-2 border text-white ${getStockColor(
                    producto.stock
                  )}`}
                >
                  {producto.stock}
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={stockEdicion[producto._id] || ""}
                    onChange={(e) =>
                      handleStockChange(producto._id, e.target.value)
                    }
                    className="border rounded px-2 py-1 w-20"
                  />
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => actualizarStock(producto._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => iniciarEdicion(producto)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de edición */}
      {editando && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Editar producto
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="idproducto"
                value={formEdicion.idproducto || ""}
                onChange={handleEdicionChange}
                placeholder="id del producto"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="nombreproducto"
                value={formEdicion.nombreproducto || ""}
                onChange={handleEdicionChange}
                placeholder="Nombre del producto"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="descripcionproducto"
                value={formEdicion.descripcionproducto || ""}
                onChange={handleEdicionChange}
                placeholder="Nombre del producto"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                name="precioproducto"
                value={formEdicion.precioproducto || ""}
                onChange={handleEdicionChange}
                placeholder="Precio"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="categoriaproducto"
                value={formEdicion.categoriaproducto|| ""}
                onChange={handleEdicionChange}
                placeholder="Categoria"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="Date"
                name="fechavencimiento"
                value={formEdicion.fechavencimiento|| ""}
                onChange={handleEdicionChange}
                placeholder="dd/mm/aaaa"
                min={new Date().toISOString().split("T")[0]} 
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                name="stock"
                value={formEdicion.stock || ""}
                onChange={handleEdicionChange}
                placeholder="Stock"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={guardarEdicion}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditando(null);
                  setFormEdicion({});
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;
