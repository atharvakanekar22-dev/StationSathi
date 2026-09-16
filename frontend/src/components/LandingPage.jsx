import React from 'react';
import {
  Train,
  Navigation,
  Compass,
  Accessibility,
  Search,
  Sparkles,
  ShieldCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function LandingPage({ stations = [], onSelectStation, onExploreClick }) {
  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <Train className="w-3.5 h-3.5 text-blue-600" />
          <span>Mumbai Central Railway Internal Navigation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Find your way inside the station.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          StationSathi helps railway commuters discover platforms, Foot Overbridges, elevators, ticket counters, washrooms, and licensed shoe-polishing services within complex transit terminals.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectStation('dadar')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition"
          >
            <Navigation className="w-4 h-4" />
            Explore Interactive Prototype (Dadar)
          </button>
          <a
            href="#stations"
            className="px-5 py-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold transition"
          >
            View All 6 Stations
          </a>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Indoor Graph Wayfinding</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dijkstra-powered indoor path calculation across foot overbridges, island platforms, and concourses with step-by-step turn guidance.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Accessibility className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Accessibility-Aware Routing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict stair-avoidance filters routing passengers with luggage or mobility constraints via elevators and accessible walkways.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Structured Data Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every amenity includes transparent verification status, source provenance, and collection method without fabricated real-time data.
          </p>
        </div>
      </section>

      {/* Stations Selection Grid (Module 2) */}
      <section id="stations" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Central Railway Station Network
            </h2>
            <p className="text-xs text-slate-500">
              Select any of the six initial stations to view coverage details or navigate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stations.map((station) => {
            const isDetailed = station.coverage === 'detailed_prototype';
            return (
              <div
                key={station.station_id}
                className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between ${
                  isDetailed
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
                      <span className="text-xs font-semibold text-slate-500">{station.code} • {station.network}</span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        isDetailed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {station.coverage_label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {station.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Mapped Features
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {station.facilities_summary.slice(0, 3).map((fac, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{fac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {station.platforms_count} Platforms
                  </span>
                  <button
                    onClick={() => onSelectStation(station.station_id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      isDetailed
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimers & Public Transport Transparency */}
      <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Public Transport Technology Disclaimer
        </h4>
        <p className="leading-relaxed">
          StationSathi is an independent research prototype developed for Mumbai Central Railway commuters. It does not claim official endorsement by Indian Railways or Central Railway. All facility coordinates and walking distances are prototype estimates under verification.
        </p>
      </section>
    </div>
  );
}
