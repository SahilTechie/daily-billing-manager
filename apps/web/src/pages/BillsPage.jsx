import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBills = () => {
    api.get("/bills").then((res) => setBills(res.data.data)).catch(() => null);
  };

  useEffect(() => {
    fetchBills();
  }, [location]); // Refetch bills whenever location changes

  return (
    <div>
      <div className="list-head">
        <h1 className="page-title">All Bills</h1>
        <span className="pill">{bills.length} bills</span>
      </div>

      <div className="list">
        {bills.map((bill) => (
          <div 
            key={bill._id} 
            className="list-item"
            onClick={() => navigate(`/bills/${bill._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <p className="item-title">#{bill.billNumber} {bill.customerId?.name || "Customer"}</p>
              <p className="item-sub">
                {new Date(bill.date).toISOString().slice(0, 10)} · {bill.birdType} · {bill.weight} kg
              </p>
            </div>
            <div className="item-right">
              <div>Rs. {bill.totalAmount.toFixed(2)}</div>
              <small>Due: Rs. {bill.balanceAmount.toFixed(2)}</small>
            </div>
          </div>
        ))}

        {!bills.length && <p className="empty">No bills yet</p>}
      </div>
    </div>
  );
};

export default BillsPage;
