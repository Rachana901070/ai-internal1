export default function PostFood(){
  return (
    <div className="container">
      <h2>Post Food Donation</h2>
      <div className="card" style={{marginTop:12}}>
        <div style={{fontWeight:700, marginBottom:10}}>AI-Powered Food Posting</div>
        <div style={{height:6, background:"#e2e8f0", borderRadius:6, marginBottom:16}}>
          <div style={{width:"25%", height:"100%", background:"var(--brand)", borderRadius:6}}/>
        </div>

        <label>Upload Photo *</label>
        <div className="card" style={{border:"2px dashed #cbd5e1", boxShadow:"none"}}>
          <p style={{color:"var(--muted)"}}>Click to upload or drag and drop</p>
          <small>PNG, JPG up to 10MB</small>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:16}}>
          <div>
            <label>Food Type *</label>
            <select style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}>
              <option>Select food type</option><option>Rice & Curry</option><option>Snacks</option>
            </select>
          </div>
          <div>
            <label>Quantity *</label>
            <input placeholder="e.g., 20 servings" style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}/>
          </div>
        </div>

        <div style={{marginTop:16, display:"flex", justifyContent:"space-between"}}>
          <button className="btn outline">Previous</button>
          <button className="btn">Next</button>
        </div>
      </div>
    </div>
  );
}
