// Geolocation utilities for the ticket management system

/**
 * Get user's current position
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Calculate estimated travel time based on distance
 * @param {number} distance - Distance in kilometers
 * @param {string} mode - Travel mode ('walking', 'driving', 'transit')
 * @returns {number} Estimated time in minutes
 */
export const calculateTravelTime = (distance, mode = 'walking') => {
  const speeds = {
    walking: 5, // km/h
    driving: 30, // km/h (city driving)
    transit: 20 // km/h (public transport)
  };

  const speed = speeds[mode] || speeds.walking;
  const timeInHours = distance / speed;
  return Math.round(timeInHours * 60); // Convert to minutes
};

/**
 * Calculate wait time for ticket based on queue position and travel time
 * @param {number} queueLength - Number of people ahead in queue
 * @param {number} travelTime - Travel time in minutes
 * @returns {number} Estimated wait time in minutes
 */
export const calculateWaitTime = (queueLength, travelTime) => {
  const waitTimePerClient = 5; // 5 minutes per client
  const totalWaitTime = queueLength * waitTimePerClient;
  return Math.max(totalWaitTime - travelTime, 0);
};
