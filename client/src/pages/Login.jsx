import { useState } from "react";
import { login } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth:480}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="card" style={{display:"grid", gap:16}}>
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
            placeholder="Enter your password"
          />
        </div>
        {error && <div style={{color:"#dc2626", fontSize:14}}>{error}</div>}
        <button className="btn" type="submit" disabled={loading} style={{cursor: loading ? "not-allowed" : "pointer"}}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <p style={{textAlign:"center", fontSize:14}}>
          Don't have an account? <a href="/register" style={{color:"var(--brand)"}}>Register here</a>
        </p>
      </form>
    </div>
  );
}
