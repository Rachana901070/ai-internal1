import { User, MapPin, CheckCircle, Lock, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="container" style={{
      display: "grid",
      gap: "2rem",
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Header Section */}
      <div style={{
        background: "linear-gradient(to bottom, #e0f2fe 0%, #ffffff 100%)",
        padding: "3rem 2rem",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "1rem"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#1f2937",
          margin: "0 0 0.5rem 0"
        }}>
          Privacy Policy
        </h1>
        <p style={{
          fontSize: "1.2rem",
          color: "#6b7280",
          margin: 0
        }}>
          Your trust matters to us. We handle your data responsibly and transparently.
        </p>
      </div>

      {/* Introduction Paragraph */}
      <p style={{
        color: "var(--muted)",
        fontSize: "1.1rem",
        lineHeight: "1.6",
        textAlign: "justify",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        We value your privacy and are committed to protecting your personal information. This policy describes how Maitri Dhatri collects, uses, stores, and safeguards the data you share with us.
      </p>

      {/* Sections Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "2rem"
      }}>
        {/* Section 1: Information We Collect */}
        <div className="card" style={{
          backgroundColor: "#f8fafc",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "grid",
          gap: "1rem",
          animation: "fadeIn 0.8s ease-in-out"
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#16a34a",
            margin: 0
          }}>
            Information We Collect
          </h3>
          <ul style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: "1.6"
          }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <User size={20} color="#16a34a" />
              Account details such as name, email, and role.
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <MapPin size={20} color="#16a34a" />
              Donation metadata including pickup address, quantity, and expiry time.
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={20} color="#16a34a" />
              Collector performance metrics and proof-of-delivery records.
            </li>
          </ul>
        </div>

        {/* Section 2: How We Use Your Data */}
        <div className="card" style={{
          backgroundColor: "#f8fafc",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "grid",
          gap: "1rem",
          animation: "fadeIn 0.8s ease-in-out 0.2s both"
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#16a34a",
            margin: 0
          }}>
            How We Use Your Data
          </h3>
          <p style={{
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: 0
          }}>
            We use your data to coordinate food donations, send notifications, maintain records, and improve the overall experience of our community members.
          </p>
        </div>

        {/* Section 3: Data Protection & Security */}
        <div className="card" style={{
          backgroundColor: "#f8fafc",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "grid",
          gap: "1rem",
          animation: "fadeIn 0.8s ease-in-out 0.4s both"
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#16a34a",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Lock size={24} color="#16a34a" />
            Data Protection & Security
          </h3>
          <p style={{
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: 0
          }}>
            We implement secure protocols, encrypted communication, and controlled access to protect your data from unauthorized use or disclosure.
          </p>
        </div>

        {/* Section 4: Your Rights */}
        <div className="card" style={{
          backgroundColor: "#f8fafc",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "grid",
          gap: "1rem",
          animation: "fadeIn 0.8s ease-in-out 0.6s both"
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#16a34a",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Shield size={24} color="#16a34a" />
            Your Rights
          </h3>
          <p style={{
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: 0
          }}>
            You can request access, correction, or deletion of your data at any time. We comply with data protection standards to ensure your privacy rights are respected.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div style={{
        textAlign: "center",
        padding: "1rem",
        borderTop: "1px solid #e5e7eb",
        marginTop: "2rem"
      }}>
        <p style={{
          fontSize: "0.9rem",
          color: "#9ca3af",
          margin: 0
        }}>
          For privacy-related questions, contact us at support@maitridhatri.org.
        </p>
      </div>

      {/* CSS for animations and responsiveness */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
            gap: 1.5rem;
          }
          .container > div:first-child h1 {
            font-size: 2rem;
          }
          .container > div:first-child p {
            font-size: 1rem;
          }
          .card {
            padding: 1.5rem;
          }
          .card h3 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
