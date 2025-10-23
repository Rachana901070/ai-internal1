import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Home.css";

export default function Home(){
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="col">
          <h1 className="fade-in">Connecting surplus food with those in need.</h1>
          <p className="sub fade-in-delay">Donors notify, volunteers collect, hunger reduced.</p>
          <div className="cta fade-in-delay-2">
            {user ? (
              <>
                <Link className="btn" to="/post">Donate Food</Link>
                <Link className="btn outline" to="/collector">Become a Collector</Link>
              </>
            ) : (
              <>
                <Link className="btn" to="/register">Get Started</Link>
                <Link className="btn outline" to="/login">Login</Link>
              </>
            )}
          </div>
        </div>
        <div className="col">
          <div className="img-card slide-in">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop&crop=center" alt="People donating food and helping community" />
            <div className="overlay"></div>
          </div>
        </div>
      </section>
      <section className="stats-banner">
        <div className="stats">
          <div className="stat">10,000+ Meals Distributed</div>
          <div className="stat">500+ Volunteers</div>
          <div className="stat">50+ Cities</div>
        </div>
      </section>
    </>
  );
}
