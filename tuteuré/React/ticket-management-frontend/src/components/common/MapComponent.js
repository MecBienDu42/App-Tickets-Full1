import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ agencies = [], userLocation = null, selectedAgency = null, onAgencySelect }) => {
  const [map, setMap] = useState(null);

  // Default center (can be adjusted based on your location)
  const defaultCenter = [14.6937, -17.4441]; // Dakar, Senegal
  const center = userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter;

  useEffect(() => {
    if (map && selectedAgency) {
      map.setView([selectedAgency.latitude, selectedAgency.longitude], 15);
    }
  }, [map, selectedAgency]);

  // Custom icon for agencies
  const agencyIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Custom icon for user location
  const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzQjgyRjYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Votre position</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Agency markers */}
        {agencies.map((agency) => (
          <Marker
            key={agency.id}
            position={[agency.latitude, agency.longitude]}
            icon={agencyIcon}
            eventHandlers={{
              click: () => onAgencySelect && onAgencySelect(agency)
            }}
          >
            <Popup>
              <div className="min-w-48">
                <h3 className="font-semibold text-lg mb-2">{agency.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{agency.address}</p>
                {agency.phone && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Tél:</strong> {agency.phone}
                  </p>
                )}
                {userLocation && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Distance: {calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        agency.latitude,
                        agency.longitude
                      ).toFixed(1)} km
                    </p>
                  </div>
                )}
                {onAgencySelect && (
                  <button
                    onClick={() => onAgencySelect(agency)}
                    className="mt-2 w-full bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Sélectionner cette agence
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Helper function to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export default MapComponent;
