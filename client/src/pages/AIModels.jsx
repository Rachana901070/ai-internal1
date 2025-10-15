import Badge from "../components/Badge.jsx";

const models = [
  {
    name: "Supply-Demand Matcher v2",
    description: "Scores collector suitability using travel time, capacity, and reliability signals.",
    status: "Active"
  },
  {
    name: "Spoilage Predictor",
    description: "Estimates remaining shelf life to prioritize urgent pickups.",
    status: "Training"
  }
];

export default function AIModels(){
  return (
    <div className="container">
      <h2>AI Models</h2>
      <p style={{color:"var(--muted)"}}>Transparency into the intelligence powering food rescue logistics.</p>
      <div style={{display:"grid", gap:12, marginTop:16}}>
        {models.map(model => (
          <div key={model.name} className="card" style={{display:"grid", gap:6}}>
            <strong>{model.name}</strong>
            <span style={{color:"var(--muted)"}}>{model.description}</span>
            <Badge label={model.status} tone={model.status === "Active" ? "success" : "warning"} />
          </div>
        ))}
      </div>
    </div>
  );
}
