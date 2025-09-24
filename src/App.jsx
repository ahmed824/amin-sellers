import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Typography } from "@mui/material";

import LoginPage from "./pages/LoginPage";
import ShippingTransfers from "./pages/ShippingTransfers";
import AcceleratorTransfers from "./pages/AcceleratorTransfers";
import TokenHistory from "./pages/TokenHistory";
import AcceleratorHistory from "./pages/AcceleratorHistory";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";
import BoostersBalance from "./pages/BoostersBalance";
import TokenBalance from "./pages/TokenBalance";

import { getAuthToken, removeAuthToken } from "./utils/token";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const queryClient = new QueryClient();

const pages = [
  {
    label: "الشحن والتحويلات",
    icon: <AccountBalanceWalletIcon sx={{ color: "#fff" }} />,
    component: <ShippingTransfers />,
    path: "/shipping-transfers",
  },
  {
    label: "تحويل المسرعات",
    icon: <RocketLaunchIcon sx={{ color: "#fff" }} />,
    component: <AcceleratorTransfers />,
    path: "/accelerator-transfers",
  },
  {
    label: "سجل تحويل التوكنز",
    icon: <MonetizationOnIcon sx={{ color: "#fff" }} />,
    component: <TokenHistory />,
    path: "/token-history",
  },
  {
    label: "سجل تحويل المسرعات",
    icon: <FlashOnIcon sx={{ color: "#fff" }} />,
    component: <AcceleratorHistory />,
    path: "/accelerator-history",
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState(0);

  // Check login on load
  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
  };

  const handleOpenNotifications = () => {
    console.log("Notifications modal opened");
  };

  if (isLoggedIn === null) {
    return <div>جاري التحقق من الجلسة...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <MainLayout
                  tab={tab}
                  setTab={setTab}
                  pages={pages}
                  handleLogout={handleLogout}
                  handleOpenNotifications={handleOpenNotifications}
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/shipping-transfers"
            element={
              isLoggedIn ? (
                <ShippingTransfers />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/accelerator-transfers"
            element={
              isLoggedIn ? (
                <AcceleratorTransfers />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/token-history"
            element={
              isLoggedIn ? (
                <TokenHistory />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/accelerator-history"
            element={
              isLoggedIn ? (
                <AcceleratorHistory />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/boosters-balance"
            element={
              isLoggedIn ? (
                <BoostersBalance />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/token-balance"
            element={
              isLoggedIn ? (
                <TokenBalance />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="*"
            element={<Typography>الصفحة غير موجودة</Typography>}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
