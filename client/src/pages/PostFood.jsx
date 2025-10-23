import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation, updateDonation, classifyFood, listMyDonations } from "../services/donationService.js";
import { detectCurrentLocation } from "../services/locationService.js";

export default function PostFood(){
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    foodType: "",
    quantity: "",
    description: "",
    location: "",
    geo: { lat: null, lng: null },
    pickupTime: "",
    image: null,
    imagePreview: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));

      // AI classification
      setAiLoading(true);
      try {
        const result = await classifyFood(file);
        setForm(prev => ({ ...prev, foodType: result.foodType }));
        // Show toast notification instead of alert
        const toast = document.createElement("div");
        toast.textContent = `AI detected: ${result.foodType} 🍽️`;
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--brand);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 1000;
          font-weight: 600;
        `;
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      } catch (err) {
        console.error("AI classification failed:", err);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const removeImage = () => {
    setForm(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: form.foodType,
        type: form.foodType,
        quantity: parseInt(form.quantity.split(" ")[0]),
        unit: form.quantity.split(" ").slice(1).join(" ") || "servings",
        address: form.location,
        geo: form.geo,
        expiresAt: form.pickupTime ? new Date(form.pickupTime).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to 24 hours if not specified
        photo: form.image ? form.image.name : null
      };

      await createDonation(payload);
      alert("Food donation posted successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to post donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const posts = await listMyDonations();
        setMyPosts(posts.slice(0, 5)); // Show last 5 posts
      } catch (err) {
        console.error("Failed to fetch my posts:", err);
      }
    };
    fetchMyPosts();
  }, []);

  const handleEditDonation = (donation) => {
    setEditingDonation(donation);
    setForm({
      foodType: donation.type,
      quantity: `${donation.quantity} ${donation.unit}`,
      description: donation.description || "",
      location: donation.address,
      geo: donation.geo || { lat: null, lng: null },
      pickupTime: donation.expiresAt ? new Date(donation.expiresAt).toISOString().slice(0, 16) : "",
      image: null,
      imagePreview: donation.photo ? `http://localhost:5002/uploads/${donation.photo}` : null
    });
    setStep(1);
  };

  const handleUpdateDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: form.foodType,
        type: form.foodType,
        quantity: parseInt(form.quantity.split(" ")[0]),
        unit: form.quantity.split(" ").slice(1).join(" ") || "servings",
        address: form.location,
        geo: form.geo,
        expiresAt: form.pickupTime ? new Date(form.pickupTime).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        photo: form.image ? form.image.name : editingDonation.photo
      };

      await updateDonation(editingDonation._id, payload);
      alert("Donation updated successfully!");
      setEditingDonation(null);
      // Reset form
      setForm({
        foodType: "",
        quantity: "",
        description: "",
        location: "",
        geo: { lat: null, lng: null },
        pickupTime: "",
        image: null,
        imagePreview: null
      });
      // Refresh posts
      const posts = await listMyDonations();
      setMyPosts(posts.slice(0, 5));
      setStep(1);
    } catch (err) {
      setError("Failed to update donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAutoDetectLocation = async () => {
    setLocationLoading(true);
    try {
      const locationData = await detectCurrentLocation();
      setForm(prev => ({
        ...prev,
        location: locationData.address,
        geo: { lat: locationData.lat, lng: locationData.lng }
      }));

      // Show success toast
      const toast = document.createElement("div");
      toast.textContent = "Location detected successfully! 📍";
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        borderRadius: 8px;
        z-index: 1000;
        font-weight: 600;
      `;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error) {
      console.error("Location detection failed:", error);
      const toast = document.createElement("div");
      toast.textContent = error.message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        borderRadius: 8px;
        z-index: 1000;
        font-weight: 600;
      `;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <div className="container" style={{display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start"}}>
      <div>
        <h2>{editingDonation ? "Edit Donation" : "AI-Powered Food Posting"}</h2>
        <div className="card" style={{marginTop:12}}>
          {/* Progress Stepper */}
          <div style={{display: "flex", justifyContent: "center", marginBottom: 24}}>
            {[1, 2, 3].map(num => (
              <div key={num} style={{display: "flex", alignItems: "center"}}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: step >= num ? "var(--brand)" : "#e2e8f0",
                  color: step >= num ? "white" : "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  margin: "0 8px"
                }}>
                  {num}
                </div>
                {num < 3 && (
                  <div style={{
                    width: 60,
                    height: 2,
                    background: step > num ? "var(--brand)" : "#e2e8f0",
                    margin: "0 8px"
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{textAlign: "center", marginBottom: 20}}>
            <div style={{fontWeight:700, fontSize: 18, marginBottom: 4}}>
              Step {step} of 3: {step === 1 ? "Food Details" : step === 2 ? "Pickup Info" : "Confirm"}
            </div>
            <div style={{color: "var(--muted)", fontSize: 14}}>
              {step === 1 ? "Upload photo and basic details" : step === 2 ? "Set pickup location and time" : "Review and post your donation"}
            </div>
          </div>

          <form onSubmit={editingDonation ? handleUpdateDonation : handleSubmit}>
            {step === 1 && (
              <>
                <div style={{marginBottom: 20}}>
                  <label style={{display: "block", marginBottom: 8, fontWeight: 600}}>Upload Photo *</label>
                  {!form.imagePreview ? (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: 12,
                        padding: 40,
                        textAlign: "center",
                        cursor: "pointer",
                        background: "#f8fafc",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = "var(--brand)"}
                      onMouseLeave={(e) => e.target.style.borderColor = "#cbd5e1"}
                    >
                      <div style={{fontSize: 48, marginBottom: 16}}>📷</div>
                      <div style={{fontWeight: 600, marginBottom: 8}}>Click to upload or drag and drop</div>
                      <div style={{color: "var(--muted)", fontSize: 14}}>PNG, JPG up to 10 MB</div>
                    </div>
                  ) : (
                    <div style={{position: "relative", display: "inline-block"}}>
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        style={{width: "100%", maxWidth: 300, height: 200, objectFit: "cover", borderRadius: 12}}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          cursor: "pointer",
                          fontSize: 16
                        }}
                      >
                        ✕
                      </button>
                      {aiLoading && (
                        <div style={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          background: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: 6,
                          fontSize: 12
                        }}>
                          AI analyzing... 🤖
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{display: "none"}}
                  />
                </div>

                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
                  <div>
                    <label style={{display: "block", marginBottom: 8, fontWeight: 600}}>Food Type *</label>
                    <select
                      name="foodType"
                      value={form.foodType}
                      onChange={handleChange}
                      required
                      style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1", fontSize: 16}}
                    >
                      <option value="">Select food type</option>
                      <option value="Rice & Curry">Rice & Curry 🍛</option>
                      <option value="Bread & Sandwiches">Bread & Sandwiches 🥖</option>
                      <option value="Sweets">Sweets 🍰</option>
                      <option value="Fruits">Fruits 🍎</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display: "block", marginBottom: 8, fontWeight: 600}}>Quantity *</label>
                    <input
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 10 servings, 5 kg, 20 pieces"
                      required
                      style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1", fontSize: 16}}
                    />
                  </div>
                </div>
            </>
          )}

            {step === 2 && (
              <>
                <div style={{marginBottom:20}}>
                  <label style={{display: "block", marginBottom: 8, fontWeight: 600}}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the food (ingredients, preparation, etc.)"
                    rows={4}
                    style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1", fontSize: 16, resize: "vertical"}}
                  />
                </div>

                <div style={{display:"grid", gridTemplateColumns:"1fr", gap:16}}>
                  <div>
                    <label style={{display: "block", marginBottom: 8, fontWeight: 600}}>Location *</label>
                    <div style={{display: "flex", gap: 8}}>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Pickup location"
                        required
                        style={{flex: 1, padding:12, borderRadius:10, border:"1px solid #cbd5e1", fontSize: 16}}
                      />
                      <button
                        type="button"
                        className="btn outline"
                        style={{padding: "12px 16px", whiteSpace: "nowrap"}}
                        onClick={handleAutoDetectLocation}
                        disabled={locationLoading}
                      >
                        {locationLoading ? "Detecting..." : "📍 Auto-detect"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{display: "block", marginBottom: 8, fontWeight: 600}}>Pickup Time (Optional)</label>
                    <input
                      type="datetime-local"
                      name="pickupTime"
                      value={form.pickupTime}
                      onChange={handleChange}
                      style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1", fontSize: 16}}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div style={{textAlign:"center", padding:32}}>
                <h3>Review Your Donation</h3>
                <div style={{marginTop:16, textAlign:"left", background:"#f8fafc", padding:20, borderRadius:12, border: "1px solid #e2e8f0"}}>
                  <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                    <div>
                      <strong>Food Type:</strong> {form.foodType}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {form.quantity}
                    </div>
                    <div>
                      <strong>Location:</strong> {form.location}
                    </div>
                    <div>
                      <strong>Pickup Time:</strong> {form.pickupTime || "Not specified"}
                    </div>
                  </div>
                  {form.description && (
                    <div style={{marginTop: 16}}>
                      <strong>Description:</strong> {form.description}
                    </div>
                  )}
                  {form.imagePreview && (
                    <div style={{marginTop: 16}}>
                      <strong>Photo:</strong>
                      <img
                        src={form.imagePreview}
                        alt="Donation"
                        style={{width: "100%", maxWidth: 200, height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8}}
                      />
                    </div>
                  )}
                </div>
                {error && <div style={{color:"#dc2626", marginTop:16, padding: 12, background: "#fef2f2", borderRadius: 8}}>{error}</div>}
              </div>
            )}

            <div style={{marginTop:24, display:"flex", justifyContent:"space-between", gap: 12}}>
              {step > 1 && (
                <button type="button" className="btn outline" onClick={prevStep} style={{flex: 1}}>
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button type="button" className="btn" onClick={nextStep} style={{flex: 1, marginLeft: step > 1 ? 0 : "auto"}}>
                  Next
                </button>
              ) : (
                <>
                  {editingDonation && (
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => {
                        setEditingDonation(null);
                        setForm({
                          foodType: "",
                          quantity: "",
                          description: "",
                          location: "",
                          pickupTime: "",
                          image: null,
                          imagePreview: null
                        });
                        setStep(1);
                      }}
                      style={{flex: 1}}
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button type="submit" className="btn" disabled={loading} style={{flex: 1, marginLeft: "auto", cursor: loading ? "not-allowed" : "pointer"}}>
                    {loading ? (editingDonation ? "Updating..." : "Posting...") : (editingDonation ? "Update Donation" : "Post Donation")}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Side Summary Panel */}
      <div>
        <div className="card" style={{position: "sticky", top: 24}}>
          <h4 style={{marginBottom: 16}}>Your Posts</h4>
          {myPosts.length > 0 ? (
            myPosts.map(post => (
              <div key={post._id} style={{marginBottom: 12, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
                  <strong style={{fontSize: 14}}>{post.title}</strong>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    background: post.status === "OPEN" ? "#fef3c7" : post.status === "MATCHED" ? "#dbeafe" : "#f3f4f6",
                    color: post.status === "OPEN" ? "#92400e" : post.status === "MATCHED" ? "#1e40af" : "#374151"
                  }}>
                    {post.status === "OPEN" ? "⏳ Pending" : post.status === "MATCHED" ? "✅ Matched" : "🕓 Expired"}
                  </span>
                </div>
                <div style={{fontSize: 12, color: "var(--muted)", marginBottom: 4}}>
                  {post.quantity} {post.unit} • {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div style={{display: "flex", gap: 8}}>
                  <button
                    onClick={() => handleEditDonation(post)}
                    style={{fontSize: 12, padding: "4px 8px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer"}}
                  >
                    ✏️ Edit
                  </button>
                  <button style={{fontSize: 12, padding: "4px 8px", background: "transparent", border: "1px solid #dc2626", color: "#dc2626", borderRadius: 6, cursor: "pointer"}}>🗑️ Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign: "center", padding: 32, color: "var(--muted)"}}>
              No posts yet. Create your first donation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
