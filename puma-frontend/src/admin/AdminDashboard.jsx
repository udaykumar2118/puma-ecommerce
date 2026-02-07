import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function AdminDashboard() {

  const year = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    pending: 0,
    delivered: 0
  });

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  // ================= LOAD EVERYTHING =================
  const loadAllData = async () => {
    try {
      await Promise.all([
        loadStats(),
        loadMonthlyAnalytics()
      ]);
    } catch (err) {
      console.error("Dashboard load error", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= KPI DATA =================
  const loadStats = async () => {
    const [ordersRes, revenueRes, pendingRes, deliveredRes] =
      await Promise.all([
        api.get("/admin/dashboard/total-orders"),
        api.get("/admin/dashboard/total-revenue"),
        api.get("/admin/dashboard/orders/status?status=PENDING"),
        api.get("/admin/dashboard/orders/status?status=DELIVERED"),
      ]);

    setStats({
      orders: ordersRes.data,
      revenue: revenueRes.data,
      pending: pendingRes.data.length,
      delivered: deliveredRes.data.length
    });
  };

  // ================= MONTHLY ANALYTICS =================
  const loadMonthlyAnalytics = async () => {
    const requests = [];

    for (let m = 1; m <= 12; m++) {
      requests.push(
        Promise.all([
          api.get(`/admin/dashboard/revenue/monthly?year=${year}&month=${m}`),
          api.get(`/admin/dashboard/orders/monthly?year=${year}&month=${m}`)
        ])
      );
    }

    const responses = await Promise.all(requests);

    const data = responses.map((res, i) => ({
      month: getMonthName(i + 1),
      revenue: Number(res[0].data),
      orders: Number(res[1].data)
    }));

    setMonthlyData(data);
  };

  if (loading)
    return <h1 className="text-3xl font-bold">Loading analytics...</h1>;

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Delivered", value: stats.delivered },
  ];

  const COLORS = ["#facc15", "#22c55e"];

  return (
    <>
      <h1 className="text-4xl font-bold mb-10">Ecommerce Analytics</h1>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card title="Total Orders" value={stats.orders} />
        <Card title="Revenue" value={`₹${formatMoney(stats.revenue)}`} />
        <Card title="Pending Orders" value={stats.pending} />
        <Card title="Delivered Orders" value={stats.delivered} />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">

        {/* REVENUE LINE */}
        <GlassCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#ddd"/>
              <YAxis stroke="#ddd"/>
              <Tooltip/>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ORDERS BAR */}
        <GlassCard title="Orders Growth">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#ddd"/>
              <YAxis stroke="#ddd"/>
              <Tooltip/>
              <Bar dataKey="orders" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

      </div>

      {/* PIE */}
      <GlassCard title="Order Status">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={110}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </GlassCard>
    </>
  );
}

/* helpers */
function getMonthName(m) {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m-1];
}

function formatMoney(num){
  return new Intl.NumberFormat("en-IN").format(num);
}

/* UI */
function GlassCard({ title, children }) {
  return (
    <div className="
      bg-gradient-to-br from-white/10 to-white/5
      backdrop-blur-xl
      p-6 rounded-2xl
      border border-white/20
      hover:shadow-xl hover:shadow-green-500/20
      transition duration-300
    ">
      <h2 className="text-xl font-bold mb-4 tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="
      bg-gradient-to-br from-white/10 to-white/5
      backdrop-blur-xl
      p-6 rounded-2xl
      border border-white/20
      hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20
      transition duration-300
      relative overflow-hidden
    ">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition"/>
      <p className="text-gray-300">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
