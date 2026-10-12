
"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Footprints,
  MapPin,
  Menu,
  Navigation,
  Play,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

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
      "GPS tracking aur account setup agle development step mein connect hoga."
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

        <a className="top-cta" href="#start">LET&apos;S MOVE <ArrowUpRight size={15} /></a>

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
            <p><strong>Katihar starts here.</strong><br />Your next personal best awaits.</p>
          </div>
        </div>

        <div className="hero-visual" id="map">
          <div className="map-topline">
            <div>
              <span className="mini-label">THE CITY GRID</span>
              <h2>Katihar, Bihar</h2>
            </div>
            <span className="map-status"><span className="live-dot" /> MAP PREVIEW</span>
          </div>

          <div className="map-art">
            <svg className="map-lines" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse">
                  <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#30363c" strokeWidth="0.7" />
                </pattern>
                <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff6b2c" />
                  <stop offset="100%" stopColor="#ffb06e" />
                </linearGradient>
              </defs>
              <rect width="600" height="500" fill="url(#grid)" />
              <g fill="none" stroke="#3a4249" strokeWidth="5" strokeLinecap="round">
                <path d="M-20 100 L150 150 L230 80 L370 125 L620 40" />
                <path d="M-20 245 L100 200 L240 260 L360 210 L620 280" />
                <path d="M35 520 L90 360 L180 300 L210 180 L300 -20" />
                <path d="M240 520 L300 390 L390 325 L440 210 L500 -20" />
                <path d="M-20 420 L140 410 L260 450 L400 410 L620 450" />
              </g>
              <g fill="none" stroke="#242b31" strokeWidth="2">
                <path d="M-10 130 L145 178 L245 112 L365 152 L610 65" />
                <path d="M-10 270 L95 226 L230 285 L375 238 L610 305" />
                <path d="M50 510 L110 380 L198 320 L228 195 L320 -10" />
                <path d="M260 510 L320 410 L410 340 L460 225 L520 -10" />
                <path d="M-10 395 L135 390 L250 430 L410 390 L610 430" />
              </g>
              <path d="M90 360 C140 320 145 250 230 260 S340 330 390 245 S445 170 500 155" fill="none" stroke="#ff6b2c" strokeWidth="3" strokeDasharray="7 7" opacity="0.35" />
              <path d="M90 360 C140 320 145 250 230 260 S340 330 390 245 S445 170 500 155" fill="none" stroke="url(#route)" strokeWidth="2.5" strokeLinecap="round" />
              <g fill="#ff6b2c">
                <circle cx="90" cy="360" r="5" />
                <circle cx="230" cy="260" r="5" />
                <circle cx="390" cy="245" r="5" />
                <circle cx="500" cy="155" r="5" />
              </g>
            </svg>

            <div className="map-label label-one"><MapPin size={12} /> KATIHAR</div>
            <div className="map-label label-two">YOUR ROUTE <span>↗</span></div>

            <div className="map-player player-one">
              <span className="player-avatar">A</span>
              <span className="player-caption">Runner A</span>
            </div>
            <div className="map-player player-two">
              <span className="player-avatar avatar-green">R</span>
              <span className="player-caption">Runner B</span>
            </div>
            <div className="map-player player-three">
              <span className="player-avatar avatar-blue">K</span>
            </div>

            <div className="map-center-marker">
              <Navigation size={17} fill="currentColor" />
            </div>

            <div className="map-legend">
              <span><i className="legend-orange" /> ROUTE</span>
              <span><i className="legend-white" /> PLAYERS</span>
            </div>
          </div>

          <div className="map-footer">
            <span><MapPin size={14} /> KATIHAR, IN</span>
            <span>INTERACTIVE MAP COMING NEXT <ArrowUpRight size={14} /></span>
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
            <div className="eyebrow"><span className="live-dot" /> THE LOCAL COMPETITION</div>
            <h2>THE CITY <span>LEADERBOARD.</span></h2>
            <p>Every kilometre brings you closer to the top.</p>
          </div>
          <div className="leaderboard-tabs">
            <button className="tab-active">WEEKLY</button>
            <button onClick={() => setNotice("Monthly rankings will be enabled when the real leaderboard backend is connected.")}>MONTHLY</button>
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
              <strong className="distance-value">{person.distance} <small>KM</small></strong>
              <span className={person.change.startsWith("+") ? "rank-up" : "rank-down"}>
                {person.change.startsWith("+") ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                {person.change}
              </span>
            </div>
          ))}

          <div className="leaderboard-disclaimer">
            <Users size={14} /> SAMPLE PREVIEW DATA — REAL ATHLETES WILL APPEAR AFTER ACCOUNTS AND TRACKING ARE CONNECTED.
          </div>
        </div>
      </section>

      <section className="session-section" id="features">
        <div className="session-copy">
          <div className="eyebrow">YOUR NEXT SESSION</div>
          <h2>OWN YOUR <span>PACE.</span></h2>
          <p>Whether you walk for your health or run for a new personal best, every session belongs on your record.</p>

          <div className="mode-selector">
            <button className={mode === "RUN" ? "mode-selected" : ""} onClick={() => setMode("RUN")}>
              <Zap size={16} /> RUN
            </button>
            <button className={mode === "WALK" ? "mode-selected" : ""} onClick={() => setMode("WALK")}>
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
          <div className="session-card-bottom"><Activity size={15} /> GPS TRACKING NOT CONNECTED YET</div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand-lockup" href="#">
          <span className="brand-symbol">K</span>
          <span><strong>KATIHAR <b>RUN CLUB</b></strong><small>YOUR CITY. YOUR PACE.</small></span>
        </a>
        <p>MADE FOR THE STREETS OF KATIHAR, BIHAR.</p>
        <span className="footer-mark">KRC © 2026</span>
      </footer>
    </main>
  );
}
