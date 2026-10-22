import React, { useState } from 'react';
import {
  ArrowRight,
} from 'lucide-react';

export default function LandingPage({ stations = [], onSelectStation }) {
  const [activeStationKey, setActiveStationKey] = useState('dadar');

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

  const handleIntentClick = (intent) => {
    if (onSelectStation) {
      onSelectStation(activeStationKey, {
        searchTerm: intent.query,
        category: intent.category
      });
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex flex-col justify-between space-y-12 sm:space-y-16">
      {/* Top Editorial Hero Composition */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Editorial Narrative, CTA & Station Swatches */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08]">
            Find your way<br />
            around the station.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md font-normal">
            Find platforms, facilities, and step-free routes.
          </p>

          {/* Primary CTA Button (Soft Pill Elevation) */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectStation(activeStationKey)}
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-slate-950 hover:bg-blue-600 text-white transition-all shadow-xl shadow-slate-300/50 hover:shadow-blue-500/20 flex items-center gap-2.5 group"
            >
              <span>Open station map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          {/* Interactive Station Swatches with Complete Station Names */}
          <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Stations
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
              Stations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose a station to open its map and facilities
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
        <p>Station maps and facilities for Central Railway commuters.</p>
      </footer>
    </div>
  );
}
