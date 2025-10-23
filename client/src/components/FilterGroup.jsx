import { useState, useEffect } from "react";

const URGENCY_OPTIONS = [
  { value: "all", label: "All Levels" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

export default function FilterGroup({ onFilterChange }) {
  const [urgency, setUrgency] = useState("all");

  useEffect(() => {
    onFilterChange && onFilterChange({ urgency });
  }, [urgency, onFilterChange]);

  return (
    <aside
      className="card"
      style={{
        display: "grid",
        gap: 16,
        alignSelf: "flex-start",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Filters</h3>

      <div>
        <label style={{ fontWeight: 600, display: "block", marginBottom: 8, color: "#374151" }}>
          Urgency Filter
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {URGENCY_OPTIONS.map((option) => (
            <label key={option.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="radio"
                name="urgency"
                value={option.value}
                checked={urgency === option.value}
                onChange={(e) => setUrgency(e.target.value)}
                style={{ accentColor: "#10b981" }}
              />
              <span style={{ fontSize: 14, color: "#4b5563" }}>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
