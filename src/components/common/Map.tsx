import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/map.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create a custom icon for the barbershop
const barbershopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="18" r="16" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <path d="M13 12h14M13 16h14M13 20h14M13 24h14" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 34l-4 4h8l-4-4" fill="#3B82F6"/>
      <path d="M15 15c0 1.5-1.5 3-3 3s-3-1.5-3-3 1.5-3 3-3 3 1.5 3 3zM31 15c0 1.5-1.5 3-3 3s-3-1.5-3-3 1.5-3 3-3 3 1.5 3 3z" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 38],
  popupAnchor: [0, -35]
});

// Fallback to default marker if custom icon fails to load
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface MapProps {
  position: [number, number]; // [latitude, longitude]
  address: string;
  shopName: string;
}

export default function Map({ position, address, shopName }: MapProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      // Force a resize to ensure the map renders correctly
      window.dispatchEvent(new Event('resize'));
      // Reset the view to the current position
      mapRef.current.setView(position, 15);
    }
  }, [position]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        ref={mapRef}
        center={position} 
        zoom={15} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={position}
          radius={100}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.1,
            weight: 1
          }}
        />
        <Marker position={position} icon={barbershopIcon}>
          <Popup className="custom-popup">
            <div className="text-center p-2">
              <h3 className="font-bold text-lg mb-2">{shopName}</h3>
              <p className="text-gray-600 mb-2">{address}</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </button>
                <button 
                  onClick={() => window.open(`tel:${encodeURIComponent('+1234567890')}`, '_blank')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} 