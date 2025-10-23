import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import StatCard from "../components/StatCard.jsx";
import DonationCard from "../components/DonationCard.jsx";
import FilterGroup from "../components/FilterGroup.jsx";
import { getAvailableDonations, getCollectorStats, getActivePickups, completePickup, acceptDonation, declineDonation } from "../services/donationService.js";

const Collector = () => {
  const navigate = useNavigate();

  // State for donations and stats
  const [available, setAvailable] = useState([]);   // donations OPEN
  const [active, setActive] = useState([]);         // pickups ACTIVE
  const [stats, setStats] = useState({
    todaysPickups: 0,
    totalCollections: 0,
    rating: 0,
    activePickups: 0
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationsLoading, setDonationsLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({ urgency: "all" });

  // Live feed and previous donations for notifications
  const [liveFeed, setLiveFeed] = useState(true);
  const [previousDonations, setPreviousDonations] = useState([]);



  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

  // Check for success message from proof upload
  if (location.state?.message) {
    toast.success(location.state.message);
    // Refresh stats immediately after proof upload
    fetchCollectorData();
    // Clear the state to prevent re-showing
    window.history.replaceState({}, document.title);
  }
  }, []);

  // No location auto-detection needed

  // Fetch data and set up intervals
  useEffect(() => {
    fetchCollectorData();
    fetchActivePickups();

    const interval = setInterval(() => {
      fetchCollectorData();
      fetchActivePickups();
    }, liveFeed ? 15000 : 60000);

    // Interval to remove expired donations from state
    const expiryInterval = setInterval(() => {
      setAvailable(prev => prev.filter(donation => new Date(donation.expiresAt) > new Date()));
    }, 300000); // Every 5 minutes

    return () => {
      clearInterval(interval);
      clearInterval(expiryInterval);
    };
  }, [filters, liveFeed]);



  // No user profile loading needed

  // No location update handling needed

  // Fetch donations and stats
  const fetchCollectorData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.urgency !== "all") {
        params.urgency = filters.urgency;
      }
      const donationsData = await getAvailableDonations(params);

      const statsData = await getCollectorStats();

      setAvailable(donationsData || []);
      setStats(statsData || {
        todaysPickups: 0,
        totalCollections: 0,
        rating: 0,
        activePickups: 0
      });

      // Notify about new donations if live feed is active
      if (liveFeed && previousDonations.length > 0) {
        const newDonations = donationsData.filter(
          (d) => !previousDonations.some((pd) => pd._id === d._id)
        );

        if (newDonations.length > 0) {
          const message = `New donation${newDonations.length > 1 ? 's' : ''} available!`;
          toast.success(message);

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Donation Available', {
              body: `${newDonations.length} new donation${newDonations.length > 1 ? 's' : ''} in your area!`,
              icon: '/favicon.ico'
            });
          }
        }
      }

      setPreviousDonations(donationsData || []);
    } catch (err) {
      setError("Failed to load collector data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch active pickups
  const fetchActivePickups = async () => {
    try {
      const pickups = await getActivePickups();
      setActive(pickups || []);
    } catch (err) {
      console.error("Failed to load active pickups:", err);
      setActive([]);
      setError("Failed to load active pickups");
    }
  };

  // Handle accepting a donation
  async function onAccept(donation) {
    // optimistic: move from available → active placeholder
    const donor = donation;
    setAvailable(prev => prev.filter(x => x._id !== donation._id));
    setActive(prev => [{ _id: `temp-${donation._id}`, donationId: donation._id, donation: donor, status: "ACCEPTED", optimistic: true }, ...prev]);

    try {
      const data = await acceptDonation(donation._id);
      // Replace optimistic card with server response
      setActive(prev => prev.map(p => p._id === `temp-${donation._id}` ? {
        _id: data._id,
        donation: {
          _id: data._id,
          title: data.title,
          quantity: `${data.quantity} ${data.unit}`,
          location: data.address,
          donor: { name: data.donor?.name || "Unknown" },
          tags: [data.type]
        },
        acceptedAt: data.acceptedAt,
        createdAt: data.createdAt
      } : p));
      toast.success("Pickup accepted");
    } catch (e) {
      console.error("Accept donation failed:", e);
      // rollback
      setActive(prev => prev.filter(p => p._id !== `temp-${donation._id}`));
      setAvailable(prev => [donor, ...prev]);
      toast.error(e?.response?.data?.message || "Failed to accept");
    }
  }

  // Handle completing a pickup
  const handleCompletePickup = async (matchId) => {
    try {
      await completePickup(matchId);
      fetchActivePickups();
      fetchCollectorData(); // Refresh stats
      toast.success("Pickup completed successfully!");
    } catch (err) {
      toast.error("Failed to complete pickup");
    }
  };

  // Handle declining a donation
  async function onDecline(donationId) {
    // optimistic: hide from available
    const donor = available.find(x => x._id === donationId);
    setAvailable(prev => prev.filter(x => x._id !== donationId));

    try {
      await declineDonation(donationId);
      toast.success("Order declined");
      // optional: no-op (already removed). For safety, refetch once in background:
      // refetchAvailable({ silent:true });
    } catch (e) {
      // rollback if API failed
      setAvailable(prev => [donor, ...prev]);
      toast.error(e?.response?.data?.message || "Decline failed");
    }
  }



  // Update filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };



  // Error state
  if (error) {
    return (
      <div className="container">
        <div style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Toaster position="top-right" />
      {/* Welcome Message */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          border: "1px solid #0ea5e9",
          padding: 20,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0c4a6e", margin: 0 }}>
          Welcome back, Collector!
        </h3>
        <p style={{ fontSize: 14, color: "#0c4a6e", margin: "8px 0 0 0" }}>
          Here's your dashboard overview. Stay updated with available donations and manage your pickups efficiently.
        </p>
      </div>



      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937" }}>Collector Dashboard</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: liveFeed ? "#10b981" : "#6b7280",
                animation: liveFeed ? "pulse 2s infinite" : "none"
              }}
            ></div>
            <span style={{ fontSize: 14, color: "#4b5563", fontWeight: 500 }}>Live Feed</span>
          </div>
          <button
            type="button"
            onClick={() => setLiveFeed(!liveFeed)}
            style={{
              padding: "6px 12px",
              fontSize: 12,
              border: "1px solid #d1d5db",
              borderRadius: 6,
              background: liveFeed ? "#fef2f2" : "#f0fdf4",
              color: liveFeed ? "#dc2626" : "#16a34a",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            {liveFeed ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          margin: "20px 0"
        }}
      >
        <StatCard label="Today's Pickups" value={stats.todaysPickups.toString()} />
        <StatCard label="Total Collections" value={stats.totalCollections.toString()} />
        <StatCard label="Rating" value={`${stats.rating.toFixed(1)} ★`} />
        <StatCard label="Active Pickups" value={active.length.toString()} />
      </div>

      {/* Active Pickups Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Active Pickups</h3>
        {active.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {active.map((pickup) => (
              <div key={pickup._id} className="card">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700, fontSize:18}}>{pickup.donation.title}</div>
                    <div style={{color:"var(--muted)", marginTop:4}}>{pickup.donation.quantity}</div>
                    <div style={{color:"var(--muted)", fontSize:14, marginTop:4}}>
                      Accepted at: {new Date(pickup.acceptedAt).toLocaleString()}
                    </div>
                    <div style={{marginTop:8}}>
                      <strong>Donor:</strong> {pickup.donation.donor.name}
                    </div>
                    <div style={{marginTop:4}}>
                      <strong>Location:</strong> {pickup.donation.location}
                    </div>
                    <div style={{marginTop:8, display:"flex", gap:4, flexWrap:"wrap"}}>
                      {pickup.donation.tags?.map(tag => (
                        <span key={tag} style={{
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                          padding: "2px 6px",
                          borderRadius: 8,
                          fontSize: 12
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8}}>
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24
                    }}>
                      🍽️
                    </div>
                  </div>
                </div>
                  <div style={{display:"flex", gap:8, marginTop:16, justifyContent:"center"}}>
                    <button
                      className="btn"
                      style={{flex:1, backgroundColor: "#10b981"}}
                      onClick={() => navigate(`/proof-upload?donationId=${pickup.donation._id}`)}
                    >
                      Upload Proof
                    </button>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: 40,
              color: "var(--muted)"
            }}
          >
            No active pickups at the moment
          </div>
        )}
      </div>

      {/* Filters and Donations */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        <FilterGroup onFilterChange={handleFilterChange} />
        <div>
          <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600, color: "#1f2937" }}>
            Available Food Donations
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {donationsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: 20,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 16
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: "#e5e7eb",
                      borderRadius: "50%",
                      animation: "pulse 1.5s ease-in-out infinite"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: 16,
                        background: "#e5e7eb",
                        borderRadius: 4,
                        marginBottom: 8,
                        animation: "pulse 1.5s ease-in-out infinite"
                      }}
                    />
                    <div
                      style={{
                        height: 12,
                        background: "#e5e7eb",
                        borderRadius: 4,
                        width: "60%",
                        animation: "pulse 1.5s ease-in-out infinite"
                      }}
                    />
                  </div>
                </div>
              ))
            ) : available.length > 0 ? (
              available.map((donation) => (
                <DonationCard
                  key={donation._id}
                  donation={donation}
                  onAccept={() => onAccept(donation)}
                  onDecline={() => onDecline(donation._id)}
                />
              ))
            ) : (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "var(--muted)",
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
                }}
              >
                No available donations at the moment
                <button
                  type="button"
                  onClick={() => {
                    setDonationsLoading(true);
                    fetchCollectorData().finally(() => setDonationsLoading(false));
                  }}
                  style={{
                    marginTop: 16,
                    padding: "8px 16px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* AI Insights Section */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600, color: "#1f2937" }}>
          AI Insights
        </h3>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            border: "1px solid #0ea5e9",
            padding: 20
          }}
        >
          <div style={{ fontSize: 16, color: "#0c4a6e", fontWeight: 500 }}>
            💡 AI suggests focusing on high-urgency donations nearby (≤2km). Based on your collection patterns, you can optimize routes to reduce travel time by 15%.
          </div>
        </div>
      </div>


    </div>
  );
};

export default Collector;
