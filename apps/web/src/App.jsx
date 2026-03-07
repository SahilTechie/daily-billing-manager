import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ShellLayout from "./components/ShellLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BillsPage from "./pages/BillsPage";
import NewBillPage from "./pages/NewBillPage";
import BillDetailPage from "./pages/BillDetailPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import PendingPage from "./pages/PendingPage";

const PrivateScreen = ({ children }) => (
  <ProtectedRoute>
    <ShellLayout>{children}</ShellLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <PrivateScreen>
                <DashboardPage />
              </PrivateScreen>
            }
          />
          <Route
            path="/bills"
            element={
              <PrivateScreen>
                <BillsPage />
              </PrivateScreen>
            }
          />
          <Route
            path="/bills/new"
            element={
              <PrivateScreen>
                <NewBillPage />
              </PrivateScreen>
            }
          />
          <Route
            path="/bills/:id"
            element={
              <PrivateScreen>
                <BillDetailPage />
              </PrivateScreen>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateScreen>
                <CustomersPage />
              </PrivateScreen>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <PrivateScreen>
                <CustomerDetailPage />
              </PrivateScreen>
            }
          />
          <Route
            path="/pending"
            element={
              <PrivateScreen>
                <PendingPage />
              </PrivateScreen>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
