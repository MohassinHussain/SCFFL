"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet"


const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const HubsPage = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHubs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/get_optimized_hubs");
      const data = await res.json();
      setHubs(data.hubs || []);
    } catch (err) {
      console.error("Error fetching hubs:", err);
    } finally {
      setLoading(false);
    }
  };

  const avgLat = hubs.length ? hubs.reduce((s, h) => s + h.lat, 0) / hubs.length : 17.4;
  const avgLon = hubs.length ? hubs.reduce((s, h) => s + h.lon, 0) / hubs.length : 78.4;


  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-white">🏢 Delivery Hubs</h2>

      <button
        onClick={fetchHubs}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        {loading ? "Loading..." : "Show Hubs"}
      </button>

      {hubs.length > 0 && (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                <tr>
                  <th className="px-6 py-3">Cluster</th>
                  <th className="px-6 py-3">Hub Name</th>
                  <th className="px-6 py-3">Latitude</th>
                  <th className="px-6 py-3">Longitude</th>
                  <th className="px-6 py-3">Items</th>
                </tr>
              </thead>
              <tbody>
                {hubs.map((hub, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-white">{hub.cluster}</td>
                    <td className="px-6 py-4 font-semibold text-white">{hub.hub_name}</td>
                    <td className="px-6 py-4">{hub.lat.toFixed(4)}</td>
                    <td className="px-6 py-4">{hub.lon.toFixed(4)}</td>
                    <td className="px-6 py-4">{hub.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Map */}
          <div className="h-[500px] w-full rounded-xl overflow-hidden">
            <MapContainer center={[avgLat, avgLon]} zoom={10} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              {hubs.map((hub, idx) => (
                <Marker key={idx} position={[hub.lat, hub.lon]} icon={redIcon}>
                  <Popup>
                    <strong>{hub.hub_name}</strong>
                    <br />
                    Items: {hub.items}
                  </Popup>
                </Marker>

              ))}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default HubsPage;
