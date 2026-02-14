import { useEffect, useState } from "react";
import api from "../services/api";

export default function AccountPage() {

  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);

  // 🔐 GET PROFILE (JWT)
  useEffect(() => {
    api.get("/api/auth/me")
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Please login again");
      });
  }, []);

  const handleChange = e =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await api.put("/api/auth/update", user);
      alert("Profile updated successfully ✅");
localStorage.setItem("name", user.name);      window.location.reload();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <h2 className="p-20 text-center">Loading...</h2>;

  return (
    <div className="bg-gray-100 py-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">

        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <div className="col-span-2">
            <label className="text-sm font-semibold">Full Name</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border p-3 rounded mt-1 bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="col-span-2 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
}
