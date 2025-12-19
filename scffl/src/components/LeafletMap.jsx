"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LeafletMap = ({ hubs }) => {
  const avgLat = hubs.reduce((s, h) => s + h.lat, 0) / hubs.length;
  const avgLon = hubs.reduce((s, h) => s + h.lon, 0) / hubs.length;

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <MapContainer center={[avgLat, avgLon]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {hubs.map((hub, idx) => (
          <Marker key={idx} position={[hub.lat, hub.lon]}>
            <Popup>
              <strong>{hub.hub_name}</strong>
              <br />
              Items: {hub.items}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
