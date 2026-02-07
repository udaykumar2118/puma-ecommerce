import { BrowserRouter, Routes, Route } from "react-router-dom";

// USER PAGES
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import SearchResults from "./pages/SearchResults";
import Sale from "./pages/Sale";

// ADMIN
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminLogin from "./admin/AdminLogin";
import AdminRevenue from "./admin/AdminRevenue";
import AdminGuard from "./admin/AdminGuard";
import AdminLayout from "./admin/AdminLayout";

// LAYOUT
import UserLayout from "./layouts/UserLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH PAGES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER WEBSITE ================= */}
        <Route path="/" element={<UserLayout><Home/></UserLayout>} />
        <Route path="/category/:type" element={<UserLayout><Category/></UserLayout>} />
        <Route path="/product/:id" element={<UserLayout><ProductDetails/></UserLayout>} />
        <Route path="/cart" element={<UserLayout><Cart/></UserLayout>} />
        <Route path="/checkout" element={<UserLayout><Checkout/></UserLayout>} />
        <Route path="/orders" element={<UserLayout><Orders/></UserLayout>} />
        <Route path="/wishlist" element={<UserLayout><Wishlist/></UserLayout>} />
        <Route path="/search" element={<UserLayout><SearchResults/></UserLayout>} />
        <Route path="/sale" element={<UserLayout><Sale/></UserLayout>} />

        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout><AdminDashboard/></AdminLayout>
            </AdminGuard>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminGuard>
              <AdminLayout><AdminOrders/></AdminLayout>
            </AdminGuard>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminGuard>
              <AdminLayout><AdminProducts/></AdminLayout>
            </AdminGuard>
          }
        />

        <Route
          path="/admin/revenue"
          element={
            <AdminGuard>
              <AdminLayout><AdminRevenue/></AdminLayout>
            </AdminGuard>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
