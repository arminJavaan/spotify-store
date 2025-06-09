// frontend/src/App.jsx

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import SpotifyLoading from "./components/SpotifyLoading";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/ProductsAdmin";
import AdminOrders from "./pages/admin/OrdersAdmin";
import AdminUsers from "./pages/admin/UsersAdmin";
import AdminDiscounts from "./pages/AdminDiscounts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDiscountsForm from "./pages/admin/AdminDiscountForm";
import VerifyEmail from "./pages/VerifyEmail";
import Faq from "./pages/Faq";
import WalletManager from "./pages/admin/WalletManager";
import WalletTopupRequests from "./pages/admin/WalletTopupRequest";
import NotFound from "./pages/NotFound";
import VerifyPhone from "./pages/VerifyPhone";
import OrderDetails from "./pages/OrderDetails";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import CreateTicket from "./pages/CreateTicket"; // یا SubmitTicket یا Support
import UserTickets from "./pages/UserTickets";
import TicketDetails from "./pages/TicketDetails";
import SupportTicketsAdmin from "./pages/admin/SupportTicketsAdmin";
import InstallApp from "./pages/InstallApp";

function AppInner() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SpotifyLoading />;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <CustomCursor />
      <BackgroundAnimation />

      <Navbar />

      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/About" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/install" element={<InstallApp />} />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          <Route path="/verify-phone" element={<VerifyPhone />} />
          {/* اگر کاربر لاگین کرده باشد، دسترسی به /login و /register مسدود می‌شود */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

            {/* پنل کاربر */}
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/my-tickets" element={<UserTickets />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />

            {/* پنل ادمین */}
            <Route
              path="/admin/support"
              element={
                <AdminRoute>
              <SupportTicketsAdmin/>
              </AdminRoute>}
            />


          {/* مسیرهای ادمین */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/discounts"
            element={
              <AdminRoute>
                <AdminDiscounts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/discounts/add"
            element={
              <AdminRoute>
                <AdminDiscountsForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/wallets"
            element={
              <AdminRoute>
                {" "}
                <WalletManager />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/wallet-topups"
            element={
              <AdminRoute>
                {" "}
                <WalletTopupRequests />{" "}
              </AdminRoute>
            }
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/faq" element={<Faq />} />
          {/* مسیر 404 */}
          <Route
            path="*"
            element={
              <h2 className="text-center text-gray-light py-20">
                صفحهٔ مورد نظر یافت نشد
              </h2>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
