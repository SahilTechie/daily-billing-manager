import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const DashboardPage = () => {
  const [data, setData] = useState({
    todayBills: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    totalPending: 0,
  });

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data.data)).catch(() => null);
  }, []);

  return (
    <div>
      <h1 className="page-title">Good Evening</h1>
      <p className="date">{new Date().toDateString()}</p>

      <div className="grid-2">
        <Card title="Today's Bills" value={data.todayBills} />
        <Card title="Today's Revenue" value={`Rs. ${data.todayRevenue.toFixed(2)}`} />
        <Card title="Total Customers" value={data.totalCustomers} />
        <Card title="Total Pending" value={`Rs. ${data.totalPending.toFixed(2)}`} highlight />
      </div>

      <h2 className="section-title">Quick Actions</h2>
      <div className="grid-2 actions">
        <QuickLink to="/bills/new" title="New Bill" primary />
        <QuickLink to="/bills" title="All Bills" />
        <QuickLink to="/customers" title="Customers" />
        <QuickLink to="/pending" title="Pending" />
      </div>
    </div>
  );
};

const Card = ({ title, value, highlight }) => (
  <div className={`card ${highlight ? "highlight" : ""}`}>
    <p className="label">{title}</p>
    <h3>{value}</h3>
  </div>
);

const QuickLink = ({ to, title, primary }) => {
  const icons = {
    "New Bill": "+",
    "All Bills": "📄",
    "Customers": "👥",
    "Pending": "⏱️",
  };

  return (
    <Link to={to} className={`quick ${primary ? "primary" : ""}`}>
      <span className="quick-icon">{icons[title]}</span>
      <span className="quick-title">{title}</span>
    </Link>
  );
};

export default DashboardPage;
