import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SensoryEvent, SensoryVenue } from '../types';

const customEventIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customVenueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  events: SensoryEvent[];
  venues: SensoryVenue[];
  selectedItem?: SensoryEvent | SensoryVenue | null;
  onSelectEvent?: (event: SensoryEvent) => void;
  onSelectVenue?: (venue: SensoryVenue) => void;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export const MapComponent: React.FC<MapProps> = ({
  events,
  venues,
  selectedItem,
  onSelectEvent,
  onSelectVenue
}) => {
  const defaultCenter: [number, number] = [39.7392, -104.9903]; // Denver

  let center: [number, number] = defaultCenter;
  
  if (selectedItem) {
    if ('metadata' in selectedItem && selectedItem.metadata.location?.geo?.coordinates) {
      center = [
        selectedItem.metadata.location.geo.coordinates[1],
        selectedItem.metadata.location.geo.coordinates[0]
      ];
    } else if ('location' in selectedItem && selectedItem.location?.geo?.coordinates) {
      center = [
        selectedItem.location.geo.coordinates[1],
        selectedItem.location.geo.coordinates[0]
      ];
    }
  }

  return (
    <div className="w-full h-[450px] md:h-[550px] rounded-xl overflow-hidden border border-slate-200 shadow-xs relative z-0">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedItem && (
          <RecenterMap lat={center[0]} lng={center[1]} />
        )}

        {/* Event Markers */}
        {events.map((evt) => {
          const coords = evt.metadata?.location?.geo?.coordinates;
          if (!coords || coords.length < 2) return null;
          const lat = coords[1];
          const lng = coords[0];

          return (
            <Marker
              key={evt._id}
              position={[lat, lng]}
              icon={customEventIcon}
              eventHandlers={{
                click: () => onSelectEvent && onSelectEvent(evt)
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded mb-1">
                    EVENT
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{evt.metadata.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{evt.metadata.location.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-medium">
                      🔊 {evt.sensoryProfile.noiseLevel?.value || 'Low'} Noise
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-medium">
                      💡 {evt.sensoryProfile.lighting?.value || 'Natural'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Venue Markers */}
        {venues.map((ven) => {
          const coords = ven.location?.geo?.coordinates;
          if (!coords || coords.length < 2) return null;
          const lat = coords[1];
          const lng = coords[0];

          return (
            <Marker
              key={ven._id}
              position={[lat, lng]}
              icon={customVenueIcon}
              eventHandlers={{
                click: () => onSelectVenue && onSelectVenue(ven)
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded mb-1">
                    VENUE
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{ven.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{ven.location.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ven.sensoryProfile.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
