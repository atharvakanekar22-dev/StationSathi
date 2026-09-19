import React from 'react';
import {
  MapPin,
  CheckCircle2,
  Navigation,
  Clock,
  Info,
  Layers,
  PhoneCall
} from 'lucide-react';

export default function BasicStationView({ station, facilities = [], onSwitchToDadar, onReturnToMap }) {
  if (!station) return null;

  const handleReturn = () => {
    if (onReturnToMap) {
      onReturnToMap();
    } else if (onSwitchToDadar) {
      onSwitchToDadar();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Factsheet Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Station Overview
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Service
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {station.name} ({station.code})
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{station.network}</p>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {station.description}
          </p>

          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Platforms: <strong className="text-white">{station.platforms_count}</strong></span>
              <span>Updated: <strong className="text-white">{station.last_updated}</strong></span>
            </div>

            <button
              onClick={handleReturn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Interactive Station Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Entrances & Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entrances & Gates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Station Entrances & Exits
          </h3>
          <ul className="space-y-2.5">
            {station.entrances && station.entrances.map((ent, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{ent}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Public Station Facilities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Station Facilities & Services
            </h3>
            <span className="text-xs text-slate-500">{facilities.length} recorded</span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {facilities.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl text-center">
                Facility information for this station is being updated.
              </p>
            ) : (
              facilities.map((fac) => (
                <div
                  key={fac.facility_id}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-blue-600">
                        {fac.category.replace('_', ' ')}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{fac.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{fac.floor_level}</p>
                    </div>
                  </div>
                  {fac.notes && (
                    <p className="text-[11px] text-slate-500 mt-1.5 bg-slate-50 p-1.5 rounded-md">
                      {fac.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Railway Assistance Notice */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-800">Station Assistance</h4>
          <p className="mt-0.5 leading-relaxed text-slate-600">
            For urgent passenger assistance, inquiries, or security concerns, visit the Station Master's office or Railway Protection Force (RPF) assistance booth located near the main concourse or Platform 1.
          </p>
        </div>
      </div>
    </div>
  );
}
