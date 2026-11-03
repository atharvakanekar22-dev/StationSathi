import React, { useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  Building2,
  ChevronRight,
  Compass,
  Map,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const stationDetails = {
  dadar: { label: 'Dadar', eyebrow: 'Central + Western lines', note: 'A busy interchange made easier to read.' },
  csmt: { label: 'CSMT', eyebrow: 'Historic terminus', note: 'Find your platform before the crowd.' },
  byculla: { label: 'Byculla', eyebrow: 'Central Railway', note: 'A compact guide for everyday journeys.' },
  ghatkopar: { label: 'Ghatkopar', eyebrow: 'Rail + Metro interchange', note: 'Move between services with confidence.' },
  thane: { label: 'Thane', eyebrow: 'Major junction', note: 'Plan across platforms and concourses.' },
  kalyan: { label: 'Kalyan', eyebrow: 'Central Railway junction', note: 'Get oriented before you set off.' }
};

const features = [
  { icon: Map, title: 'Station maps', text: 'Understand platforms, entrances and concourses at a glance.' },
  { icon: Building2, title: 'Useful facilities', text: 'Locate washrooms, lifts, ticket windows and more.' },
  { icon: Compass, title: 'Indoor directions', text: 'Get clear, step-by-step routes through the station.' },
  { icon: Accessibility, title: 'Accessible travel', text: 'Choose routes that work better for wheelchairs and luggage.' }
];

export default function LandingPage({ stations = [], onSelectStation }) {
  const [activeStationKey, setActiveStationKey] = useState('dadar');
  const active = stationDetails[activeStationKey] || stationDetails.dadar;

  const openStation = (id = activeStationKey) => {
    setActiveStationKey(id);
    onSelectStation?.(id);
  };

  const scrollToStations = () => {
    document.getElementById('popular-stations')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="landing-page">
      <section className="hero-section page-shell">
        <div className="hero-copy">
        <h1>Find your way at every station.</h1>
        <button type="button" className="scroll-stations-button" onClick={scrollToStations}>
            View {stations.length || 6} stations
            <ChevronDown size={17} />
          </button>
        </div>

        <div className="hero-visual" role="img" aria-label="Mumbai railway station platform">
          <img src="/station_hero.png" alt="" />
          <div className="hero-visual-caption">
            <span className="caption-kicker">Make the connection</span>
            <strong>Less guessing. More moving.</strong>
          </div>
        </div>
      </section>

      <section className="page-shell station-section" id="popular-stations">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Start with a station</div>
            <h2>Popular stations</h2>
          </div>
          <span className="section-count">{stations.length || 6} stations</span>
        </div>
        <div className="station-grid">
          {stations.map((station, index) => {
            const detail = stationDetails[station.station_id] || {};
            const isActive = station.station_id === activeStationKey;
            return (
              <button
                type="button"
                key={station.station_id}
                className={`station-card ${isActive ? 'is-active' : ''}`}
                onClick={() => openStation(station.station_id)}
              >
                <span className="station-number">0{index + 1}</span>
                <span className="station-card-top">
                  <span className="station-code">{station.code}</span>
                  <ChevronRight size={17} />
                </span>
                <span className="station-name">{station.name}</span>
                <span className="station-meta">{detail.eyebrow || station.network}</span>
                <span className="station-note">{detail.note || 'Maps, facilities and route guidance.'}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="page-shell quick-start">
        <div className="quick-start-copy">
          <div className="eyebrow">A calmer way to navigate</div>
          <h2>{active.label} is ready when you are.</h2>
          <p>{active.note} Open the guide to see the live station map, facilities and indoor directions.</p>
          <button type="button" className="primary-button" onClick={() => openStation()}>
            Open {active.label} guide <ArrowRight size={17} />
          </button>
        </div>
        <div className="quick-start-list">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="feature-row" key={title}>
              <span className="feature-icon"><Icon size={18} /></span>
              <div><strong>{title}</strong><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell assistant-callout">
        <div className="assistant-callout-icon"><Sparkles size={20} /></div>
        <div><strong>Not sure where to start?</strong><p>Ask the StationSathi assistant in plain language.</p></div>
        <span className="assistant-callout-arrow"><ArrowRight size={18} /></span>
      </section>
    </div>
  );
}
