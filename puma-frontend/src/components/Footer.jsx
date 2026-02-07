import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-16">
      {/* TOP FOOTER */}
      <div className="px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-bold mb-4">SUPPORT</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#">Contact Us</Link></li>
            <li><Link to="#">Promotions & Sale</Link></li>
            <li><Link to="#">Track Order</Link></li>
            <li><Link to="#">Returns</Link></li>
            <li><Link to="#">FAQs</Link></li>
          </ul>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="text-white font-bold mb-4">ACCOUNT</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="#">Exchange & Return</Link></li>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Sitemap</Link></li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-bold mb-4">ABOUT</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#">Company</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">Investors</Link></li>
            <li><Link to="#">Sustainability</Link></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-white font-bold mb-4">SOCIAL</h3>
          <ul className="space-y-2 text-sm">
            <li>YouTube</li>
            <li>X (Twitter)</li>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-gray-700 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        
        {/* COUNTRY */}
        <div>
          🌍 <span className="ml-1">India</span>
        </div>

        {/* PAYMENTS */}
        <div className="flex gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
            alt="Mastercard"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/39/RuPay.svg"
            alt="RuPay"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/16/UPI-Logo-vector.svg"
            alt="UPI"
            className="h-6"
          />
        </div>

        {/* COPYRIGHT */}
        <div className="text-gray-500">
          © {new Date().getFullYear()} PUMA India Ltd.
        </div>
      </div>
    </footer>
  );
}
