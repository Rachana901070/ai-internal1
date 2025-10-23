import { useState } from "react";
import { register } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const roles = [
  { value: "donor", label: "Donor" },
  { value: "collector", label: "Collector" }
];

export default function Register(){
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "donor" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await register(form);
      setMessage(data.message || "Account created. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth:520}}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className="card" style={{display:"grid", gap:16}}>
        <div>
          <label>Name</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            required
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
            placeholder="Create a password"
          />
        </div>
        <div>
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        {message && <div style={{color:"var(--brand)", fontSize:14}}>{message}</div>}
        {error && <div style={{color:"#dc2626", fontSize:14}}>{error}</div>}
        <button className="btn" type="submit" disabled={loading} style={{cursor: loading ? "not-allowed" : "pointer"}}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{textAlign:"center", fontSize:14}}>
          Already have an account? <a href="/login" style={{color:"var(--brand)"}}>Login here</a>
        </p>
      </form>
    </div>
  );
}
