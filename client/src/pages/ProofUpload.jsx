export default function ProofUpload(){
  return (
    <div className="container">
      <h2>Proof of Delivery</h2>
      <div className="card" style={{marginTop:12}}>
        <div style={{fontWeight:700, marginBottom:10}}>Upload Delivery Proof</div>
        <div style={{height:6, background:"#e2e8f0", borderRadius:6, marginBottom:16}}>
          <div style={{width:"50%", height:"100%", background:"var(--brand)", borderRadius:6}}/>
        </div>
        <label>Upload Photos *</label>
        <div className="card" style={{border:"2px dashed #cbd5e1", boxShadow:"none"}}>
          <p style={{color:"var(--muted)"}}>Click to upload photos (max 5)</p>
        </div>
        <label style={{marginTop:12}}>Upload Video (Optional)</label>
        <div className="card" style={{border:"2px dashed #cbd5e1", boxShadow:"none"}}>
          <p style={{color:"var(--muted)"}}>Upload delivery video</p>
        </div>
        <label style={{marginTop:12}}>Current Location (Auto-detected) *</label>
        <input placeholder="Location will be auto-detected" style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}/>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:16}}>
          <button className="btn outline">Previous</button>
          <button className="btn">Next</button>
        </div>
      </div>
    </div>
  );
}
