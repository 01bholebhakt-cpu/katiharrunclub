
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

export default function MapView() {
  const katihar: [number, number] = [25.538, 87.570];

  return (
    <div style={{ width: "100%", height: "420px", borderRadius: "12px", overflow: "hidden", border: "1px solid #30363c" }}>
      <MapContainer
        center={katihar}
        zoom={14}
        scrollWheelZoom
        style={{ width: "100%", height: "100%", background: "#10151a" }}
      >
        <FixMapSize />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={katihar}
          radius={8}
          pathOptions={{ color: "#090b0f", weight: 3, fillColor: "#ff6b2c", fillOpacity: 1 }}
        >
          <Popup>Katihar, Bihar</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
