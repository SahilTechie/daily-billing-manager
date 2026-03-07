import { useEffect, useState } from "react";
import api from "../services/api";

const PendingPage = () => {
  const [sort, setSort] = useState("highest");
  const [pending, setPending] = useState({ totalPending: 0, customers: [] });

  const load = async (currentSort) => {
    const res = await api.get(`/pending?sort=${currentSort}`);
    setPending(res.data.data);
  };

  useEffect(() => {
    load(sort).catch(() => null);
  }, [sort]);

  return (
    <div>
      <div className="list-head">
        <h1 className="page-title">Pending Balances</h1>
        <button
          className="btn-ghost"
          onClick={() => setSort((prev) => (prev === "highest" ? "lowest" : "highest"))}
        >
          {sort === "highest" ? "Highest" : "Lowest"}
        </button>
      </div>

      <div className="card highlight">
        <p className="label">Total Pending</p>
        <h3>Rs. {Number(pending.totalPending || 0).toFixed(2)}</h3>
        <p className="item-sub">{pending.customers.length} customers with pending balance</p>
      </div>

      <div className="list">
        {pending.customers.map((c) => (
          <div className="list-item" key={c._id}>
            <div>
              <p className="item-title">{c.name}</p>
              <p className="item-sub">{c.priorityBucket} Priority · Score {c.score}</p>
            </div>
            <div className="item-right">Rs. {c.currentBalance.toFixed(2)}</div>
          </div>
        ))}

        {!pending.customers.length && <p className="empty">No pending balances</p>}
      </div>
    </div>
  );
};

export default PendingPage;
