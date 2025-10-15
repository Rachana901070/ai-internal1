export default function StatCard({label, value}){
  return (
    <div className="card" style={{textAlign:"center"}}>
      <div style={{color:"var(--muted)", fontSize:14}}>{label}</div>
      <div style={{fontSize:28, fontWeight:800}}>{value}</div>
    </div>
  );
}
