import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const TABS = ["Food Posts", "Users", "AI Models", "Analytics", "Feedback"];

function AdminContent() {
  const [activeTab, setActiveTab] = useState("Food Posts");

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <div className="card" style={{marginTop:12}}>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          {TABS.map(tab => (
            <button
              key={tab}
              className="btn"
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "var(--brand)" : "#fff",
                color: activeTab === tab ? "#fff" : "var(--brand)",
                borderColor: "var(--brand)"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{marginTop:20}}>
          <h3 style={{marginBottom:8}}>{activeTab}</h3>
          <p style={{color:"var(--muted)"}}>Admin tools for managing {activeTab.toLowerCase()} will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default function Admin(){
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminContent />
    </ProtectedRoute>
  );
}
