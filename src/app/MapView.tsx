
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
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

function FollowLocation({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 16));
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
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [activityType, setActivityType] = useState<"run" | "walk">("run");
  const [saving, setSaving] = useState(false);

  const watchId = useRef<number | null>(null);
  const timerId = useRef<number | null>(null);
  const lastPosition = useRef<Position | null>(null);
  const distanceRef = useRef(0);
  const secondsRef = useRef(0);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();

      if (watchId.current !== null) {
        navigator.geolocation?.clearWatch(watchId.current);
      }
      if (timerId.current !== null) {
        window.clearInterval(timerId.current);
      }
    };
  }, []);

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

  async function authenticate() {
    setAuthBusy(true);
    setAuthMessage("");

    try {
      const result =
        authMode === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;

      if (authMode === "signup" && !result.data.session) {
        setAuthMessage(
          "Account created. Check your email to confirm, then log in."
        );
      } else {
        setUser(result.data.user);
        setAuthMessage("You are logged in!");
      }
    } catch (error) {
      setAuthMessage(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setAuthMessage("Logged out.");
  }

  function startRun() {
    if (!user) {
      setMessage("Please log in before recording an activity.");
      return;
    }

    if (!navigator.geolocation) {
      setMessage("GPS is not supported by this browser.");
      return;
    }

    if (running) return;

    setRoute([]);
    setDistance(0);
    distanceRef.current = 0;
    lastPosition.current = null;
    secondsRef.current = 0;
    setSeconds(0);
    setRunning(true);
    setGpsReady(false);
    setMessage("Waiting for GPS signal...");

    timerId.current = window.setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
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
          1: "Location permission denied. Allow browser location access.",
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

  async function finishRun() {
    stopGPS();
    setRunning(false);

    const meters = Math.round(distanceRef.current);
    const duration = secondsRef.current;

    if (!user) {
      setMessage("Please log in to save your activity.");
      return;
    }

    if (meters <= 0 || duration <= 0) {
      setMessage("No activity saved. Record some distance first.");
      return;
    }

    setSaving(true);
    setMessage("Saving activity...");

    try {
      const { error } = await supabase.from("activities").insert({
        user_id: user.id,
        activity_type: activityType,
        distance_meters: meters,
        duration_seconds: duration,
      });

      if (error) throw error;

      setMessage(
        `Activity saved! ${(meters / 1000).toFixed(2)} km recorded.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Could not save: ${error.message}`
          : "Could not save activity."
      );
    } finally {
      setSaving(false);
    }
  }

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

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: 12,
    background: "#10151a",
    color: "#fff",
    border: "1px solid #42474e",
    borderRadius: 8,
    marginTop: 8,
  };

  return (
    <div style={{ color: "#f5f5f5", width: "100%" }}>
      <div
        style={{
          background: "#151a20",
          border: "1px solid #30363c",
          borderRadius: 12,
          padding: 16,
          marginBottom: 14,
        }}
      >
        {user ? (
          <>
            <p style={{ marginTop: 0 }}>
              Logged in as <strong>{user.email}</strong>
            </p>
            <button
              onClick={logout}
              style={{
                padding: "9px 14px",
                background: "#30363c",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              LOG OUT
            </button>
          </>
        ) : (
          <>
            <h3 style={{ marginTop: 0 }}>
              {authMode === "signup" ? "Join Katihar Run Club" : "Welcome back"}
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setAuthMode("signup")} style={{
                padding: 8, borderRadius: 8, border: 0,
                background: authMode === "signup" ? "#ff6b2c" : "#30363c",
                color: "#fff", cursor: "pointer"
              }}>
                SIGN UP
              </button>
              <button onClick={() => setAuthMode("login")} style={{
                padding: 8, borderRadius: 8, border: 0,
                background: authMode === "login" ? "#ff6b2c" : "#30363c",
                color: "#fff", cursor: "pointer"
              }}>
                LOG IN
              </button>
            </div>
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password (at least 6 characters)"
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={authenticate}
              disabled={authBusy || !email || password.length < 6}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 13,
                background: "#ff6b2c",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {authBusy ? "PLEASE WAIT..." : authMode === "signup" ? "CREATE ACCOUNT" : "LOG IN"}
            </button>
          </>
        )}
        {authMessage && (
          <p style={{ color: "#ffb080", overflowWrap: "anywhere" }}>
            {authMessage}
          </p>
        )}
      </div>

      <div style={{
        display: "flex", gap: 8, marginBottom: 14
      }}>
        {(["run", "walk"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActivityType(type)}
            style={{
              flex: 1, padding: 11, borderRadius: 8,
              border: "1px solid #42474e",
              background: activityType === type ? "#ff6b2c" : "#151a20",
              color: "#fff", fontWeight: 800, cursor: "pointer"
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 10, marginBottom: 14
      }}>
        {stats.map((item) => (
          <div key={item.label} style={{
            background: "#151a20", border: "1px solid #30363c",
            borderRadius: 12, padding: "14px 8px", textAlign: "center",
            minWidth: 0
          }}>
            <div style={{ fontSize: 10, color: "#a0a8b2", marginBottom: 8 }}>
              {item.label}
            </div>
            <div style={{
              fontSize: 18, fontWeight: 800, color: "#ff6b2c",
              overflowWrap: "anywhere"
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        width: "100%", height: 420, borderRadius: 12,
        overflow: "hidden", border: "1px solid #30363c"
      }}>
        <MapContainer center={katihar} zoom={14} scrollWheelZoom style={{
          width: "100%", height: "100%", background: "#10151a"
        }}>
          <FixMapSize />
          <FollowLocation position={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker center={katihar} radius={7} pathOptions={{
            color: "#090b0f", weight: 3, fillColor: "#ff6b2c", fillOpacity: 1
          }}>
            <Popup>Katihar, Bihar</Popup>
          </CircleMarker>
          {route.length > 0 && (
            <Polyline positions={route} pathOptions={{ color: "#ff6b2c", weight: 5 }} />
          )}
          {position && (
            <CircleMarker center={position} radius={9} pathOptions={{
              color: "#fff", weight: 3, fillColor: "#2787ff", fillOpacity: 1
            }}>
              <Popup>Your current location</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>

      <div style={{
        marginTop: 12, padding: 12, background: "#151a20",
        border: "1px solid #30363c", borderRadius: 10, fontSize: 13,
        color: gpsReady ? "#70e0a0" : "#c0c6ce"
      }}>
        <span style={{
          display: "inline-block", width: 8, height: 8, borderRadius: "50%",
          background: gpsReady ? "#70e0a0" : "#ff6b2c", marginRight: 8
        }} />
        {message}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={startRun} disabled={running || saving || !user} style={{
          flex: 1, padding: 14, border: 0, borderRadius: 10,
          background: running || !user ? "#42474e" : "#ff6b2c",
          color: "#fff", fontWeight: 800,
          cursor: running || !user ? "not-allowed" : "pointer"
        }}>
          {running ? "RECORDING..." : `START ${activityType.toUpperCase()}`}
        </button>
        <button onClick={finishRun} disabled={!running || saving} style={{
          flex: 1, padding: 14, border: "1px solid #42474e",
          borderRadius: 10, background: "#20262d", color: "#fff",
          fontWeight: 800, cursor: running ? "pointer" : "not-allowed"
        }}>
          {saving ? "SAVING..." : "FINISH & SAVE"}
        </button>
      </div>

      <p style={{
        fontSize: 11, color: "#929aa4", lineHeight: 1.6, marginTop: 12
      }}>
        Log in to record an activity. Keep this page open during your run or walk.
        Only distance, duration and activity type are saved; your GPS route is not uploaded.
      </p>
    </div>
  );
}
