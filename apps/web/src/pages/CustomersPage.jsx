import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", mobile: "", address: "" });

  const fetchCustomers = async (query = "") => {
    const { data } = await api.get(`/customers${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    setCustomers(data.data);
  };

  useEffect(() => {
    fetchCustomers().catch(() => null);
  }, []);

  const addCustomer = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile) return;

    await api.post("/customers", form);
    setForm({ name: "", mobile: "", address: "" });
    await fetchCustomers(q);
  };

  return (
    <div>
      <h1 className="page-title">Customers</h1>

      <div className="toolbar">
        <input
          placeholder="Search by name or mobile..."
          value={q}
          onChange={async (e) => {
            const value = e.target.value;
            setQ(value);
            await fetchCustomers(value);
          }}
        />
      </div>

      <form className="form-inline" onSubmit={addCustomer}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))}
        />
        <button className="btn-primary">Add</button>
      </form>

      <div className="list">
        {customers.map((c) => (
          <Link className="list-item" to={`/customers/${c._id}`} key={c._id}>
            <div>
              <p className="item-title">{c.name}</p>
              <p className="item-sub">{c.mobile}</p>
            </div>
            <div className="item-right">
              <small>Due</small>
              <div>Rs. {Number(c.currentBalance || 0).toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomersPage;
