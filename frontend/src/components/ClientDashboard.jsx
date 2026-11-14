import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

export default function ClientDashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [bidsByProject, setBidsByProject] = useState({});

  const loadProjects = async () => {
    const res = await axios.get(`${API}/projects/client/${user.id}`);
    setProjects(res.data);
  };

  useEffect(() => {
    axios.get(`${API}/projects/client/${user.id}`).then((res) => {
      setProjects(res.data);
    });
  }, [user.id]);

  const handlePostProject = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/projects/client/${user.id}`, {
      title,
      description,
      budget: parseFloat(budget),
    });
    setTitle("");
    setDescription("");
    setBudget("");
    loadProjects();
  };

  const loadBids = async (projectId) => {
    const res = await axios.get(`${API}/bids/project/${projectId}`);
    setBidsByProject((prev) => ({ ...prev, [projectId]: res.data }));
  };

  const handleAcceptBid = async (bidId) => {
    await axios.put(`${API}/bids/${bidId}/accept`);
    alert("Bid accepted! Project moved to In-Progress.");
    loadProjects();
  };

  const handleComplete = async (projectId) => {
    await axios.put(`${API}/projects/${projectId}/complete`);
    loadProjects();
  };

  const filteredProjects = projects.filter((p) =>
    filter === "ALL" ? true : p.status === filter
  );

  return (
    <div>
      {/* Post Project Form */}
      <div className="card">
        <h3>Post a New Project</h3>
        <form onSubmit={handlePostProject}>
          <input placeholder="Project Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Project Description" rows="3" required value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Budget (₹ / $)" required value={budget} onChange={(e) => setBudget(e.target.value)} />
          <button type="submit">Post Project</button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((status) => (
          <button key={status} className={filter === status ? "active" : "secondary"} onClick={() => setFilter(status)}>
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Project List */}
      {filteredProjects.map((p) => (
        <div className="card" key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{p.title} — ${p.budget}</h3>
            <span className={`badge ${p.status}`}>{p.status}</span>
          </div>
          <p>{p.description}</p>

          {p.freelancer && <p><strong>Assigned Freelancer:</strong> {p.freelancer.name}</p>}

          {p.status === "OPEN" && (
            <div>
              <button className="secondary" onClick={() => loadBids(p.id)}>View Bids</button>
              {bidsByProject[p.id]?.map((b) => (
                <div className="bid-box" key={b.id}>
                  <div>
                    <strong>{b.freelancer.name}:</strong> {b.message}
                  </div>
                  <button className="success" onClick={() => handleAcceptBid(b.id)}>Accept Bid</button>
                </div>
              ))}
              {bidsByProject[p.id]?.length === 0 && <p>No bids yet.</p>}
            </div>
          )}

          {p.status === "IN_PROGRESS" && (
            <button className="success" onClick={() => handleComplete(p.id)}>
              Mark as Completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}