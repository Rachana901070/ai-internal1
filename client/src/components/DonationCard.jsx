export default function DonationCard({title, qty, timeLeft, distance, priority}){
  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:700}}>{title}</div>
          <div style={{color:"var(--muted)"}}>{qty}</div>
          <small style={{color:"var(--muted)"}}>{timeLeft} left • {distance} away</small>
        </div>
        <div><span className="badge">{priority === "high" && <span className="dot"/>} {priority} priority</span></div>
      </div>
      <div style={{display:"flex", gap:8, marginTop:12}}>
        <button className="btn" style={{flex:1}}>Accept Pickup</button>
        <button className="btn outline">Decline</button>
        <button className="btn outline">Chat</button>
      </div>
    </div>
  );
}
