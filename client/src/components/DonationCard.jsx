import { useState } from "react";

const calculateTimeLeft = (expiresAt) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires - now;

  if (diffMs <= 0) return "Expired";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}.${Math.round((diffMins / 60) * 10)} hours left`;
  } else {
    return `${diffMins} minutes left`;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "#dc2626";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getPriorityMessage = (priority) => {
  switch (priority) {
    case "high":
      return "Food expires soon. Immediate pickup recommended.";
    case "medium":
      return "Pickup within 2 hours advised.";
    case "low":
      return "Available all day.";
    default:
      return "";
  }
};

export default function DonationCard({ donation, onAccept, onDecline }) {
  const [showPreview, setShowPreview] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  const handleAccept = async () => {
    if (accepting) return;
    setAccepting(true);
    try {
      if (onAccept) await onAccept();
    } finally {
      setAccepting(false);
    }
  };



  const handleDecline = async () => {
    if (declining) return;
    setDeclining(true);
    try {
      if (onDecline) await onDecline();
    } finally {
      setDeclining(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const openMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donation.location)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <>
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          position: "relative"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1f2937" }}>
              {donation.title} — {donation.quantity}
            </div>
            <div style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>
              {calculateTimeLeft(donation.expiresAt)} • {donation.distance || "0.8 km away"}
            </div>
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  backgroundColor: getPriorityColor(donation.priority),
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                {donation.priority} priority
              </span>
            </div>
            <div style={{ marginTop: 8, fontSize: 14 }}>
              <strong>Source:</strong> {donation.donor?.name || "Unknown Donor"}
            </div>
            <div style={{ marginTop: 4, fontSize: 14 }}>
              <strong>Pickup Location:</strong>{" "}
              <span
                style={{ color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}
                onClick={openMaps}
              >
                {donation.location || "Not specified"}
              </span>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {donation.tags?.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    padding: "4px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}
            >
              🍽️
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                animation: "pulse 2s infinite"
              }}
            ></div>
          </div>
        </div>

        {/* Status Bar */}
        <div
          style={{
            marginTop: 16,
            padding: "8px 12px",
            backgroundColor: getPriorityColor(donation.priority),
            color: "white",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            textAlign: "center"
          }}
        >
          {getPriorityMessage(donation.priority)}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            className="btn"
            style={{ flex: 1, backgroundColor: "#10b981", borderColor: "#10b981" }}
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting ? "Accepting..." : "Accept Pickup"}
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={handleDecline}
            disabled={declining}
          >
            {declining ? "Declining..." : "Decline"}
          </button>
          <button type="button" className="btn outline" onClick={handlePreview}>
            Preview
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: 500,
              maxHeight: "80vh",
              overflowY: "auto",
              background: "white"
            }}
          >
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h3>Food Details</h3>
              <button type="button" onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                {donation.title}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Quantity:</strong> {donation.quantity}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Time Left:</strong> {calculateTimeLeft(donation.expiresAt)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Donor:</strong> {donation.donor?.name || "Unknown"}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Location:</strong> {donation.location || "Not specified"}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Tags:</strong> {donation.tags?.join(", ") || "None"}
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>Priority:</strong> {donation.priority}
              </div>
              <button
                type="button"
                className="btn"
                style={{ width: "100%", backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
                onClick={openMaps}
              >
                View on Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
