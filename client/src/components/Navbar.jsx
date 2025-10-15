import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar(){
  const links = [
    ["Home","/"],
    ["Post Food","/post"],
    ["Collector","/collector"],
    ["Proof Upload","/proof"],
    ["How It Works","/how-it-works"],
    ["AI Models","/ai-models"],
    ["Admin Panel","/admin"],
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
        <div className="lang">EN ▾</div>
      </div>
    </header>
  );
}
