
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Footprints,
  MapPin,
  Menu,
  Play,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 420,
        display: "grid",
        placeItems: "center",
        background: "#10151a",
        color: "#ff6b2c",
        borderRadius: 12,
        fontSize: 13,
      }}
    >
      Loading Katihar map...
    </div>
  ),
});

const leaderboard = [
  { rank: 1, name: "Aman Kumar", area: "Katihar", distance: "42.8", change: "+2" },
  { rank: 2, name: "Rahul Singh", area: "Manihari Road", distance: "38.4", change: "−1" },
  { rank: 3, name: "Aditya Raj", area: "New Market", distance: "35.2", change: "+1" },
  { rank: 4, name: "Aryan Kumar", area: "Mirchaibari", distance: "31.6", change: "−1" },
  { rank: 5, name: "Rohit Yadav", area: "Katihar", distance: "28.9", change: "+3" },
];

export default function Home() {
  const [mode, setMode] = useState<"RUN" | "WALK">("RUN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  function startSession() {
    setNotice(
      "GPS tracking abhi connect nahi hai. Agle step mein real activity tracking add karenge."
    );
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#">
          <span className="brand-symbol">K</span>
          <span>
            <strong>KATIHAR <b>RUN CLUB</b></strong>
            <small>YOUR CITY. YOUR PACE.</small>
          </span>
        </a>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#map" onClick={() => setMenuOpen(false)}>City map</a>
          <a href="#leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        </nav>

        <a className="top-cta" href="#start">
          LET&apos;S MOVE <ArrowUpRight size={15} />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" />
            BUILT FOR KATIHAR, BIHAR
          </div>

          <h1>
            YOUR STREETS.
            <br />
            YOUR <span>RECORD.</span>
            <br />
            YOUR CITY.
          </h1>

          <p className="hero-description">
            Every step counts. Every run matters.
            Compete with your city, chase your personal best
            and make your morning count.
          </p>

          <div className="hero-actions" id="start">
            <button className="btn-primary" onClick={startSession}>
              <Play size={16} fill="currentColor" />
              START A SESSION
            </button>
            <a className="btn-secondary" href="#leaderboard">
              VIEW RANKINGS <ArrowRight size={16} />
            </a>
          </div>

          {notice && <p className="notice-message">{notice}</p>}

          <div className="hero-proof">
            <div className="avatar-stack">
              <span>A</span><span>R</span><span>K</span><span>+</span>
            </div>
            <p>
              <strong>Katihar starts here.</strong>
              <br />
              Your next personal best awaits.
            </p>
          </div>
        </div>

        <div className="hero-visual" id="map">
          <div className="map-topline">
            <div>
              <span className="mini-label">EXPLORE YOUR CITY</span>
              <h2>Katihar, Bihar</h2>
            </div>
            <span className="map-status">
              <span className="live-dot" /> INTERACTIVE MAP
            </span>
          </div>

          <MapView />

          <div className="map-footer">
            <span><MapPin size={14} /> KATIHAR, BIHAR, INDIA</span>
            <span>ZOOM · EXPLORE · DISCOVER</span>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-item">
          <span className="stat-icon"><Activity size={18} /></span>
          <div><strong>YOUR PROGRESS</strong><small>Every session counts</small></div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Trophy size={18} /></span>
          <div><strong>LOCAL RANKINGS</strong><small>Compete for the top</small></div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Footprints size={18} /></span>
          <div><strong>WALK OR RUN</strong><small>Your pace, your rules</small></div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Zap size={18} /></span>
          <div><strong>BEAT YOUR GHOST</strong><small>Outrun your past self</small></div>
        </div>
      </section>

      <section className="competition-section" id="leaderboard">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="live-dot" /> THE LOCAL COMPETITION
            </div>
            <h2>THE CITY <span>LEADERBOARD.</span></h2>
            <p>Every kilometre brings you closer to the top.</p>
          </div>
          <div className="leaderboard-tabs">
            <button className="tab-active">WEEKLY</button>
            <button
              onClick={() =>
                setNotice(
                  "Monthly rankings will be enabled when the real leaderboard backend is connected."
                )
              }
            >
              MONTHLY
            </button>
          </div>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-header">
            <span>RANK / ATHLETE</span>
            <span>WEEKLY DISTANCE</span>
            <span>CHANGE</span>
          </div>

          {leaderboard.map((person) => (
            <div className="leaderboard-row" key={person.rank}>
              <div className="athlete-cell">
                <span className={`rank-number ${person.rank === 1 ? "rank-first" : ""}`}>
                  {String(person.rank).padStart(2, "0")}
                </span>
                <span className="athlete-avatar">{person.name.charAt(0)}</span>
                <span className="athlete-info">
                  <strong>{person.name}</strong>
                  <small>{person.area}</small>
                </span>
              </div>

              <strong className="distance-value">
                {person.distance} <small>KM</small>
              </strong>

              <span className={person.change.startsWith("+") ? "rank-up" : "rank-down"}>
                {person.change.startsWith("+") ? (
                  <ArrowUpRight size={15} />
                ) : (
                  <ArrowDownRight size={15} />
                )}
                {person.change}
              </span>
            </div>
          ))}

          <div className="leaderboard-disclaimer">
            <Users size={14} />
            SAMPLE PREVIEW DATA — THESE ARE NOT LIVE ATHLETE RESULTS.
          </div>
        </div>
      </section>

      <section className="session-section" id="features">
        <div className="session-copy">
          <div className="eyebrow">YOUR NEXT SESSION</div>
          <h2>OWN YOUR <span>PACE.</span></h2>
          <p>
            Whether you walk for your health or run for a new personal best,
            every session belongs on your record.
          </p>

          <div className="mode-selector">
            <button
              className={mode === "RUN" ? "mode-selected" : ""}
              onClick={() => setMode("RUN")}
            >
              <Zap size={16} /> RUN
            </button>
            <button
              className={mode === "WALK" ? "mode-selected" : ""}
              onClick={() => setMode("WALK")}
            >
              <Footprints size={16} /> WALK
            </button>
          </div>

          <button className="btn-primary session-button" onClick={startSession}>
            START {mode} <ArrowRight size={17} />
          </button>
          {notice && <p className="notice-message">{notice}</p>}
        </div>

        <div className="session-card">
          <div className="session-card-top">
            <span>SESSION PREVIEW</span>
            <span className="session-tag">{mode}</span>
          </div>
          <div className="session-distance">0.00 <span>KM</span></div>
          <p>YOUR NEXT PERSONAL BEST STARTS HERE.</p>
          <div className="session-metrics">
            <div><small>DURATION</small><strong>00:00</strong></div>
            <div><small>AVG. PACE</small><strong>--:--</strong></div>
            <div><small>CALORIES</small><strong>--</strong></div>
          </div>
          <div className="session-card-bottom">
            <Activity size={15} /> GPS TRACKING NOT CONNECTED YET
          </div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand-lockup" href="#">
          <span className="brand-symbol">K</span>
          <span>
            <strong>KATIHAR <b>RUN CLUB</b></strong>
            <small>YOUR CITY. YOUR PACE.</small>
          </span>
        </a>
        <p>MADE FOR THE STREETS OF KATIHAR, BIHAR.</p>
        <span className="footer-mark">KRC © 2026</span>
      </footer>
    </main>
  );
}
