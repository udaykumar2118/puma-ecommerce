import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-20">
      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-5 tracking-wide">SUPPORT</h3>
          <ul className="space-y-3 text-sm">
            {[
              "Contact Us",
              "Promotions & Sale",
              "Track Order",
              "Returns",
              "FAQs",
            ].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="text-white font-semibold mb-5 tracking-wide">ACCOUNT</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
            <li><Link to="#" className="hover:text-white transition">Exchange & Return</Link></li>
            <li><Link to="#" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition">Sitemap</Link></li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-5 tracking-wide">ABOUT</h3>
          <ul className="space-y-3 text-sm">
            {["Company", "Careers", "Investors", "Sustainability"].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-white font-semibold mb-5 tracking-wide">FOLLOW US</h3>
          <ul className="space-y-3 text-sm">
            {["YouTube", "X (Twitter)", "Instagram", "Facebook", "Pinterest"].map(
              (item) => (
                <li
                  key={item}
                  className="hover:text-white transition cursor-pointer"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-800" />

      {/* BOTTOM FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        
        {/* COUNTRY */}
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-lg">🌍</span>
          <span>India</span>
        </div>

        {/* PAYMENTS */}
        <div className="flex items-center gap-5 opacity-80">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 hover:opacity-100 transition" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6 hover:opacity-100 transition" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/RuPay.svg" alt="RuPay" className="h-6 hover:opacity-100 transition" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/UPI-Logo-vector.svg" alt="UPI" className="h-6 hover:opacity-100 transition" />
        </div>

        {/* COPYRIGHT */}
        <div className="text-gray-500 text-center md:text-right leading-relaxed">
          <div>© {new Date().getFullYear()} Sneaky Ltd.</div>
          <div className="text-xs mt-1">
            Developed by{" "}
            <span className="text-gray-300 font-medium">
              Qiro Tech Innovation
            </span>
            <br />
            A DW Innovation's Venture
          </div>
        </div>
      </div>
    </footer>
  );
}