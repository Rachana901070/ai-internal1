import { Link, NavLink } from "react-router-dom";
import { appRoutes } from "../router/routes.jsx";
import "./Navbar.css";

const navigationRoutes = appRoutes.filter(route => route.showInNav);

export default function Navbar(){
  return (
    <header className="nav">
      <div className="wrap">
        <Link to="/" className="brand">
          <div className="logo">M</div>
          <span>Maitri Dhatri</span>
        </Link>
        <nav>
          {navigationRoutes.map(({ label, path }) => (
            <NavLink key={path} to={path} className={({isActive}) => isActive? "link active":"link"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="lang">EN ▾</div>
      </div>
    </header>
  );
}
