import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createProof } from "../services/proofService.js";
import { detectCurrentLocation } from "../services/locationService.js";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EXIF from 'exif-js';
import imageCompression from 'browser-image-compression';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ProofUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
  const [locationLoading, setLocationLoading] = useState(false);
  const [manualLocationMode, setManualLocationMode] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [inputMode, setInputMode] = useState("address"); // "address" or "coordinates"

  // Refs
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const mapRef = useRef(null);

  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!donationId) {
      // Don't redirect, just skip location detection
      return;
    }
    // Auto-detect location on mount
    handleAutoDetectLocation();
  }, [donationId, navigate]);

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (photos.length === 0) {
        newErrors.photos = "At least one photo is required";
      } else if (photos.length > 5) {
        newErrors.photos = "Maximum 5 photos allowed";
      }
    }

    if (currentStep === 2) {
      if (video && video.size > 50 * 1024 * 1024) {
        newErrors.video = "Video must be less than 50MB";
      }
    }

    if (currentStep === 3) {
      if (!location.lat || !location.lng) {
        newErrors.location = "Location is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAutoDetectLocation = async () => {
    setLocationLoading(true);
    try {
      const locationData = await detectCurrentLocation();
      setLocation({
        lat: locationData.lat,
        lng: locationData.lng,
        address: locationData.address
      });
      setErrors(prev => ({ ...prev, location: undefined }));
      setManualLocationMode(false); // Hide manual input if auto-detection succeeds
    } catch (error) {
      console.error("Location detection failed:", error);
      setErrors(prev => ({ ...prev, location: error.message }));
      setManualLocationMode(true); // Show manual input option on failure
    } finally {
      setLocationLoading(false);
    }
  };

  const readEXIF = (file) => {
    return new Promise((resolve) => {
      EXIF.getData(file, function() {
        const lat = EXIF.getTag(this, "GPSLatitude");
        const lng = EXIF.getTag(this, "GPSLongitude");
        const takenAt = EXIF.getTag(this, "DateTimeOriginal");

        let latDecimal = null;
        let lngDecimal = null;
        let timestamp = null;

        if (lat && lng) {
          latDecimal = lat[0] + lat[1]/60 + lat[2]/3600;
          lngDecimal = lng[0] + lng[1]/60 + lng[2]/3600;

          // Check GPS reference for negative values
          const latRef = EXIF.getTag(this, "GPSLatitudeRef");
          const lngRef = EXIF.getTag(this, "GPSLongitudeRef");

          if (latRef === "S") latDecimal = -latDecimal;
          if (lngRef === "W") lngDecimal = -lngDecimal;
        }

        if (takenAt) {
          // Parse EXIF datetime format: "2023:10:23 14:30:15"
          const dateStr = takenAt.replace(/:/g, '-').replace(' ', 'T');
          timestamp = new Date(dateStr + 'Z').toISOString();
        }

        resolve({
          lat: latDecimal,
          lng: lngDecimal,
          takenAt: timestamp,
          source: latDecimal && lngDecimal ? 'exif' : 'device'
        });
      });
    });
  };

  const compressImage = async (file) => {
    if (file.size <= 2 * 1024 * 1024) return file; // Skip compression for small files

    const options = {
      maxSizeMB: 8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      preserveExif: true
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Image compression failed:", error);
      return file;
    }
  };

  const handlePhotoSelect = async (files) => {
    const maxFiles = 5;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (photos.length + files.length > maxFiles) {
      setErrors({ photos: `Maximum ${maxFiles} photos allowed` });
      return;
    }

    const newPhotos = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setErrors({ photos: "Only JPG, JPEG, and PNG files are allowed" });
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        setErrors({ photos: "Each photo must be less than 8MB" });
        return;
      }

      try {
        // Compress image
        const compressedFile = await compressImage(file);

        // Read EXIF data
        const exifData = await readEXIF(compressedFile);

        // Create image element to get dimensions
        const img = new Image();
        const dimensions = await new Promise((resolve) => {
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.src = URL.createObjectURL(compressedFile);
        });

        // Use device location if no EXIF GPS
        let finalLat = exifData.lat;
        let finalLng = exifData.lng;
        let source = exifData.source;

        if (!finalLat && location.lat) {
          finalLat = location.lat;
          finalLng = location.lng;
          source = 'fallback';
        }

        newPhotos.push({
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          name: compressedFile.name,
          size: compressedFile.size,
          mime: compressedFile.type,
          width: dimensions.width,
          height: dimensions.height,
          lat: finalLat,
          lng: finalLng,
          takenAt: exifData.takenAt,
          source
        });
      } catch (error) {
        console.error("Error processing photo:", error);
        setErrors({ photos: "Failed to process photo" });
        return;
      }
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    setErrors(prev => ({ ...prev, photos: undefined }));
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/mov', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ video: "Only MP4, MOV, and WebM videos are allowed" });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrors({ video: "Video must be less than 50MB" });
      return;
    }

    setVideo({
      file,
      name: file.name,
      size: file.size,
      mime: file.type,
      preview: URL.createObjectURL(file)
    });
    setErrors(prev => ({ ...prev, video: undefined }));
  };

  const removeVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.preview);
      setVideo(null);
    }
  };

  const handleManualLocationSubmit = async () => {
    if (inputMode === "address") {
      if (!manualAddress.trim()) {
        setErrors(prev => ({ ...prev, location: "Please enter an address" }));
        return;
      }

      setLocationLoading(true);
      try {
        // Use Nominatim for forward geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualAddress)}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          setLocation({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
            address: display_name
          });
          setErrors(prev => ({ ...prev, location: undefined }));
          setManualLocationMode(false);
        } else {
          throw new Error("Address not found. Please try a different address.");
        }
      } catch (error) {
        console.error("Manual location geocoding failed:", error);
        setErrors(prev => ({ ...prev, location: error.message || "Failed to geocode address. Please try again." }));
      } finally {
        setLocationLoading(false);
      }
    } else {
      // Coordinate mode
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);

      if (isNaN(lat) || isNaN(lng)) {
        setErrors(prev => ({ ...prev, location: "Please enter valid coordinates" }));
        return;
      }

      if (lat < -90 || lat > 90) {
        setErrors(prev => ({ ...prev, location: "Latitude must be between -90 and 90" }));
        return;
      }

      if (lng < -180 || lng > 180) {
        setErrors(prev => ({ ...prev, location: "Longitude must be between -180 and 180" }));
        return;
      }

      setLocationLoading(true);
      try {
        // Reverse geocode to get address
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();

        const address = data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        setLocation({
          lat,
          lng,
          address
        });
        setErrors(prev => ({ ...prev, location: undefined }));
        setManualLocationMode(false);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        // Still set coordinates even if reverse geocoding fails
        setLocation({
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
        setErrors(prev => ({ ...prev, location: undefined }));
        setManualLocationMode(false);
      } finally {
        setLocationLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Add photos
      photos.forEach((photo, index) => {
        formData.append('photos', photo.file);
      });

      // Add video if exists
      if (video) {
        formData.append('video', video.file);
      }

      // Add metadata
      formData.append('donationId', donationId);
      formData.append('location', location.address);
      formData.append('lat', location.lat.toString());
      formData.append('lng', location.lng.toString());

      const result = await createProof(formData, (progress) => {
        setUploadProgress(progress);
      });

      // Success - navigate back to collector with success message
      navigate('/collector', {
        state: {
          message: 'Proof uploaded successfully! Pickup marked as completed.',
          type: 'success'
        }
      });

    } catch (err) {
      console.error("Upload failed:", err);
      setError(err?.response?.data?.message || "Failed to upload proof. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const getProgressPercentage = () => {
    let completed = 0;
    const total = 4;

    if (photos.length >= 1) completed++;
    if (video || true) completed++; // Video is optional
    if (location.lat && location.lng) completed++;
    if (step === 4) completed++;

    return Math.round((completed / total) * 100);
  };

  if (!donationId) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <h2>Proof of Delivery</h2>
          <div style={{ fontSize: 48, margin: "20px 0" }}>📦</div>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>
            To upload proof of delivery, you need to select an active pickup from the Collector Dashboard.
          </p>
          <button
            className="btn"
            onClick={() => navigate('/collector')}
            style={{ padding: "12px 24px" }}
          >
            Go to Collector Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Proof of Delivery</h2>

      {/* Progress Bar */}
      <div className="card" style={{ marginTop: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>Upload Progress</div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>{getProgressPercentage()}% Complete</div>
        </div>
        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 8 }}>
          <div
            style={{
              width: `${getProgressPercentage()}%`,
              height: "100%",
              background: "var(--brand)",
              borderRadius: 8,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        {/* Step Indicator */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          {[1, 2, 3, 4].map(num => (
            <div key={num} style={{ display: "flex", alignItems: "center" }}>
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
              {num < 4 && (
                <div style={{
                  width: 40,
                  height: 2,
                  background: step > num ? "var(--brand)" : "#e2e8f0",
                  margin: "0 8px"
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
            Step {step} of 4: {
              step === 1 ? "Upload Photos" :
              step === 2 ? "Add Video (Optional)" :
              step === 3 ? "Confirm Location" :
              "Review & Submit"
            }
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            {step === 1 ? "Upload 1-5 photos of the delivery" :
             step === 2 ? "Add a short video if needed" :
             step === 3 ? "Verify delivery location" :
             "Review all details before submitting"}
          </div>
        </div>

        {/* Step 1: Photos */}
        {step === 1 && (
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Upload Photos * (1-5 required)
            </label>

            {/* Photo Upload Area */}
            <div
              onClick={() => photoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handlePhotoSelect(Array.from(e.dataTransfer.files));
              }}
              style={{
                border: "2px dashed #cbd5e1",
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                cursor: "pointer",
                background: "#f8fafc",
                transition: "all 0.3s ease",
                marginBottom: 16
              }}
              onMouseEnter={(e) => e.target.style.borderColor = "var(--brand)"}
              onMouseLeave={(e) => e.target.style.borderColor = "#cbd5e1"}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Click to upload or drag and drop photos
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                JPG, PNG up to 8MB each (max 5 photos)
              </div>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={(e) => handlePhotoSelect(Array.from(e.target.files))}
              style={{ display: "none" }}
            />

            {/* Photo Thumbnails */}
            {photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, marginBottom: 16 }}>
                {photos.map((photo, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0"
                      }}
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        cursor: "pointer",
                        fontSize: 12
                      }}
                    >
                      ✕
                    </button>
                    <div style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {(photo.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.photos && (
              <div style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                {errors.photos}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Video */}
        {step === 2 && (
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Upload Video (Optional)
            </label>

            {!video ? (
              <div
                onClick={() => videoInputRef.current?.click()}
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
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎥</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  Click to upload delivery video
                </div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>
                  MP4, MOV, WebM up to 50MB
                </div>
              </div>
            ) : (
              <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                <video
                  src={video.preview}
                  controls
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0"
                  }}
                />
                <button
                  onClick={removeVideo}
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
                  {(video.size / 1024 / 1024).toFixed(1)}MB
                </div>
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              style={{ display: "none" }}
            />

            {errors.video && (
              <div style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                {errors.video}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Delivery Location *
            </label>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <input
                  value={location.address}
                  readOnly
                  placeholder="Location will be auto-detected"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 16,
                    marginBottom: 8
                  }}
                />
                {location.lat && location.lng && (
                  <div style={{
                    fontSize: 14,
                    color: "#6b7280",
                    padding: 8,
                    background: "#f8fafc",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0"
                  }}>
                    📍 Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={handleAutoDetectLocation}
                  disabled={locationLoading}
                  style={{ padding: "10px 20px" }}
                >
                  {locationLoading ? "Detecting..." : "🔄 Refresh Location"}
                </button>
              </div>

              {/* Manual Location Input */}
              {manualLocationMode && (
                <div style={{ marginTop: 16, padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 600, marginBottom: 12, color: "#374151" }}>
                    Enter Location Manually
                  </div>

                  {/* Input Mode Toggle */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button
                      type="button"
                      onClick={() => setInputMode("address")}
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 6,
                        border: inputMode === "address" ? "2px solid var(--brand)" : "1px solid #cbd5e1",
                        background: inputMode === "address" ? "#e0f2fe" : "white",
                        color: inputMode === "address" ? "var(--brand)" : "#374151",
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      📍 Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode("coordinates")}
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 6,
                        border: inputMode === "coordinates" ? "2px solid var(--brand)" : "1px solid #cbd5e1",
                        background: inputMode === "coordinates" ? "#e0f2fe" : "white",
                        color: inputMode === "coordinates" ? "var(--brand)" : "#374151",
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      📌 Coordinates
                    </button>
                  </div>

                  {inputMode === "address" ? (
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                          placeholder="Enter address (e.g., New York, NY or full address)"
                          style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 16
                          }}
                        />
                        <button
                          type="button"
                          className="btn"
                          onClick={handleManualLocationSubmit}
                          disabled={locationLoading || !manualAddress.trim()}
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          {locationLoading ? "Searching..." : "Find Location"}
                        </button>
                      </div>
                      <div style={{ fontSize: 14, color: "#6b7280" }}>
                        Enter a city, address, or landmark to find your location
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <input
                          type="number"
                          step="any"
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          placeholder="Latitude (e.g., 40.7128)"
                          style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 16
                          }}
                        />
                        <input
                          type="number"
                          step="any"
                          value={manualLng}
                          onChange={(e) => setManualLng(e.target.value)}
                          placeholder="Longitude (e.g., -74.0060)"
                          style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 16
                          }}
                        />
                        <button
                          type="button"
                          className="btn"
                          onClick={handleManualLocationSubmit}
                          disabled={locationLoading || !manualLat.trim() || !manualLng.trim()}
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          {locationLoading ? "Setting..." : "Set Location"}
                        </button>
                      </div>
                      <div style={{ fontSize: 14, color: "#6b7280" }}>
                        Enter precise coordinates (latitude, longitude)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Map Preview */}
            {location.lat && location.lng && (
              <div style={{ height: 300, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>Delivery Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            {errors.location && (
              <div style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                {errors.location}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <h3>Review Your Proof of Delivery</h3>

            <div style={{
              background: "#f8fafc",
              padding: 20,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              textAlign: "left",
              marginTop: 16
            }}>
              <div style={{ marginBottom: 16 }}>
                <strong>Photos:</strong> {photos.length} uploaded
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #e2e8f0"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <strong>Video:</strong> {video ? "Uploaded" : "None"}
              </div>

              <div style={{ marginBottom: 16 }}>
                <strong>Location:</strong> {location.address}
              </div>

              <div style={{ marginBottom: 16 }}>
                <strong>Coordinates:</strong> {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
              </div>
            </div>

            {error && (
              <div style={{
                color: "#dc2626",
                marginTop: 16,
                padding: 12,
                background: "#fef2f2",
                borderRadius: 8
              }}>
                {error}
              </div>
            )}

            {uploadProgress > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 14, marginBottom: 8 }}>Uploading... {uploadProgress}%</div>
                <div style={{ height: 6, background: "#e2e8f0", borderRadius: 6 }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: "var(--brand)",
                    borderRadius: 6,
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 24 }}>
          {step > 1 && (
            <button
              type="button"
              className="btn outline"
              onClick={prevStep}
              style={{ flex: 1 }}
              disabled={loading}
            >
              Previous
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              className="btn"
              onClick={nextStep}
              style={{ flex: 1, marginLeft: step > 1 ? 0 : "auto" }}
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={handleSubmit}
              disabled={loading || photos.length === 0 || !location.lat}
              style={{
                flex: 1,
                marginLeft: "auto",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? `Uploading... ${uploadProgress}%` : "Submit Proof"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
