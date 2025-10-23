import api from "./api.js";

export async function listDonations(params = {}) {
  const { data } = await api.get("/donations", { params });
  return data;
}

export async function createDonation(payload) {
  const { data } = await api.post("/donations", payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return data;
}

export async function updateDonation(id, payload) {
  const { data } = await api.patch(`/donations/${id}`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return data;
}

export async function deleteDonation(id) {
  const { data } = await api.delete(`/donations/${id}`);
  return data;
}

export async function getAvailableDonations(params = {}) {
  try {
    const { data } = await api.get("/donations/available", { params });
    return data;
  } catch (error) {
    // Return mock data if API fails
    return [
      {
        _id: "1",
        title: "Rice & Curry",
        quantity: "20 servings",
        timeLeft: "1.5 hours",
        distance: "0.8 km",
        priority: "high",
        donor: { name: "John Doe" },
        location: "Downtown",
        tags: ["Rice", "Curry"],
        status: "OPEN"
      },
      {
        _id: "2",
        title: "Fresh Bread",
        quantity: "15 loaves",
        timeLeft: "2 hours",
        distance: "1.2 km",
        priority: "medium",
        donor: { name: "Jane Smith" },
        location: "Market Street",
        tags: ["Bread", "Fresh"],
        status: "OPEN"
      }
    ];
  }
}

export async function acceptDonation(donationId, collectorId) {
  const payload = collectorId ? { collectorId } : {};
  const { data } = await api.patch(`/donations/${donationId}/accept`, payload);
  return data;
}

export async function classifyFood(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const { data } = await api.post("/donations/ai/classifyFood", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function listMyDonations() {
  const { data } = await api.get("/donations/mine");
  return data;
}

export async function getCollectorStats() {
  try {
    const { data } = await api.get("/collectors/stats");
    return data;
  } catch (error) {
    // Return default stats if API fails
    return {
      todaysPickups: 0,
      totalCollections: 0,
      rating: 0,
      activePickups: 0
    };
  }
}

export async function getActivePickups() {
  try {
    const { data } = await api.get("/donations/active/my");
    return data;
  } catch (error) {
    console.error("Failed to fetch active pickups:", error);
    // Return empty array if API fails
    return [];
  }
}

export async function completePickup(matchId) {
  const { data } = await api.patch(`/matches/${matchId}/complete`);
  return data;
}



export async function declineDonation(donationId) {
  const { data } = await api.patch(`/donations/${donationId}/decline`);
  return data;
}

export async function reportDonationIssue(donationId, issueDetails) {
  const { data } = await api.post(`/donations/${donationId}/report-issue`, issueDetails, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return data;
}


