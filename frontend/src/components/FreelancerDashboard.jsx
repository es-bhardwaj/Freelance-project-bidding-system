import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

export default function FreelancerDashboard({ user }) {
  const [tab, setTab] = useState("OPEN");
  const [openProjects, setOpenProjects] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [bidMessages, setBidMessages] = useState({});

useEffect(() => {
    Promise.all([
      axios.get(`${API}/projects/open`),
      axios.get(`${API}/projects/freelancer/${user.id}/in-progress`),
    ]).then(([openRes, activeRes]) => {
      setOpenProjects(openRes.data);
      setActiveProjects(activeRes.data);
    });
  }, [user.id]);

  const handleBidSubmit = async (projectId) => {
    const message = bidMessages[projectId];
    if (!message || !message.trim()) return alert("Please write a bid message.");

    await axios.post(`${API}/bids/project/${projectId}/freelancer/${user.id}`, { message });
    alert("Bid submitted!");
    setBidMessages((prev) => ({ ...prev, [projectId]: "" }));
  };

  return (
    <div>
      <div className="tabs">
        <button className={tab === "OPEN" ? "active" : "secondary"} onClick={() => setTab("OPEN")}>
          Browse Open Projects ({openProjects.length})
        </button>
        <button className={tab === "TRACK" ? "active" : "secondary"} onClick={() => setTab("TRACK")}>
          Track My Bids / In-Progress ({activeProjects.length})
        </button>
      </div>

      {tab === "OPEN" && openProjects.map((p) => (
        <div className="card" key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{p.title} — ${p.budget}</h3>
            <span className="badge OPEN">OPEN</span>
          </div>
          <p>{p.description}</p>
          <small>Posted by: {p.client.name}</small>

          <textarea
            rows="2"
            placeholder="Write your proposal / bid message..."
            value={bidMessages[p.id] || ""}
            onChange={(e) => setBidMessages({ ...bidMessages, [p.id]: e.target.value })}
          />
          <button onClick={() => handleBidSubmit(p.id)}>Submit Bid</button>
        </div>
      ))}

      {tab === "TRACK" && activeProjects.map((p) => (
        <div className="card" key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{p.title} — ${p.budget}</h3>
            <span className="badge IN_PROGRESS">IN_PROGRESS</span>
          </div>
          <p>{p.description}</p>
          <p><strong>Client:</strong> {p.client.name} ({p.client.email})</p>
        </div>
      ))}

      {tab === "TRACK" && activeProjects.length === 0 && (
        <div className="card">No active in-progress projects right now.</div>
      )}
    </div>
  );
}