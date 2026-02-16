import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminProducts() {

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ================= STATES =================
  const emptyForm = {
    name: "",
    price: "",
    brand: "",
    stock: "",
    description: "",
    imageUrl: "",
    categoryId: ""
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [stockQty, setStockQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockModal, setStockModal] = useState(false);
  const [minModal, setMinModal] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const loadCategories = async () => {
    const res = await api.get("/api/categories");
    setCategories(res.data);
  };

  // ================= PRODUCT CRUD =================
  const openAddModal = () => {
    setForm(emptyForm);
    setEditing(null);
    setOpenModal(true);
  };

  const openEditModal = (p) => {
    setForm({
      ...p,
      categoryId: p.category?.id || ""
    });
    setEditing(p.id);
    setOpenModal(true);
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProduct = async () => {
    if (editing)
      await api.put(`/api/admin/products/${editing}`, form, authHeader);
    else
      await api.post("/api/admin/products", form, authHeader);

    setOpenModal(false);
    loadProducts();
  };

  const deleteProduct = async id => {
    if (!window.confirm("Delete product?")) return;
    await api.delete(`/api/admin/products/${id}`, authHeader);
    loadProducts();
  };

  // ================= ADD STOCK =================
  const openStockModal = (p) => {
    setSelectedProduct(p);
    setStockQty("");
    setStockModal(true);
  };

  const addStockQuick = async () => {
    await api.post(
      `/api/admin/inventory/add-stock?productId=${selectedProduct.id}&quantity=${stockQty}&note=Manual`,
      {},
      authHeader
    );
    setStockModal(false);
    loadProducts();
  };

  // ================= MIN STOCK =================
  const openMinModal = (p) => {
    setSelectedProduct(p);
    setMinStock(p.minStockLevel || "");
    setMinModal(true);
  };

  const saveMinStock = async () => {
    await api.put(
      `/api/admin/inventory/min-level?productId=${selectedProduct.id}&minLevel=${minStock}`,
      {},
      authHeader
    );
    setMinModal(false);
    loadProducts();
  };

  // ================= UI =================
  return (
    <div>

      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold">Inventory Manager</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl">
          + Add Product
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-gray-300">
            <tr>
              <th className="p-4">Image</th>
              <th>Name</th>
              <th>Category</th>
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
                <td>{p.category?.name || "—"}</td>
                <td className="text-green-400">₹{p.price}</td>

                <td>
                  <span className="font-bold">{p.stock}</span>
                </td>

                <td className="space-x-2">
                  <button onClick={()=>openStockModal(p)} className="bg-green-600 px-3 py-1 rounded text-sm">+Stock</button>
                  <button onClick={()=>openMinModal(p)} className="bg-yellow-500 px-3 py-1 rounded text-sm">Min</button>
                  <button onClick={()=>openEditModal(p)} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={()=>deleteProduct(p.id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[500px] space-y-4">

            <h2 className="text-2xl font-bold">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input"/>
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="input"/>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="input"/>
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="input"/>

            {/* ⭐ CATEGORY DROPDOWN */}
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input">
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input"/>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="input"/>

            <div className="flex gap-4">
              <button onClick={()=>setOpenModal(false)}>Cancel</button>
              <button onClick={saveProduct} className="bg-green-600 px-6 py-2 rounded">Save</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}