import { Link } from "react-router-dom";
import "./Home.css";

export default function Home(){
  return (
    <section className="hero">
      <div className="col">
        <h1>Connecting surplus food with those in need, powered by AI.</h1>
        <p className="sub">Donors notify, volunteers collect, hunger reduced.</p>
        <div className="cta">
          <Link className="btn" to="/post">Donate Food</Link>
          <Link className="btn outline" to="/collector">Become a Collector</Link>
        </div>
        <div className="badge"><span className="dot"></span> AI-powered matching active</div>
      </div>
      <div className="col">
        <div className="img-card">
          <img src="https://images.unsplash.com/photo-1504753793650-d4a2b783c15e" alt="donation" />
        </div>
      </div>
    </section>
  );
}
