/**
 * Geocoding Service using OpenStreetMap Nominatim API
 * Third-party API integration for location coordinates
 * Free, open-access service - no API key required
 */

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

/**
 * Geocode a location string to get coordinates
 * @param {string} location - Location string (e.g., "London, UK")
 * @returns {Promise<Object>} - { lat, lon, displayName, address }
 */
const geocodeLocation = async (location) => {
  try {
    const encodedLocation = encodeURIComponent(location);
    const url = `${NOMINATIM_BASE_URL}/search?q=${encodedLocation}&format=json&addressdetails=1&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TechTern-Internship-Platform/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Location not found",
        data: null,
      };
    }

    const result = data[0];
    return {
      success: true,
      data: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        address: result.address,
        boundingBox: result.boundingbox,
        type: result.type,
        importance: result.importance,
      },
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

/**
 * Reverse geocode coordinates to get location details
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Location details
 */
const reverseGeocode = async (lat, lon) => {
  try {
    const url = `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TechTern-Internship-Platform/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        message: data.error,
        data: null,
      };
    }

    return {
      success: true,
      data: {
        displayName: data.display_name,
        address: data.address,
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
      },
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

/**
 * Search for places/locations
 * @param {string} query - Search query
 * @param {number} limit - Max results (default 5)
 * @returns {Promise<Object>} - Array of location results
 */
const searchLocations = async (query, limit = 5) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${NOMINATIM_BASE_URL}/search?q=${encodedQuery}&format=json&addressdetails=1&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TechTern-Internship-Platform/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Location search API error: ${response.status}`);
    }

    const data = await response.json();

    const locations = data.map((item) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      displayName: item.display_name,
      address: item.address,
      type: item.type,
      importance: item.importance,
    }));

    return {
      success: true,
      count: locations.length,
      data: locations,
    };
  } catch (error) {
    console.error("Location search error:", error.message);
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
};

module.exports = {
  geocodeLocation,
  reverseGeocode,
  searchLocations,
};
