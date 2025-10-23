import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar(){
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const links = [
    ["Home","/"],
    ["Post Food","/post"],
    ["Collector","/collector"],
    ["Proof Upload","/proof-upload"],
    ["How It Works","/how-it-works"],
    ["Privacy","/privacy"],
    ["FAQ & Support","/faq"]
  ];

  return (
    <header className="nav">
      <div className="wrap">
        <Link to="/" className="brand">
          <div className="logo">M</div>
          <span>Maitri Dhatri</span>
        </Link>
        <nav>
          {links.map(([t,href])=>(
            <NavLink key={href} to={href} className={({isActive}) => isActive? "link active":"link"}>
              {t}
            </NavLink>
          ))}
        </nav>
        <div className="auth">
          {user ? (
            <div style={{display:"flex", alignItems:"center", gap:16}}>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn" style={{padding:"8px 16px"}}>Logout</button>
            </div>
          ) : (
            <div style={{display:"flex", gap:8}}>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
