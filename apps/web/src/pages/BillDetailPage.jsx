import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const BillDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bills/${id}`);
      setBill(res.data.data);
    } catch (err) {
      setMessage("Failed to load bill");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setMessage("Please enter a valid payment amount");
      return;
    }

    if (Number(paymentAmount) > bill.balanceAmount) {
      setMessage(`Payment cannot exceed due amount of Rs. ${bill.balanceAmount}`);
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      await api.post("/payments", {
        customerId: bill.customerId._id,
        billId: bill._id,
        amount: Number(paymentAmount),
        date: paymentDate,
      });
      setMessage("Payment recorded successfully!");
      setPaymentAmount("");
      setTimeout(() => {
        fetchBill();
        setMessage("");
      }, 1500);
    } catch (err) {
      setMessage("Failed to record payment: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading bill...</div>;
  if (!bill) return <div className="empty">Bill not found</div>;

  const paid = bill.totalAmount - bill.balanceAmount;
  const percentagePaid = (paid / bill.totalAmount) * 100;

  return (
    <div>
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate("/bills")}>← Back</button>
        <h1 className="page-title">Bill #{bill.billNumber}</h1>
      </div>

      {/* Bill Details Card */}
      <div className="detail-card">
        <div className="detail-section">
          <label>Customer</label>
          <div className="detail-value">{bill.customerId?.name}</div>
        </div>

        <div className="detail-row">
          <div className="detail-section">
            <label>Bird Type</label>
            <div className="detail-value">{bill.birdType}</div>
          </div>
          <div className="detail-section">
            <label>Weight</label>
            <div className="detail-value">{bill.weight} kg</div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-section">
            <label>Rate</label>
            <div className="detail-value">Rs. {bill.rate}/kg</div>
          </div>
          <div className="detail-section">
            <label>Date</label>
            <div className="detail-value">{new Date(bill.date).toISOString().slice(0, 10)}</div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="detail-card">
        <h3 style={{ margin: "0 0 16px 0" }}>Payment Status</h3>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentagePaid}%` }}></div>
        </div>

        <div className="payment-summary">
          <div className="summary-item">
            <div className="summary-label">Total Amount</div>
            <div className="summary-amount">Rs. {bill.totalAmount.toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Amount Paid</div>
            <div className="summary-amount" style={{ color: "#27ae60" }}>Rs. {paid.toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Due Amount</div>
            <div className="summary-amount" style={{ color: "#e74c3c", fontWeight: "700" }}>
              Rs. {bill.balanceAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      {bill.balanceAmount > 0 && (
        <div className="detail-card">
          <h3 style={{ margin: "0 0 16px 0" }}>Record Payment</h3>
          
          {message && (
            <div className={`message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handlePayment} className="form">
            <div>
              <label>Payment Amount</label>
              <input
                type="number"
                placeholder="Enter payment amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                max={bill.balanceAmount}
                step="0.01"
                disabled={submitting}
              />
              <small style={{ color: "#666", display: "block", marginTop: "4px" }}>
                Max: Rs. {bill.balanceAmount.toFixed(2)}
              </small>
            </div>

            <div>
              <label>Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Recording..." : "Record Payment"}
            </button>
          </form>
        </div>
      )}

      {bill.balanceAmount === 0 && (
        <div className="detail-card" style={{ background: "#f0f8f5", border: "1px solid #27ae60" }}>
          <p style={{ margin: 0, color: "#27ae60", fontWeight: "600", textAlign: "center" }}>
            ✓ This bill has been fully paid
          </p>
        </div>
      )}
    </div>
  );
};

export default BillDetailPage;
