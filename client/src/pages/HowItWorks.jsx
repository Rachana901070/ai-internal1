const steps = [
  {
    title: "Post surplus food",
    description: "Donors quickly share available meals with quantity, freshness, and pickup window."
  },
  {
    title: "AI matches collectors",
    description: "Our AI suggests the best collector based on proximity, capacity, and reliability."
  },
  {
    title: "Seamless pickup",
    description: "Collectors coordinate pickup and delivery to nearby shelters and communities."
  }
];

const impact = [
  { metric: "28k+", label: "Meals redistributed" },
  { metric: "5.2 tons", label: "Food waste prevented" },
  { metric: "92%", label: "Pickup success rate" }
];

export default function HowItWorks(){
  return (
    <div className="container" style={{display:"grid", gap:32}}>
      <section>
        <h2>How Maitri Dhatri Works</h2>
        <p style={{color:"var(--muted)"}}>A transparent journey from donation to delivery with AI-guided logistics.</p>
        <div style={{display:"grid", gap:16, marginTop:20}}>
          {steps.map(step => (
            <div key={step.title} className="card" style={{display:"grid", gap:6}}>
              <strong>{step.title}</strong>
              <span style={{color:"var(--muted)"}}>{step.description}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>Impact so far</h3>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16}}>
          {impact.map(item => (
            <div key={item.label} className="card" style={{textAlign:"center"}}>
              <div style={{fontSize:32, fontWeight:800, color:"var(--brand)"}}>{item.metric}</div>
              <div style={{color:"var(--muted)"}}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
