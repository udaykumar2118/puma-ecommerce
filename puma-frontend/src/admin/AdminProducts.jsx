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

  // ⭐ ADD / UPDATE PRODUCT (FIXED)
  const saveProduct = async () => {
    const payload = {
      name: form.name,
      brand: form.brand,
      description: form.description,
      imageUrl: form.imageUrl,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      if (editing) {
        await api.put(`/api/admin/products/${editing}`, payload);
        alert("Product updated ✅");
      } else {
        await api.post("/api/admin/products", payload);
        alert("Product added ✅");
      }

      setOpenModal(false);
      setEditing(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error saving product ❌");
    }
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

      {/* TABLE */}
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

                <td>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{p.stock}</span>
                    {p.minStockLevel && p.stock < p.minStockLevel &&
                      <span className="text-xs text-red-400">Low stock ⚠</span>}
                  </div>
                </td>

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

      {/* ADD / EDIT PRODUCT MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-[500px] space-y-4">
            <h2 className="text-2xl font-bold">{editing ? "Edit Product" : "Add Product"}</h2>

            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input"/>
            <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="input"/>
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="input"/>
            <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="input"/>
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input h-24"/>
            <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="input"/>

            {form.imageUrl && <img src={form.imageUrl} className="h-32 object-contain mx-auto"/>}

            <div className="flex justify-end gap-4 pt-4">
              <button onClick={()=>setOpenModal(false)} className="px-5 py-2 bg-gray-700 rounded">Cancel</button>
              <button onClick={saveProduct} className="px-5 py-2 bg-green-600 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STOCK MODAL */}
      {stockModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Add Stock — {selectedProduct.name}</h2>
            <input value={stockQty} onChange={e=>setStockQty(e.target.value)} className="input mb-4"/>
            <button onClick={addStockQuick} className="bg-green-600 px-6 py-2 rounded w-full">Add Stock</button>
          </div>
        </div>
      )}

      {/* MIN STOCK MODAL */}
      {minModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Minimum Stock — {selectedProduct.name}</h2>
            <input value={minStock} onChange={e=>setMinStock(e.target.value)} className="input mb-4"/>
            <button onClick={saveMinStock} className="bg-yellow-500 px-6 py-2 rounded w-full">Save Level</button>
          </div>
        </div>
      )}

    </div>
  );
}