import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminProducts() {

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

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

  // ================= PRODUCT CRUD =================

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
      await api.put(`/api/admin/products/${editing}`, form, authHeader);
    else
      await api.post("/api/admin/products", form, authHeader);

    setOpenModal(false);
    loadProducts();
  };

  const deleteProduct = async id => {
    if (!confirm("Delete product?")) return;
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

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Inventory Manager</h1>
        <button onClick={openAddModal}
          className="bg-green-600 px-6 py-3 rounded-xl">+ Add Product</button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full">
        <thead>
          <tr>
            <th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td><img src={p.imageUrl} className="w-16"/></td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>

              <td className="space-x-2">
                <button onClick={()=>openStockModal(p)}>+Stock</button>
                <button onClick={()=>openMinModal(p)}>Min</button>
                <button onClick={()=>openEditModal(p)}>Edit</button>
                <button onClick={()=>deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD/EDIT PRODUCT MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[500px] space-y-3">

            <h2 className="text-2xl font-bold">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input"/>
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="input"/>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="input"/>
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="input"/>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input"/>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="input"/>

            <div className="flex gap-4">
              <button onClick={()=>setOpenModal(false)}>Cancel</button>
              <button onClick={saveProduct} className="bg-green-600 px-6 py-2">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}