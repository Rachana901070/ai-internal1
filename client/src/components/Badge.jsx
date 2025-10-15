export default function Badge({ label, tone = "default" }) {
  const tones = {
    default: { background: "#fff", color: "var(--brand)" },
    success: { background: "#dcfce7", color: "var(--brand)" },
    warning: { background: "#fef9c3", color: "#ca8a04" }
  };

  const style = tones[tone] || tones.default;

  return (
    <span className="badge" style={{ background: style.background, color: style.color }}>
      <span className="dot" />
      {label}
    </span>
  );
}
