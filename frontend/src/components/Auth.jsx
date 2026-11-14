import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/auth";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const res = await axios.post(`${API}/register`, { name, email, password, role });
        alert("Registered successfully! Logging you in...");
        onLogin(res.data);
      } else {
        const res = await axios.post(`${API}/login`, { email, password });
        onLogin(res.data);
      }
    } catch (err) {
      alert(err.response?.data || "Authentication failed");
    }
  };

  return (
    <div className="card auth-box">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <label>Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} />
          </>
        )}

        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        {isRegister && (
          <>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CLIENT">Client (Post Projects)</option>
              <option value="FREELANCER">Freelancer (Bid on Projects)</option>
            </select>
          </>
        )}

        <button type="submit" style={{ width: "100%" }}>
          {isRegister ? "Create Account" : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        {isRegister ? "Already have an account? " : "New user? "}
        <button className="secondary" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Switch to Login" : "Register Here"}
        </button>
      </p>
    </div>
  );
}