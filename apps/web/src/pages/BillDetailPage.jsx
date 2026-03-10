import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const BillDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const receiptRef = useRef(null);

  const shopName = user?.shopName || "Chicken Shop";

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

  const generateCanvas = async () => {
    const el = receiptRef.current;
    if (!el) return null;
    return html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  };

  const handleDownloadPDF = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, imgHeight);
    pdf.save(`bill-${bill.billNumber}.pdf`);
  };

  const handleShareWhatsApp = async () => {
    const customerName = bill.customerId?.name || "Customer";
    const dateStr = new Date(bill.date).toISOString().slice(0, 10);
    const paid = bill.totalAmount - bill.balanceAmount;

    const text =
      `*${shopName.toUpperCase()}*\n` +
      `Digital Bill\n\n` +
      `Bill No: #${bill.billNumber}\n` +
      `Date: ${dateStr}\n` +
      `Customer: ${customerName}\n\n` +
      `Type: ${bill.birdType}\n` +
      `Birds: ${bill.numberOfBirds || "-"}\n` +
      `Weight: ${bill.weight} kg\n` +
      `Rate: Rs. ${Number(bill.rate).toFixed(2)}/kg\n\n` +
      `Amount: Rs. ${bill.totalAmount.toFixed(2)}\n` +
      `Advance Paid: Rs. ${paid.toFixed(2)}\n` +
      `*Balance: Rs. ${bill.balanceAmount.toFixed(2)}*\n\n` +
      `Thank you!`;

    const mobile = bill.customerId?.mobile?.replace(/\D/g, "");
    const url = mobile
      ? `https://wa.me/91${mobile}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  };

  if (loading) return <div className="loading">Loading bill...</div>;
  if (!bill) return <div className="empty">Bill not found</div>;

  const paid = bill.totalAmount - bill.balanceAmount;

  return (
    <div>
      <button className="back-btn" onClick={() => navigate("/bills")} style={{ marginBottom: 16 }}>
        ← Back
      </button>

      {/* ---- RECEIPT ---- */}
      <div className="receipt-wrapper" ref={receiptRef}>
        <div className="receipt">
          {/* Header */}
          <div className="receipt-header">
            <h2 className="receipt-shop">{shopName.toUpperCase()}</h2>
            <p className="receipt-subtitle">Digital Bill</p>
          </div>

          {/* Bill No & Date */}
          <div className="receipt-meta">
            <div>
              <span className="receipt-label">Bill No</span>
              <strong>#{bill.billNumber}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="receipt-label">Date</span>
              <strong>{new Date(bill.date).toISOString().slice(0, 10)}</strong>
            </div>
          </div>

          {/* Customer */}
          <div className="receipt-field">
            <span className="receipt-label">Customer</span>
            <strong>{bill.customerId?.name || "—"}</strong>
          </div>

          {/* Items Table */}
          <table className="receipt-table">
            <thead>
              <tr>
                <th>TYPE</th>
                <th>BIRDS</th>
                <th>WT(KG)</th>
                <th>RATE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bill.birdType}</td>
                <td>{bill.numberOfBirds || "—"}</td>
                <td>{Number(bill.weight).toFixed(2)}</td>
                <td>{Number(bill.rate).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="receipt-row">
            <span>Amount</span>
            <strong>Rs. {bill.totalAmount.toFixed(2)}</strong>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-row receipt-total-row">
            <span>Total</span>
            <strong>Rs. {bill.totalAmount.toFixed(2)}</strong>
          </div>
          <div className="receipt-row">
            <span className="receipt-advance">Advance Paid</span>
            <span className="receipt-advance">Rs. {paid.toFixed(2)}</span>
          </div>

          <div className="receipt-balance">
            <span>Balance</span>
            <strong>Rs. {bill.balanceAmount.toFixed(2)}</strong>
          </div>

          {/* Dashed separator & thank you */}
          <p className="receipt-dashes">- - - - - - - - - - - - - - - - - - - - -</p>
          <p className="receipt-thanks">Thank you!</p>
        </div>
      </div>

      {/* ---- ACTION BUTTONS ---- */}
      <div className="receipt-actions">
        <button className="btn-pdf" onClick={handleDownloadPDF}>
          ⬇ PDF
        </button>
        <button className="btn-whatsapp" onClick={handleShareWhatsApp}>
          ↗ WhatsApp
        </button>
      </div>

      {/* ---- PAYMENT SECTION ---- */}
      {bill.balanceAmount > 0 && (
        <div className="detail-card" style={{ marginTop: 16 }}>
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
        <div className="detail-card" style={{ marginTop: 16, background: "#f0f8f5", border: "1px solid #27ae60" }}>
          <p style={{ margin: 0, color: "#27ae60", fontWeight: "600", textAlign: "center" }}>
            ✓ This bill has been fully paid
          </p>
        </div>
      )}
    </div>
  );
};

export default BillDetailPage;
