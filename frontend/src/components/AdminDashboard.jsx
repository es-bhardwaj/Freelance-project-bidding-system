import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/admin";

export default function AdminDashboard() {
  const [data, setData] = useState({ totalUsers: 0, totalProjects: 0, totalBids: 0, users: [], projects: [] });

const loadDashboard = async () => {
    const res = await axios.get(`${API}/dashboard`);
    setData(res.data);
  };

  useEffect(() => {
    axios.get(`${API}/dashboard`).then((res) => {
      setData(res.data);
    });
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}`);
      loadDashboard();
    } catch {
      alert("Cannot delete user who owns active projects or bids.");
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`);
      loadDashboard();
    } catch {
      alert("Cannot delete project that already has bids.");
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><h3>{data.totalUsers}</h3><p>Total Users</p></div>
        <div className="stat-card"><h3>{data.totalProjects}</h3><p>Total Projects</p></div>
        <div className="stat-card"><h3>{data.totalBids}</h3><p>Total Bids</p></div>
      </div>

      <div className="card">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td>
                  {u.role !== "ADMIN" && (
                    <button className="danger" onClick={() => deleteUser(u.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>All Projects</h3>
        <table>
          <thead>
            <tr><th>ID</th><th>Title</th><th>Budget</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.projects.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.title}</td><td>${p.budget}</td><td>{p.status}</td>
                <td><button className="danger" onClick={() => deleteProject(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}