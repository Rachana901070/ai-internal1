export default function Privacy(){
  return (
    <div className="container" style={{display:"grid", gap:16}}>
      <h2>Privacy Policy</h2>
      <p style={{color:"var(--muted)"}}>
        We respect your privacy and handle data with care. This policy outlines how Maitri Dhatri collects,
        uses, stores, and protects the information provided by donors, collectors, and beneficiaries.
      </p>
      <div className="card" style={{display:"grid", gap:8}}>
        <h3>Information we collect</h3>
        <ul style={{margin:0, paddingLeft:20, color:"var(--muted)"}}>
          <li>Account details such as name, email, and role.</li>
          <li>Donation metadata including pickup addresses and expiry times.</li>
          <li>Collector performance metrics and proof-of-delivery records.</li>
        </ul>
      </div>
      <div className="card" style={{display:"grid", gap:8}}>
        <h3>How we use your data</h3>
        <p style={{color:"var(--muted)"}}>
          Data powers AI matching, real-time notifications, compliance reporting, and anonymized analytics that help us improve food
          redistribution outcomes.
        </p>
      </div>
    </div>
  );
}
