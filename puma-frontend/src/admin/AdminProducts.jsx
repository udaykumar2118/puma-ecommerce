import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminProducts() {

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const emptyForm = {
    name:"", price:"", brand:"", stock:"",
    description:"", imageUrl:""
  };

  const [products,setProducts] = useState([]);
  const [filtered,setFiltered] = useState([]);

  const [form,setForm] = useState(emptyForm);
  const [editing,setEditing] = useState(null);
  const [openModal,setOpenModal] = useState(false);

  const [stockQty,setStockQty] = useState("");
  const [minStock,setMinStock] = useState("");
  const [selectedProduct,setSelectedProduct] = useState(null);
  const [stockModal,setStockModal] = useState(false);
  const [minModal,setMinModal] = useState(false);

  useEffect(()=>{ loadProducts(); },[]);

  const loadProducts = async ()=>{
    const res = await api.get("/api/products");
    setProducts(res.data);
    setFiltered(res.data);
  };

  // 🔍 SEARCH
  const handleSearch = e=>{
    const val = e.target.value.toLowerCase();
    setFiltered(products.filter(p=>p.name.toLowerCase().includes(val)));
  };

  // CRUD
  const openAddModal = ()=>{
    setForm(emptyForm);
    setEditing(null);
    setOpenModal(true);
  };

  const openEditModal = p=>{
    setForm(p);
    setEditing(p.id);
    setOpenModal(true);
  };

  const handleChange = e =>
    setForm({...form,[e.target.name]:e.target.value});

  const saveProduct = async ()=>{
    if(editing)
      await api.put(`/api/admin/products/${editing}`,form,authHeader);
    else
      await api.post("/api/admin/products",form,authHeader);

    setOpenModal(false);
    loadProducts();
  };

  const deleteProduct = async id=>{
    if(!confirm("Delete product?")) return;
    await api.delete(`/api/admin/products/${id}`,authHeader);
    loadProducts();
  };

  // STOCK
  const openStockModal = p=>{
    setSelectedProduct(p);
    setStockQty("");
    setStockModal(true);
  };

  const addStockQuick = async ()=>{
    await api.post(
      `/api/admin/inventory/add-stock?productId=${selectedProduct.id}&quantity=${stockQty}&note=Manual`,
      {},authHeader
    );
    setStockModal(false);
    loadProducts();
  };

  const openMinModal = p=>{
    setSelectedProduct(p);
    setMinStock(p.minStockLevel || "");
    setMinModal(true);
  };

  const saveMinStock = async ()=>{
    await api.put(
      `/api/admin/inventory/min-level?productId=${selectedProduct.id}&minLevel=${minStock}`,
      {},authHeader
    );
    setMinModal(false);
    loadProducts();
  };

  const lowStockCount = products.filter(p=>p.stock<10).length;
  const inventoryValue = products.reduce((a,p)=>a+p.price*p.stock,0);

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Inventory Manager</h1>
        <button onClick={openAddModal}
          className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-500">
          + Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <Stat title="Total Products" value={products.length}/>
        <Stat title="Low Stock" value={lowStockCount} red/>
        <Stat title="Inventory Value" value={`₹${inventoryValue}`} green/>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search product..."
        onChange={handleSearch}
        className="bg-white/10 px-6 py-3 rounded-xl w-80 mb-6 outline-none"
      />

      {/* TABLE */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-gray-300 text-sm uppercase">
            <tr>
              <th className="p-5">Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">

                <td className="p-5 flex items-center gap-4">
                  <img src={p.imageUrl}
                       className="w-14 h-14 object-contain bg-white/10 p-2 rounded-lg"/>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </div>
                </td>

                <td className="text-green-400 font-bold">₹{p.price}</td>

                <td>
                  <StockBadge stock={p.stock}/>
                </td>

                <td className="space-x-2">
                  <Btn green onClick={()=>openStockModal(p)}>+Stock</Btn>
                  <Btn yellow onClick={()=>openMinModal(p)}>Min</Btn>
                  <Btn blue onClick={()=>openEditModal(p)}>Edit</Btn>
                  <Btn red onClick={()=>deleteProduct(p.id)}>Delete</Btn>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {openModal && <ProductModal {...{form,handleChange,saveProduct,setOpenModal,editing}}/>}
      {stockModal && <StockModal {...{selectedProduct,stockQty,setStockQty,addStockQuick}}/>}
      {minModal && <MinStockModal {...{selectedProduct,minStock,setMinStock,saveMinStock}}/>}

    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Stat = ({title,value,red,green}) => (
  <div className={`p-6 rounded-2xl border ${
    red?"bg-red-500/10 border-red-500/30":
    green?"bg-green-500/10 border-green-500/30":
    "bg-white/10 border-white/20"
  }`}>
    <p className="text-gray-400 text-sm">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);

const StockBadge = ({stock}) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
    stock<10?"bg-red-500/20 text-red-400":
    stock<20?"bg-yellow-500/20 text-yellow-400":
    "bg-green-500/20 text-green-400"
  }`}>
    {stock} in stock
  </span>
);

const Btn = ({children,green,yellow,blue,red,...props}) => (
  <button {...props}
    className={`px-3 py-1 rounded-lg text-sm ${
      green?"bg-green-600 hover:bg-green-500":
      yellow?"bg-yellow-500 hover:bg-yellow-400":
      blue?"bg-blue-500 hover:bg-blue-400":
      red?"bg-red-600 hover:bg-red-500":""
    }`}>
    {children}
  </button>
);

/* ---------- MODALS ---------- */

const ProductModal = ({form,handleChange,saveProduct,setOpenModal,editing}) => (
  <Modal title={editing?"Edit Product":"Add Product"}>
    {["name","price","brand","stock","imageUrl"].map(f=>(
      <input key={f} name={f} value={form[f]} onChange={handleChange}
        placeholder={f} className="input"/>
    ))}
    <textarea name="description" value={form.description}
      onChange={handleChange} placeholder="Description" className="input"/>
    <button onClick={saveProduct} className="bg-green-600 py-2 rounded">Save</button>
  </Modal>
);

const StockModal = ({selectedProduct,stockQty,setStockQty,addStockQuick}) => (
  <Modal title={`Add Stock — ${selectedProduct.name}`}>
    <input placeholder="Quantity" value={stockQty}
      onChange={e=>setStockQty(e.target.value)} className="input"/>
    <button onClick={addStockQuick} className="bg-green-600 py-2 rounded">Add Stock</button>
  </Modal>
);

const MinStockModal = ({selectedProduct,minStock,setMinStock,saveMinStock}) => (
  <Modal title={`Minimum Stock — ${selectedProduct.name}`}>
    <input placeholder="Minimum level" value={minStock}
      onChange={e=>setMinStock(e.target.value)} className="input"/>
    <button onClick={saveMinStock} className="bg-yellow-500 py-2 rounded">Save</button>
  </Modal>
);

const Modal = ({title,children}) => (
  <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
    <div className="bg-gray-900 p-8 rounded-2xl w-[420px] space-y-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  </div>
);