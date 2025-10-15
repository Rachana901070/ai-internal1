import { Link } from "react-router-dom";

export default function NotFound(){
  return (
    <div className="container" style={{textAlign:"center", padding:"120px 0"}}>
      <h1 style={{fontSize:72, marginBottom:0}}>404</h1>
      <p style={{color:"var(--muted)"}}>The page you are looking for was not found.</p>
      <Link className="btn" to="/">Back to Home</Link>
    </div>
  );
}
