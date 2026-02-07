import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Checkout() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [cart, setCart] = useState(null);
  const [paymentMode, setPaymentMode] = useState("ONLINE");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName:"", lastName:"", pin:"",
    city:"", address:"", state:"",
    email:"", phone:""
  });

  // ================= LOAD CART =================
  useEffect(() => {
    if(!token) navigate("/login");
    loadCart();
  }, []);

  const loadCart = async () => {
    try{
      const res = await api.get("/api/cart/my", authHeader);
      setCart(res.data);

      if(res.data.items.length === 0){
        alert("Cart empty");
        navigate("/");
      }
    }catch{
      alert("Cart load failed");
      navigate("/");
    }
  };

  const handleChange = e =>
    setForm({...form,[e.target.name]:e.target.value});

  // ================= PAYMENT FLOW =================
  const handlePayment = async () => {

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  setLoading(true);

  try {

    // 🧾 PLACE ORDER (JWT)
    const orderRes = await api.post(
      "/api/orders/place",
      form,
      authHeader
    );

    const order = orderRes.data;

    // ================= COD =================
    if (paymentMode === "COD") {

      await api.post(
        `/api/payments/cod?orderId=${order.id}`,
        {},                 // body empty
        authHeader          // ⭐ JWT HEADER
      );

      alert("Order placed successfully 🎉");
      navigate("/orders");
      return;
    }

    // ================= RAZORPAY ORDER =================
    const razorRes = await api.post(
      `/api/payments/create-razorpay-order?orderId=${order.id}`,
      {},                 // body empty
      authHeader          // ⭐ JWT HEADER (VERY IMPORTANT)
    );

    const razor = razorRes.data;

    const options = {
      key: "rzp_test_RQ3wpgsuiVglvR",
      amount: razor.amount,
      currency: razor.currency,
      order_id: razor.razorpayOrderId,
      name: "PUMA Store",
      description: "Order Payment",

      prefill: {
        name: form.firstName + " " + form.lastName,
        email: form.email,
        contact: form.phone,
      },

      handler: async (res) => {

        await api.post(
          "/api/payments/verify",
          {
            orderId: razor.orderId,
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
          },
          authHeader   // ⭐ JWT HEADER AGAIN
        );

        alert("Payment successful 🎉");
        navigate("/orders");
      }
    };

    new window.Razorpay(options).open();

  } catch (err) {
    console.error(err);
    alert("Payment failed ❌");
  }

  setLoading(false);
};

  if (!cart)
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="bg-[#f6f6f6] min-h-screen">

      <div className="bg-white py-8 px-16 shadow-sm">
        <h1 className="text-4xl font-bold">CHECKOUT</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-12">

        {/* SHIPPING */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-8">Shipping Address</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input name="firstName" label="First Name" onChange={handleChange}/>
              <Input name="lastName" label="Last Name" onChange={handleChange}/>
              <Input name="pin" label="PIN Code" onChange={handleChange}/>
              <Input name="city" label="City" onChange={handleChange}/>
              <div className="md:col-span-2">
                <Input name="address" label="Address Line" onChange={handleChange}/>
              </div>
              <Input name="state" label="State" onChange={handleChange}/>
              <Input name="email" label="Email" onChange={handleChange}/>
              <Input name="phone" label="Phone Number" onChange={handleChange}/>
            </div>
          </div>

          <div className="bg-white p-10 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            <PaymentOption title="Cash on Delivery"
              selected={paymentMode==="COD"}
              onClick={()=>setPaymentMode("COD")}
            />

            <PaymentOption title="Credit / Debit / UPI (Razorpay)"
              selected={paymentMode==="ONLINE"}
              onClick={()=>setPaymentMode("ONLINE")}
            />

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-10 w-full bg-black text-white py-4 text-lg font-semibold hover:bg-gray-800"
            >
              {loading ? "Processing..." : "CONTINUE TO PAYMENT"}
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-8 rounded-xl shadow-sm h-fit sticky top-28">
          <h2 className="text-2xl font-bold mb-6">Order Details</h2>

          {cart.items.map(item => (
            <div key={item.id} className="flex gap-4 mb-5">
              <img src={item.product.imageUrl} className="w-16 h-16 object-contain bg-gray-100 p-2"/>
              <div className="flex-1">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">₹{item.product.price * item.quantity}</p>
            </div>
          ))}

          <hr className="my-6"/>
          <div className="flex justify-between text-xl font-bold">
            <span>Grand Total</span>
            <span>₹{cart.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Floating inputs
const Input = ({label,name,onChange}) => (
  <div className="relative">
    <input name={name} onChange={onChange}
      className="peer w-full border-b-2 border-gray-300 focus:border-black outline-none py-3 bg-transparent"
      placeholder=" "
    />
    <label className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm">
      {label}
    </label>
  </div>
);

const PaymentOption = ({title, selected, onClick}) => (
  <div onClick={onClick}
    className={`border p-5 rounded-lg mb-4 cursor-pointer transition ${
      selected ? "border-black bg-gray-50" : "border-gray-300"
    }`}>
    <div className="flex justify-between">
      <span className="font-semibold">{title}</span>
      {selected && <span>✔</span>}
    </div>
  </div>
);
