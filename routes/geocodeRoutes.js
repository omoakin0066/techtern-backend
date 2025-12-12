/**
 * Geocoding Routes - Third-party API Integration
 * Uses OpenStreetMap Nominatim for location services
 */

const express = require("express");
const router = express.Router();
const {
  geocodeLocation,
  reverseGeocode,
  searchLocations,
} = require("../services/geocodeService");

/**
 * @route   GET /api/geocode
 * @desc    Geocode a location string to coordinates
 * @access  Public
 * @query   location - Location string (e.g., "London, UK")
 */
router.get("/", async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location query parameter is required",
      });
    }

    const result = await geocodeLocation(location);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location geocoded successfully",
      source: "OpenStreetMap Nominatim API",
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during geocoding",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/geocode/reverse
 * @desc    Reverse geocode coordinates to location details
 * @access  Public
 * @query   lat - Latitude
 * @query   lon - Longitude
 */
router.get("/reverse", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Both lat and lon query parameters are required",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates. lat and lon must be numbers",
      });
    }

    const result = await reverseGeocode(latitude, longitude);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Location not found for coordinates",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reverse geocoding successful",
      source: "OpenStreetMap Nominatim API",
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during reverse geocoding",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/geocode/search
 * @desc    Search for locations/places
 * @access  Public
 * @query   q - Search query
 * @query   limit - Max results (default 5)
 */
router.get("/search", async (req, res) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query (q) parameter is required",
      });
    }

    const maxResults = parseInt(limit, 10) || 5;
    const result = await searchLocations(q, maxResults);

    res.status(200).json({
      success: true,
      message: "Location search successful",
      source: "OpenStreetMap Nominatim API",
      count: result.count,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during location search",
      error: error.message,
    });
  }
});

module.exports = router;
