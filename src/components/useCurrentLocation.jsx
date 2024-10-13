import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Cache object to store processed location data
const locationCache = {};

function useCurrentLocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    speed: null, // Speed in km/h
    heading: null, // Heading (compass direction)
  });

  const updateLocationCache = useCallback((latitude, longitude, heading) => {
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`; // Use rounded values for better grouping

    // Check if the current location is already in the cache
    if (!locationCache[cacheKey]) {
      // Perform reverse geocoding or other data fetching only if the location is not cached
      fetchLocationData(latitude, longitude)
        .then((data) => {
          locationCache[cacheKey] = { data, timestamp: Date.now(), heading };
        })
        .catch((error) => console.error('Error fetching location data:', error));
    } else {
      // Use cached data to improve efficiency
      console.log('Using cached location data:', locationCache[cacheKey]);
    }
  }, []);

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
        },
      });
      return response.data.address; // Return the address data
    } catch (error) {
      console.error('Error fetching location data with Axios:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, heading } = position.coords;
        const speedInKmh = speed ? Math.floor(speed * 3.6) : null; // Convert from m/s to km/h

        // Update location state
        setLocation({
          latitude,
          longitude,
          speed: speedInKmh,
          heading: heading !== null ? heading : 'Unknown',
        });

        // Update cache with current location if not already cached
        updateLocationCache(latitude, longitude, heading);
      },
      (error) => console.error('Error fetching location:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId); // Clear geolocation on unmount
  }, [updateLocationCache]);

  return location;
}

export default useCurrentLocation;
