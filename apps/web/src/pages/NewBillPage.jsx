import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const NewBillPage = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", mobile: "" });
  const [form, setForm] = useState({
    customerId: "",
    date: new Date().toISOString().slice(0, 10),
    birdType: "Broiler",
    numberOfBirds: 0,
    weight: "",
    rate: "",
    advancePaid: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await api.get("/customers");
    setCustomers(data.data);
    if (data.data[0] && !form.customerId) {
      setForm((prev) => ({ ...prev, customerId: data.data[0]._id }));
    }
  };

  const addNewCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.mobile) return;

    try {
      const { data } = await api.post("/customers", newCustomer);
      setCustomers((prev) => [...prev, data.data]);
      setForm((prev) => ({ ...prev, customerId: data.data._id }));
      setNewCustomer({ name: "", mobile: "" });
      setShowAddCustomer(false);
    } catch (err) {
      console.error("Failed to add customer", err);
    }
  };

  const total = Number(form.weight || 0) * Number(form.rate || 0);
  const due = Math.max(0, total - Number(form.advancePaid || 0));

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/bills", {
      ...form,
      numberOfBirds: Number(form.numberOfBirds || 0),
      weight: Number(form.weight || 0),
      rate: Number(form.rate || 0),
      advancePaid: Number(form.advancePaid || 0),
    });
    navigate(`/bills/${data.data._id}`);
  };

  return (
    <div>
      <h1 className="page-title">New Bill</h1>

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomer && (
        <div className="modal-overlay" onClick={() => setShowAddCustomer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Quick Add Customer</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowAddCustomer(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-subtitle">Add a new customer</p>
            
            <form onSubmit={addNewCustomer} className="modal-form">
              <label className="form-label">Name *</label>
              <input
                type="text"
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="form-input"
                required
              />

              <label className="form-label">Mobile *</label>
              <input
                type="tel"
                placeholder="Mobile number"
                value={newCustomer.mobile}
                onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                className="form-input"
                required
              />

              <button type="submit" className="btn-primary">
                Add Customer
              </button>
            </form>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="form-card">
        {/* BILL DATE SECTION */}
        <div className="form-section">
          <label className="section-label">Bill Date</label>
          <input 
            type="date" 
            value={form.date} 
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} 
            className="form-input"
          />
        </div>

        {/* CUSTOMER SECTION */}
        <div className="form-section">
          <label className="section-label">Customer *</label>
          <div className="customer-select-wrapper">
            <select
              value={form.customerId}
              onChange={(e) => setForm((prev) => ({ ...prev, customerId: e.target.value }))}
              required
              className="form-input"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.mobile})
                </option>
              ))}
            </select>
            <button 
              type="button" 
              className="btn-add-customer"
              onClick={() => setShowAddCustomer(true)}
            >
              +
            </button>
          </div>
        </div>

        {/* ITEM DETAILS SECTION */}
        <div className="form-section">
          <h3 className="section-title">Item Details</h3>
          
          <label className="form-label">Bird Type *</label>
          <select 
            value={form.birdType} 
            onChange={(e) => setForm((p) => ({ ...p, birdType: e.target.value }))} 
            required 
            className="form-input"
          >
            <option value="">Select bird type</option>
            <option value="Layer">Layer</option>
            <option value="Parent">Parent</option>
            <option value="Broiler">Broiler</option>
          </select>

          <label className="form-label">Number of Birds *</label>
          <input
            type="number"
            value={form.numberOfBirds}
            onChange={(e) => setForm((p) => ({ ...p, numberOfBirds: e.target.value }))}
            className="form-input"
            placeholder="0"
          />

          <div className="form-row">
            <div>
              <label className="form-label">Weight (kg) *</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.weight} 
                onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} 
                required 
                className="form-input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="form-label">Rate (Rs/kg) *</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.rate} 
                onChange={(e) => setForm((p) => ({ ...p, rate: e.target.value }))} 
                required 
                className="form-input"
                placeholder="0"
              />
            </div>
          </div>

          <label className="form-label">Advance Paid</label>
          <input
            type="number"
            step="0.01"
            value={form.advancePaid}
            onChange={(e) => setForm((p) => ({ ...p, advancePaid: e.target.value }))}
            className="form-input"
            placeholder="0"
          />
        </div>

        <div className="calc-row">
          <p>Total: <b>Rs. {total.toFixed(2)}</b></p>
          <p>Due: <b>Rs. {due.toFixed(2)}</b></p>
        </div>

        <button className="btn-primary">Save Bill</button>
      </form>
    </div>
  );
};

export default NewBillPage;
