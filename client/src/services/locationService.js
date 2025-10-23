export async function detectCurrentLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use Nominatim for reverse geocoding (free, no API key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;

            // Build full address: street, area, city, state, pincode, country
            const addressParts = [];
            if (address.house_number) addressParts.push(address.house_number);
            if (address.road) addressParts.push(address.road);
            if (address.neighbourhood || address.suburb) addressParts.push(address.neighbourhood || address.suburb);
            if (address.city || address.town || address.village) addressParts.push(address.city || address.town || address.village);
            if (address.state) addressParts.push(address.state);
            if (address.postcode) addressParts.push(address.postcode);
            if (address.country) addressParts.push(address.country);

            const fullAddress = addressParts.filter(part => part).join(", ");

            resolve({
              lat: latitude,
              lng: longitude,
              address: fullAddress || data.display_name // Fallback to display_name if parsing fails
            });
          } else {
            throw new Error("No geocoding results found");
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          // Fallback to coordinates only
          resolve({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        }
      },
      async (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Unable to detect location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            // Try IP-based location as fallback
            try {
              const ipLocation = await getLocationFromIP();
              resolve(ipLocation);
              return;
            } catch (ipError) {
              console.error("IP-based location also failed:", ipError);
              errorMessage = "Location information is unavailable. Please check your GPS settings or enter location manually.";
            }
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

export async function getLocationFromIP() {
  try {
    // Use ipapi.co for IP-based geolocation (free, no API key required)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.latitude && data.longitude) {
      const { latitude, longitude, city, region, country_name, postal } = data;

      // Build address from IP data
      const addressParts = [];
      if (city) addressParts.push(city);
      if (region) addressParts.push(region);
      if (postal) addressParts.push(postal);
      if (country_name) addressParts.push(country_name);

      const fullAddress = addressParts.join(", ") || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      return {
        lat: latitude,
        lng: longitude,
        address: fullAddress
      };
    } else {
      throw new Error("IP geolocation failed");
    }
  } catch (error) {
    console.error("IP geolocation error:", error);
    throw new Error("Unable to detect location via IP");
  }
}
