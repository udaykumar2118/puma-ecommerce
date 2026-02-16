import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminProducts() {

  const emptyForm = {
    name: "",
    price: "",
    brand: "",
    stock: "",
    description: "",
    imageUrl: ""
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // ⭐ INVENTORY STATES
  const [stockQty, setStockQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockModal, setStockModal] = useState(false);
  const [minModal, setMinModal] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditing(null);
    setOpenModal(true);
  };

  const openEditModal = (p) => {
    setForm(p);
    setEditing(p.id);
    setOpenModal(true);
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProduct = async () => {
    if (editing)
      await api.put(`/api/admin/products/${editing}`, form);
    else
      await api.post("/api/admin/products", form);

    setOpenModal(false);
    loadProducts();
  };

  const deleteProduct = async id => {
    if (!confirm("Delete product?")) return;
    await api.delete(`/api/admin/products/${id}`);
    loadProducts();
  };

  // ⭐ ADD STOCK
  const openStockModal = (p) => {
    setSelectedProduct(p);
    setStockQty("");
    setStockModal(true);
  };

  const addStockQuick = async () => {
    await api.post(
      `/api/admin/inventory/add-stock?productId=${selectedProduct.id}&quantity=${stockQty}&note=Manual stock update`
    );
    setStockModal(false);
    loadProducts();
  };

  // ⭐ MIN STOCK
  const openMinModal = (p) => {
    setSelectedProduct(p);
    setMinStock(p.minStockLevel || "");
    setMinModal(true);
  };

  const saveMinStock = async () => {
    await api.put(
      `/api/admin/inventory/min-level?productId=${selectedProduct.id}&minLevel=${minStock}`
    );
    setMinModal(false);
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Inventory Manager</h1>
        <button onClick={openAddModal}
          className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-700">
          + Add Product
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-gray-300">
            <tr>
              <th className="p-4">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4">
                  <img src={p.imageUrl} className="w-16 h-16 object-contain"/>
                </td>

                <td className="font-semibold">{p.name}</td>
                <td className="text-green-400">₹{p.price}</td>

                {/* STOCK COLUMN */}
                <td>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{p.stock}</span>
                    {p.minStockLevel && p.stock < p.minStockLevel &&
                      <span className="text-xs text-red-400">Low stock ⚠</span>}
                  </div>
                </td>

                {/* ACTION BUTTONS */}
                <td className="space-x-3">
                  <button onClick={()=>openStockModal(p)}
                    className="bg-green-600 px-3 py-1 rounded text-sm">+ Stock</button>

                  <button onClick={()=>openMinModal(p)}
                    className="bg-yellow-500 px-3 py-1 rounded text-sm">Min Level</button>

                  <button onClick={()=>openEditModal(p)} className="text-yellow-400">Edit</button>
                  <button onClick={()=>deleteProduct(p.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD STOCK MODAL */}
      {stockModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[400px]">
            <h2 className="text-2xl font-bold mb-4">
              Add Stock — {selectedProduct.name}
            </h2>

            <input placeholder="Quantity"
              value={stockQty}
              onChange={e=>setStockQty(e.target.value)}
              className="input mb-4"/>

            <button onClick={addStockQuick}
              className="bg-green-600 px-6 py-2 rounded w-full">
              Add Stock
            </button>
          </div>
        </div>
      )}

      {/* MIN STOCK MODAL */}
      {minModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[400px]">
            <h2 className="text-2xl font-bold mb-4">
              Minimum Stock — {selectedProduct.name}
            </h2>

            <input placeholder="Minimum stock level"
              value={minStock}
              onChange={e=>setMinStock(e.target.value)}
              className="input mb-4"/>

            <button onClick={saveMinStock}
              className="bg-yellow-500 px-6 py-2 rounded w-full">
              Save Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}