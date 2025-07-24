import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from '../../services/apiService';
import { calculateDistance, calculateTravelTime } from '../../utils/geolocation';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different types
const createCustomIcon = (color, type) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${type}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const agencyIcon = createCustomIcon('#3B82F6', 'A');
const clientIcon = createCustomIcon('#EF4444', 'C');
const userIcon = createCustomIcon('#10B981', 'U');

// Component to handle map updates
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [map, center, zoom]);
  
  return null;
};

const AdvancedMapComponent = ({ 
  tickets = [], 
  agencies = [], 
  showUserLocation = true,
  onLocationSelect,
  height = '400px',
  interactive = true 
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [travelTimes, setTravelTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();

  // Default center (Dakar, Senegal)
  const defaultCenter = [
    parseFloat(process.env.REACT_APP_DEFAULT_LAT) || 14.6937,
    parseFloat(process.env.REACT_APP_DEFAULT_LNG) || -17.4441
  ];

  // Get user's current location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.warn('Could not get user location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, [showUserLocation]);

  // Calculate travel times for tickets
  const calculateTravelTimes = async () => {
    if (!userLocation || tickets.length === 0) return;
    
    setLoading(true);
    const times = {};
    
    for (const ticket of tickets) {
      if (ticket.client?.latitude && ticket.client?.longitude) {
        try {
          const response = await apiService.calculateTravelTime({
            origin_lat: userLocation[0],
            origin_lng: userLocation[1],
            dest_lat: ticket.client.latitude,
            dest_lng: ticket.client.longitude
          });
          times[ticket.id] = response.travel_time;
        } catch (error) {
          // Fallback to simple distance calculation
          const distance = calculateDistance(
            userLocation[0], userLocation[1],
            ticket.client.latitude, ticket.client.longitude
          );
          times[ticket.id] = calculateTravelTime(distance);
        }
      }
    }
    
    setTravelTimes(times);
    setLoading(false);
  };

  useEffect(() => {
    calculateTravelTimes();
  }, [userLocation, tickets]);

  // Handle map click for location selection
  const handleMapClick = (e) => {
    if (onLocationSelect && interactive) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    }
  };

  // Get map center based on available data
  const getMapCenter = () => {
    if (userLocation) return userLocation;
    if (agencies.length > 0) {
      const agency = agencies[0];
      return [agency.latitude, agency.longitude];
    }
    if (tickets.length > 0 && tickets[0].client) {
      return [tickets[0].client.latitude, tickets[0].client.longitude];
    }
    return defaultCenter;
  };

  return (
    <div className="relative">
      <MapContainer
        center={getMapCenter()}
        zoom={13}
        style={{ height, width: '100%' }}
        ref={mapRef}
        onClick={handleMapClick}
      >
        <MapUpdater center={getMapCenter()} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-green-600">Votre position</h3>
                <p className="text-sm text-gray-600">
                  Lat: {userLocation[0].toFixed(6)}<br/>
                  Lng: {userLocation[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Agency markers */}
        {agencies.map((agency) => (
          <Marker
            key={`agency-${agency.id}`}
            position={[agency.latitude, agency.longitude]}
            icon={agencyIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-blue-600">{agency.name}</h3>
                <p className="text-sm text-gray-600">{agency.address}</p>
                <p className="text-sm text-gray-500">{agency.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Client/Ticket markers */}
        {tickets.map((ticket) => {
          if (!ticket.client?.latitude || !ticket.client?.longitude) return null;
          
          return (
            <Marker
              key={`ticket-${ticket.id}`}
              position={[ticket.client.latitude, ticket.client.longitude]}
              icon={clientIcon}
              eventHandlers={{
                click: () => setSelectedTicket(ticket)
              }}
            >
              <Popup>
                <div className="text-center min-w-[200px]">
                  <h3 className="font-semibold text-red-600">
                    Ticket #{ticket.numero_ticket}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Type:</strong> {ticket.type}</p>
                    <p><strong>Statut:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        ticket.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.statut}
                      </span>
                    </p>
                    {ticket.client && (
                      <div className="mt-2 pt-2 border-t">
                        <p><strong>Client:</strong> {ticket.client.prenom} {ticket.client.nom}</p>
                        {ticket.client.telephone && (
                          <p><strong>Tél:</strong> {ticket.client.telephone}</p>
                        )}
                      </div>
                    )}
                    {travelTimes[ticket.id] && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-green-600">
                          <strong>Temps de trajet:</strong> {travelTimes[ticket.id]} min
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-2 right-2 bg-white px-3 py-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Calcul des trajets...</span>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-2 left-2 bg-white p-3 rounded-lg shadow-md">
        <h4 className="font-semibold text-sm mb-2">Légende</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Agences</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Clients</span>
          </div>
          {showUserLocation && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Votre position</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedMapComponent;
