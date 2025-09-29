import Dashboard from "../components/Dashboard";

function DashboardPage({ onLogout, isModal }) {
  return <Dashboard onLogout={onLogout} isModal="false" />;
}

export default DashboardPage;
