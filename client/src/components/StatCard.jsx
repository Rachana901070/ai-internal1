const getIcon = (label) => {
  switch (label) {
    case "Today's Pickups":
      return "🚚";
    case "Total Collections":
      return "📦";
    case "Rating":
      return "⭐";
    case "Active Pickups":
      return "⏰";
    default:
      return "📊";
  }
};

export default function StatCard({ label, value }) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{getIcon(label)}</div>
      <div style={{ color: "var(--muted)", fontSize: 14, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#1f2937" }}>{value}</div>
    </div>
  );
}
