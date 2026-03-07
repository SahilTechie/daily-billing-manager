import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");

  const load = async () => {
    const res = await api.get(`/customers/${id}`);
    setData(res.data.data);
  };

  useEffect(() => {
    load().catch(() => null);
  }, [id]);

  const addPayment = async (e) => {
    e.preventDefault();
    if (!amount) return;
    await api.post("/payments", { customerId: id, amount: Number(amount) });
    setAmount("");
    await load();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="page-title">{data.customer.name}</h1>
      <p className="item-sub">{data.customer.mobile}</p>

      <div className="grid-3">
        <Card title="Total Billed" value={data.summary.totalBilled} />
        <Card title="Total Paid" value={data.summary.totalPaid} />
        <Card title="Pending" value={data.summary.pending} />
      </div>

      <form onSubmit={addPayment} className="form-inline">
        <input
          placeholder="Add payment amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
        />
        <button className="btn-primary">Add Payment</button>
      </form>

      <h2 className="section-title">Bills</h2>
      <div className="list">
        {data.bills.map((bill) => (
          <div className="list-item" key={bill._id}>
            <div>
              <p className="item-title">#{bill.billNumber} · {bill.birdType}</p>
              <p className="item-sub">{new Date(bill.date).toISOString().slice(0, 10)}</p>
            </div>
            <div className="item-right">Rs. {bill.balanceAmount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Payments</h2>
      <div className="list">
        {data.payments.map((p) => (
          <div className="list-item" key={p._id}>
            <p className="item-sub">{new Date(p.date).toISOString().slice(0, 10)}</p>
            <div className="item-right">Rs. {p.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="card">
    <p className="label">{title}</p>
    <h3>Rs. {Number(value || 0).toFixed(2)}</h3>
  </div>
);

export default CustomerDetailPage;
