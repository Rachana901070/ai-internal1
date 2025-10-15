import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import StatCard from "../components/StatCard.jsx";
import {
  getAdminAnalytics,
  getAdminDonations,
  getAdminFeedback,
  getAdminStats,
  getAdminUsers
} from "../services/adminService.js";

const TABS = [
  { key: "donations", label: "Food Posts" },
  { key: "users", label: "Users" },
  { key: "models", label: "AI Models" },
  { key: "analytics", label: "Analytics" },
  { key: "feedback", label: "Feedback" }
];

const AI_MODELS = [
  { name: "Supply-Demand Matcher v2", status: "Active", owner: "Core AI Team" },
  { name: "Spoilage Predictor", status: "Training", owner: "Research Guild" },
  { name: "Last-Mile ETA", status: "Ideation", owner: "Logistics Pod" }
];

function AdminContent() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");
  const [tabData, setTabData] = useState({
    donations: null,
    users: null,
    analytics: null,
    feedback: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const result = await getAdminStats();
        if (!ignore) {
          setStats(result);
          setStatsError("");
        }
      } catch (err) {
        if (!ignore) {
          setStatsError(err.message);
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (activeTab === "models" || tabData[activeTab]) {
      return;
    }
    let ignore = false;
    setLoading(true);
    setError("");
    const loadTabData = async () => {
      try {
        let result = null;
        switch (activeTab) {
          case "donations":
            result = await getAdminDonations();
            break;
          case "users":
            result = await getAdminUsers();
            break;
          case "analytics":
            result = await getAdminAnalytics();
            break;
          case "feedback":
            result = await getAdminFeedback();
            break;
          default:
            result = null;
        }
        if (!ignore) {
          setTabData(prev => ({ ...prev, [activeTab]: result }));
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTabData();
    return () => {
      ignore = true;
    };
  }, [activeTab, tabData]);

  const activeTabMeta = useMemo(
    () => TABS.find(tab => tab.key === activeTab),
    [activeTab]
  );

  const currentData = tabData[activeTab];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setError("");
  };

  const formatNumber = (value) =>
    typeof value === "number" ? value.toLocaleString() : value;

  const formatDateTime = (value) => {
    if (!value) return "Unknown time";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
  };

  const renderContent = () => {
    if (activeTab === "models") {
      return (
        <div style={{display:"grid", gap:12}}>
          {AI_MODELS.map(model => (
            <div key={model.name} className="card" style={{display:"grid", gap:4}}>
              <strong>{model.name}</strong>
              <span style={{color:"var(--muted)"}}>Status: {model.status}</span>
              <span style={{color:"var(--muted)"}}>Owner: {model.owner}</span>
            </div>
          ))}
        </div>
      );
    }

    if (loading && !currentData) {
      const label = activeTabMeta?.label.toLowerCase() || "data";
      return <p style={{color:"var(--muted)"}}>Loading {label}...</p>;
    }

    const errorBanner = error
      ? (
        <div className="card" style={{border:"1px solid #fecaca", background:"#fef2f2", color:"#b91c1c"}}>
          {error}
        </div>
      )
      : null;

    switch (activeTab) {
      case "donations": {
        const donations = currentData || [];
        if (!donations.length) {
          return (
            <div style={{display:"grid", gap:12}}>
              {errorBanner}
              <p style={{color:"var(--muted)"}}>No food posts yet.</p>
            </div>
          );
        }
        return (
          <div style={{display:"grid", gap:12}}>
            {errorBanner}
            {donations.map(donation => (
              <div key={donation._id} className="card" style={{display:"grid", gap:4}}>
                <strong>{donation.title}</strong>
                <span style={{color:"var(--muted)"}}>
                  Status: {donation.status} · Priority: {donation.priority}
                </span>
                {donation.donor && (
                  <span style={{color:"var(--muted)"}}>
                    Donor: {donation.donor.name} ({donation.donor.email})
                  </span>
                )}
                <small style={{color:"var(--muted)"}}>
                  Posted {formatDateTime(donation.createdAt)}
                </small>
              </div>
            ))}
          </div>
        );
      }
      case "users": {
        const users = currentData || [];
        if (!users.length) {
          return (
            <div style={{display:"grid", gap:12}}>
              {errorBanner}
              <p style={{color:"var(--muted)"}}>No users found.</p>
            </div>
          );
        }
        return (
          <div style={{display:"grid", gap:12}}>
            {errorBanner}
            {users.map(user => (
              <div key={user._id} className="card" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <strong>{user.name}</strong>
                  <div style={{color:"var(--muted)"}}>{user.email}</div>
                </div>
                <span style={{color:"var(--brand)", fontWeight:600}}>{(user.role || "unknown").toUpperCase()}</span>
              </div>
            ))}
          </div>
        );
      }
      case "analytics": {
        const analytics = currentData || { statusDistribution: {}, priorityBreakdown: {}, topTypes: [] };
        return (
          <div style={{display:"grid", gap:12}}>
            {errorBanner}
            <div className="card" style={{display:"grid", gap:8}}>
              <strong>Status distribution</strong>
              {Object.keys(analytics.statusDistribution).length ? (
                <ul style={{margin:0, paddingLeft:20, color:"var(--muted)"}}>
                  {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                    <li key={status}>{status}: {formatNumber(count)}</li>
                  ))}
                </ul>
              ) : (
                <p style={{color:"var(--muted)"}}>No status data available.</p>
              )}
            </div>
            <div className="card" style={{display:"grid", gap:8}}>
              <strong>Priority breakdown</strong>
              {Object.keys(analytics.priorityBreakdown).length ? (
                <ul style={{margin:0, paddingLeft:20, color:"var(--muted)"}}>
                  {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => (
                    <li key={priority}>{priority}: {formatNumber(count)}</li>
                  ))}
                </ul>
              ) : (
                <p style={{color:"var(--muted)"}}>No priority data available.</p>
              )}
            </div>
            <div className="card" style={{display:"grid", gap:8}}>
              <strong>Top donation types</strong>
              {analytics.topTypes?.length ? (
                <ul style={{margin:0, paddingLeft:20, color:"var(--muted)"}}>
                  {analytics.topTypes.map(item => (
                    <li key={item.type}>{item.type}: {formatNumber(item.count)}</li>
                  ))}
                </ul>
              ) : (
                <p style={{color:"var(--muted)"}}>No donation type data available.</p>
              )}
            </div>
          </div>
        );
      }
      case "feedback": {
        const feedback = currentData || [];
        if (!feedback.length) {
          return (
            <div style={{display:"grid", gap:12}}>
              {errorBanner}
              <p style={{color:"var(--muted)"}}>No feedback submitted yet.</p>
            </div>
          );
        }
        return (
          <div style={{display:"grid", gap:12}}>
            {errorBanner}
            {feedback.map(item => (
              <div key={item.id || item._id} className="card" style={{display:"grid", gap:4}}>
                <p style={{margin:0, color:"var(--muted)"}}>{item.message}</p>
                {item.rating && <small style={{color:"var(--brand)"}}>Rating: {item.rating}/5</small>}
              </div>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      {statsError && (
        <div className="card" style={{marginTop:12, border:"1px solid #fecaca", background:"#fef2f2", color:"#b91c1c"}}>
          Failed to load stats: {statsError}
        </div>
      )}
      {stats && (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, margin:"12px 0"}}>
          <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} />
          <StatCard label="Total Donations" value={formatNumber(stats.totalDonations)} />
          <StatCard label="Matches Recorded" value={formatNumber(stats.totalMatches)} />
          <StatCard label="Proofs Uploaded" value={formatNumber(stats.totalProofs)} />
        </div>
      )}
      <div className="card" style={{marginTop:12}}>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className="btn"
              onClick={() => handleTabChange(tab.key)}
              style={{
                background: activeTab === tab.key ? "var(--brand)" : "#fff",
                color: activeTab === tab.key ? "#fff" : "var(--brand)",
                borderColor: "var(--brand)"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{marginTop:20}}>
          {renderContent()}
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
