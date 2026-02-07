import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />

      {/* Page Content */}
      <main className="min-h-[70vh]">
        {children}
      </main>

      <Footer />
    </>
  );
}
