import { useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import ClientDashboard from "./components/ClientDashboard";
import FreelancerDashboard from "./components/FreelancerDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      <nav className="navbar">
        <h2>Freelance Bidding System</h2>
        <div className="nav-right">
          <span>{user.name} ({user.role})</span>
          <button className="danger" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        {user.role === "CLIENT" && <ClientDashboard user={user} />}
        {user.role === "FREELANCER" && <FreelancerDashboard user={user} />}
        {user.role === "ADMIN" && <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;