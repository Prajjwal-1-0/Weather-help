import React from 'react';
import './MapView.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ position, location }) => {
  const [map, setMap] = React.useState(null);

  React.useEffect(() => {
    if (map && position) {
      map.flyTo(position, 13);
    }
  }, [map, position]);

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      className="map"
      whenCreated={setMap}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <Marker position={position}>
          <Popup>
            {location.name}
            <br />
            Temperature: {location.temperature}°C
            <br />
            Weather: {location.weather}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

const MapView = ({ location }) => {
  const position = location?.coordinates || [51.505, -0.09]; // Default to London

  return (
    <div className="map-container">
      <MapComponent position={position} location={location} />
    </div>
  );
};

export default MapView;
