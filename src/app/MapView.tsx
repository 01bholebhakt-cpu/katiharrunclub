
"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Position = [number, number];

function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function FollowLocation({
  position,
}: {
  position: Position | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 16));
    }
  }, [position, map]);

  return null;
}

export default function MapView() {
  const katihar: Position = [25.538, 87.570];

  const [position, setPosition] = useState<Position | null>(null);
  const [route, setRoute] = useState<Position[]>([]);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [message, setMessage] = useState("Ready to run");
  const [gpsReady, setGpsReady] = useState(false);

  const watchId = useRef<number | null>(null);
  const timerId = useRef<number | null>(null);
  const lastPosition = useRef<Position | null>(null);
  const distanceRef = useRef(0);

  function getDistance(a: Position, b: Position) {
    const R = 6371000;
    const rad = (n: number) => (n * Math.PI) / 180;
    const dLat = rad(b[0] - a[0]);
    const dLon = rad(b[1] - a[1]);

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a[0])) *
        Math.cos(rad(b[0])) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function stopGPS() {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (timerId.current !== null) {
      window.clearInterval(timerId.current);
      timerId.current = null;
    }
  }

  function startRun() {
    if (!navigator.geolocation) {
      setMessage("GPS is not supported by this browser.");
      return;
    }

    if (running) return;

    setRoute([]);
    setDistance(0);
    distanceRef.current = 0;
    lastPosition.current = null;
    setSeconds(0);
    setRunning(true);
    setGpsReady(false);
    setMessage("Waiting for GPS signal...");

    timerId.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    watchId.current = navigator.geolocation.watchPosition(
      (result) => {
        const next: Position = [
          result.coords.latitude,
          result.coords.longitude,
        ];

        setPosition(next);
        setGpsReady(true);
        setMessage("GPS connected · Activity recording");

        if (lastPosition.current === null) {
          lastPosition.current = next;
          setRoute([next]);
          return;
        }

        const meters = getDistance(lastPosition.current, next);

        // Ignore tiny movements and unusually large GPS jumps.
        if (meters >= 3 && meters <= 100) {
          distanceRef.current += meters;
          setDistance(distanceRef.current);
          lastPosition.current = next;
          setRoute((previous) => [...previous, next]);
        } else if (meters > 100) {
          lastPosition.current = next;
        }
      },
      (error) => {
        const errors: Record<number, string> = {
          1: "Location permission denied. Allow location access in your browser.",
          2: "GPS unavailable. Try moving outdoors.",
          3: "GPS timed out. Please try again.",
        };

        setMessage(errors[error.code] || "Unable to access GPS.");
        stopGPS();
        setRunning(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 20000,
      }
    );
  }

  function finishRun() {
    stopGPS();
    setRunning(false);

    setMessage(
      distanceRef.current > 0
        ? "Activity finished! Check your summary below."
        : "Activity stopped. No distance recorded."
    );
  }

  useEffect(() => {
    return () => stopGPS();
  }, []);

  const km = distance / 1000;
  const paceSeconds = km > 0 ? seconds / km : 0;

  const pace =
    km > 0
      ? `${Math.floor(paceSeconds / 60)}:${String(
          Math.floor(paceSeconds % 60)
        ).padStart(2, "0")}`
      : "--:--";

  const time = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(
    Math.floor((seconds % 3600) / 60)
  ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const stats = [
    { label: "DISTANCE", value: `${km.toFixed(2)} km` },
    { label: "DURATION", value: time },
    { label: "PACE", value: `${pace} /km` },
  ];

  return (
    <div style={{ color: "#f5f5f5", width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              background: "#151a20",
              border: "1px solid #30363c",
              borderRadius: 12,
              padding: "14px 8px",
              textAlign: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#a0a8b2",
                marginBottom: 8,
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#ff6b2c",
                overflowWrap: "anywhere",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          height: 420,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #30363c",
        }}
      >
        <MapContainer
          center={katihar}
          zoom={14}
          scrollWheelZoom
          style={{
            width: "100%",
            height: "100%",
            background: "#10151a",
          }}
        >
          <FixMapSize />
          <FollowLocation position={position} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={katihar}
            radius={7}
            pathOptions={{
              color: "#090b0f",
              weight: 3,
              fillColor: "#ff6b2c",
              fillOpacity: 1,
            }}
          >
            <Popup>Katihar, Bihar</Popup>
          </CircleMarker>

          {route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "#ff6b2c",
                weight: 5,
              }}
            />
          )}

          {position && (
            <CircleMarker
              center={position}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#2787ff",
                fillOpacity: 1,
              }}
            >
              <Popup>Your current location</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: "#151a20",
          border: "1px solid #30363c",
          borderRadius: 10,
          fontSize: 13,
          color: gpsReady ? "#70e0a0" : "#c0c6ce",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: gpsReady ? "#70e0a0" : "#ff6b2c",
            marginRight: 8,
          }}
        />
        {message}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button
          onClick={startRun}
          disabled={running}
          style={{
            flex: 1,
            padding: 14,
            border: 0,
            borderRadius: 10,
            background: running ? "#42474e" : "#ff6b2c",
            color: "#ffffff",
            fontWeight: 800,
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "RUNNING..." : "START RUN"}
        </button>

        <button
          onClick={finishRun}
          disabled={!running}
          style={{
            flex: 1,
            padding: 14,
            border: "1px solid #42474e",
            borderRadius: 10,
            background: "#20262d",
            color: "#ffffff",
            fontWeight: 800,
            cursor: running ? "pointer" : "not-allowed",
          }}
        >
          FINISH
        </button>
      </div>

      <p
        style={{
          fontSize: 11,
          color: "#929aa4",
          lineHeight: 1.6,
          marginTop: 12,
        }}
      >
        GPS tracking requires location permission and an HTTPS connection.
        Keep this page open during your activity. Activities are not yet
        saved to an account or shared with a leaderboard.
      </p>
    </div>
  );
}

