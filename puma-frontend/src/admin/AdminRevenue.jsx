import { useEffect, useState } from "react";
import api from "../services/api";
import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminRevenue() {

  const year = new Date().getFullYear();
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = [];
      for (let m = 1; m <= 12; m++) {
        const res = await api.get(
          `/admin/dashboard/revenue/monthly?year=${year}&month=${m}`
        );
        data.push(res.data);
      }
      setMonthly(data);
    };
    load();
  }, []);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const totalRevenue = monthly.reduce((a,b)=>a+b,0);
  const bestMonth = months[monthly.indexOf(Math.max(...monthly))];
  const avgRevenue = Math.round(totalRevenue / 12);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Revenue Analytics</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white/20 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow">
          <p className="text-gray-300">Year Revenue</p>
          <h2 className="text-3xl font-bold text-green-400">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow">
          <p className="text-gray-300">Best Month</p>
          <h2 className="text-3xl font-bold">
            {bestMonth}
          </h2>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow">
          <p className="text-gray-300">Average Monthly</p>
          <h2 className="text-3xl font-bold">
            ₹{avgRevenue}
          </h2>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-2 gap-8">

        {/* BAR CHART */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow h-[420px]">
          <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>

          <Bar
            data={{
              labels: months,
              datasets: [
                {
                  label: "Revenue",
                  data: monthly,
                  backgroundColor: "#22c55e",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: "white" } }
              },
              scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } },
              },
            }}
          />
        </div>

        {/* DOUGHNUT CHART */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow h-[420px]">
          <h2 className="text-xl font-bold mb-4">
            Revenue Distribution
          </h2>

          <div className="w-[70%] mx-auto">
            <Doughnut
              data={{
                labels: months,
                datasets: [
                  {
                    data: monthly,
                    backgroundColor: [
                      "#22c55e","#3b82f6","#f59e0b","#ef4444",
                      "#a855f7","#14b8a6","#eab308","#f97316",
                      "#06b6d4","#8b5cf6","#10b981","#f43f5e"
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { labels: { color: "white" } }
                }
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
