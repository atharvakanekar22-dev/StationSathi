import React, { useState } from 'react';
import {
  Train,
  ArrowRight,
  Search,
  CheckCircle2,
  Navigation,
  Compass,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';

export default function LandingPage({ stations = [], onSelectStation, onExploreClick }) {
  const [activeStationKey, setActiveStationKey] = useState('dadar');
  const [searchQuery, setSearchQuery] = useState('');

  const stationData = {
    dadar: {
      name: 'Dadar Central',
      code: 'DR',
      platforms: '14 Platforms',
      network: 'Central & Western Railway Interchange',
      highlight: '3 Elevated Foot Overbridges • East-West Commuter Hub',
      caption: 'Direct step-free route from East Main Gate to Platform 11 via Central FOB'
    },
    csmt: {
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      code: 'CSMT',
      platforms: '18 Platforms',
      network: 'UNESCO World Heritage Historic Terminus',
      highlight: 'Step-free Suburban Star Concourse to Platforms 1–7',
      caption: 'Direct level path from Walchand Hirachand Marg to Platform 4'
    },
    byculla: {
      name: 'Byculla',
      code: 'BY',
      platforms: '4 Platforms',
      network: 'Historic Heritage Sub-Terminal',
      highlight: 'Central Foot Overbridge • Restored Heritage Entrance',
      caption: 'East Gate access through Central FOB down to Platform 3'
    },
    ghatkopar: {
      name: 'Ghatkopar',
      code: 'GC',
      platforms: '4 Platforms',
      network: 'Direct Metro Line 1 Elevated Interchange',
      highlight: 'High-Capacity Metro Concourse • Step-Free Elevators',
      caption: 'Direct barrier-free transfer from Metro Concourse to Platform 1'
    },
    thane: {
      name: 'Thane',
      code: 'TNA',
      platforms: '10 Platforms',
      network: 'Major Suburban & Trans-Harbour Junction',
      highlight: 'SATIS Elevated Bus Deck • Barrier-Free Ramp Access',
      caption: 'East Concourse and SATIS elevated deck connection to Platform 2'
    },
    kalyan: {
      name: 'Kalyan',
      code: 'KYN',
      platforms: '8 Platforms',
      network: 'Kasara / Karjat Line Split & Outstation Junction',
      highlight: 'Step-Free Divyangjan Ramp • South Foot Overbridge',
      caption: 'Main West Concourse to Platform 4 via South FOB & Ramp'
    }
  };

  const currentStationInfo = stationData[activeStationKey] || stationData.dadar;

  const quickIntents = [
    { label: 'Platforms', category: 'platform', query: 'Platform' },
    { label: 'Lifts & Elevators', category: 'elevator', query: 'Lift' },
    { label: 'Washrooms', category: 'washroom', query: 'Washroom' },
    { label: 'Ticket Counters', category: 'ticket_counter', query: 'Ticket' },
    { label: 'Shoe Polishing', category: 'shoepolish', query: 'Shoe Polish' },
    { label: 'Foot Overbridges', category: 'fob', query: 'FOB' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSelectStation) {
      onSelectStation(activeStationKey, { searchTerm: searchQuery });
    }
  };

  const handleIntentClick = (intent) => {
    if (onSelectStation) {
      onSelectStation(activeStationKey, {
        searchTerm: intent.query,
        category: intent.category
      });
    }
  };

  // Render SVG Hero Product visualization based on activeStationKey
  const renderHeroMapGraphic = () => {
    if (activeStationKey === 'csmt') {
      return (
        <svg viewBox="0 0 540 320" className="w-full h-full select-none">
          <defs>
            <pattern id="tracks-csmt" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 5 L 10 5" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="540" height="320" rx="16" fill="#090d16" />
          <rect x="230" y="30" width="280" height="260" fill="url(#tracks-csmt)" />

          {/* Star Concourse */}
          <rect x="30" y="50" width="160" height="220" rx="12" fill="#131d31" stroke="#2563eb" strokeWidth="1.5" />
          <text x="110" y="80" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">SUBURBAN STAR CONCOURSE</text>
          <text x="110" y="96" fill="#94a3b8" fontSize="8" textAnchor="middle">Main Heritage Gate</text>

          {/* Platforms */}
          <rect x="230" y="45" width="260" height="30" rx="4" fill="#1e293b" stroke="#334155" />
          <text x="250" y="64" fill="#94a3b8" fontSize="9" fontWeight="bold">PF 1</text>

          <rect x="230" y="105" width="260" height="34" rx="4" fill="#1e293b" stroke="#334155" />
          <text x="250" y="126" fill="#94a3b8" fontSize="9" fontWeight="bold">PF 2 & 3</text>

          <rect x="230" y="170" width="260" height="34" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
          <text x="250" y="191" fill="#38bdf8" fontSize="9" fontWeight="bold">PF 4 & 5</text>

          <rect x="230" y="235" width="260" height="30" rx="4" fill="#1e293b" stroke="#334155" />
          <text x="250" y="254" fill="#94a3b8" fontSize="9" fontWeight="bold">PF 6 & 7</text>

          {/* Direct Pathway */}
          <path
            d="M 110 160 L 190 160 L 190 187 L 340 187"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
          <circle cx="110" cy="160" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="340" cy="187" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <text x="340" y="210" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">YOUR TRAIN</text>
        </svg>
      );
    }

    if (activeStationKey === 'ghatkopar') {
      return (
        <svg viewBox="0 0 540 320" className="w-full h-full select-none">
          <rect width="540" height="320" rx="16" fill="#090d16" />
          {/* Suburban Platforms */}
          <rect x="60" y="60" width="420" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
          <text x="100" y="85" fill="#38bdf8" fontSize="10" fontWeight="bold">PLATFORM 1 (SLOW DOWN TO CSMT)</text>

          <rect x="60" y="210" width="420" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="100" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold">PLATFORM 4 (FAST UP TO THANE)</text>

          {/* Elevated Metro Interchange FOB */}
          <rect x="200" y="30" width="140" height="250" rx="10" fill="#14233c" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="270" y="55" fill="#60a5fa" fontSize="9" fontWeight="bold" textAnchor="middle">METRO LINE 1 TRANSFER</text>

          {/* Pathway */}
          <path
            d="M 270 70 L 270 80 L 170 80"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
          <circle cx="270" cy="70" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="170" cy="80" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <text x="170" y="100" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">STEP-FREE ACCESS</text>
        </svg>
      );
    }

    // Default: Dadar Central Reference Hero Product Visualization
    return (
      <svg viewBox="0 0 540 320" className="w-full h-full select-none">
        <defs>
          <pattern id="tracks-dadar" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 0 6 L 12 6" stroke="#334155" strokeWidth="0.8" opacity="0.35" />
          </pattern>
        </defs>

        {/* Ambient Dark Slate Slab */}
        <rect width="540" height="320" rx="18" fill="#090d16" />

        {/* Railway Corridor Tracks */}
        <rect x="60" y="35" width="28" height="250" fill="url(#tracks-dadar)" />
        <rect x="150" y="35" width="30" height="250" fill="url(#tracks-dadar)" />
        <rect x="250" y="35" width="30" height="250" fill="url(#tracks-dadar)" />
        <rect x="350" y="35" width="28" height="250" fill="url(#tracks-dadar)" />

        {/* Platform 8 */}
        <rect x="92" y="35" width="54" height="250" rx="5" fill="#172235" stroke="#334155" strokeWidth="1" />
        <text x="119" y="60" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">PF 8</text>

        {/* Platform 9 & 10 */}
        <rect x="184" y="35" width="62" height="250" rx="5" fill="#172235" stroke="#334155" strokeWidth="1" />
        <text x="215" y="60" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">PF 10</text>

        {/* Platform 11 & 12 */}
        <rect x="284" y="35" width="62" height="250" rx="5" fill="#172235" stroke="#0284c7" strokeWidth="1.2" />
        <text x="315" y="60" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">PF 11</text>

        {/* East Main Concourse */}
        <rect x="390" y="60" width="115" height="200" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <text x="447" y="95" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">EAST ENTRANCE</text>
        <text x="447" y="110" fill="#64748b" fontSize="8" textAnchor="middle">Main Concourse Gate</text>

        {/* Central Foot Overbridge (Spanning Tracks) */}
        <rect x="35" y="145" width="460" height="32" rx="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" opacity="0.95" />
        <text x="240" y="165" fill="#bfdbfe" fontSize="9" fontWeight="bold" textAnchor="middle">
          CENTRAL FOOT OVERBRIDGE
        </text>

        {/* Illuminated Guidance Path: East Gate -> Central FOB -> Platform 11 */}
        <path
          d="M 447 185 L 447 161 L 315 161 L 315 210"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 3.5"
        />

        {/* Origin Pin */}
        <circle cx="447" cy="185" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
        <text x="447" y="202" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">EAST GATE</text>

        {/* Destination Train Pin */}
        <circle cx="315" cy="210" r="5.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        <text x="315" y="228" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">PLATFORM 11</text>

        {/* Elevator Marker */}
        <rect x="408" y="149" width="18" height="24" rx="3" fill="#10b981" />
        <text x="417" y="164" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">LIFT</text>
      </svg>
    );
  };

  return (
    <div className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex flex-col justify-between space-y-12 sm:space-y-16">
      {/* Top Editorial Hero Composition */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Editorial Narrative, CTA & Station Swatches */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Mumbai Central Railway • Indoor Wayfinding</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08]">
            Navigate<br />
            your station<br />
            with ease.
          </h1>

          {/* Supporting Narrative */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md font-normal">
            Find facilities, services, platforms and step-free directions inside Mumbai's busiest railway stations.
          </p>

          {/* Primary CTA Button (Soft Pill Elevation) */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectStation(activeStationKey)}
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-slate-950 hover:bg-blue-600 text-white transition-all shadow-xl shadow-slate-300/50 hover:shadow-blue-500/20 flex items-center gap-2.5 group"
            >
              <span>Explore your station</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          {/* Interactive Station Swatches with Complete Station Names */}
          <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Choose Station Preview
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'dadar', name: 'Dadar Central' },
                { key: 'csmt', name: 'CSMT Mumbai' },
                { key: 'byculla', name: 'Byculla' },
                { key: 'ghatkopar', name: 'Ghatkopar' },
                { key: 'thane', name: 'Thane' },
                { key: 'kalyan', name: 'Kalyan' }
              ].map((s) => {
                const isActive = activeStationKey === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveStationKey(s.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Hero Centerpiece (Pure Clickable Platform Concourse Image) */}
        <div className="lg:col-span-7">
          <div
            onClick={() => onSelectStation(activeStationKey)}
            className="group cursor-pointer rounded-[2.25rem] overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-200/80 transition-all duration-300 hover:scale-[1.015] hover:shadow-slate-900/30 relative"
            title={`Click to explore ${currentStationInfo.name} interactive map`}
          >
            <div className="w-full h-72 sm:h-96 md:h-[26rem] overflow-hidden bg-slate-900">
              <img
                src="/station_hero.png"
                alt="Mumbai Central Railway Platform Concourse"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Passenger Intents Bar */}
      <section className="space-y-3 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Quick Navigation
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {quickIntents.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleIntentClick(item)}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white hover:bg-slate-950 hover:text-white border border-slate-200 text-slate-700 shadow-xs transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Editorial Station Showcase (No Chunky Cards) */}
      <section className="space-y-6 pt-4 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Central Railway Stations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any station to explore its full 2D indoor map and facility directory
            </p>
          </div>
        </div>

        {/* Clean Editorial List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((st) => {
            const info = stationData[st.station_id] || {
              name: st.name,
              code: st.code,
              platforms: `${st.platforms_count} Platforms`,
              network: st.network,
              highlight: 'Indoor navigation & facility discovery'
            };

            return (
              <div
                key={st.station_id}
                onClick={() => onSelectStation(st.station_id)}
                className="group cursor-pointer bg-white hover:bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {st.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      {st.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                    {st.network}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {info.highlight}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{st.platforms_count} Platforms</span>
                  <span className="text-slate-900 font-semibold group-hover:text-blue-600 flex items-center gap-1 transition">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quiet, Authoritative Notice */}
      <footer className="pt-6 border-t border-slate-200/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          StationSathi is an independent commuter navigation service for Mumbai Central Railway passengers.
        </p>
        <p className="text-slate-400">
          Last updated September 2026 • Verified wayfinding pathways
        </p>
      </footer>
    </div>
  );
}
