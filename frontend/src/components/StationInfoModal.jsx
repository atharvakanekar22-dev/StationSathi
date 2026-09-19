import React from 'react';
import {
  Info,
  Building,
  X,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function StationInfoModal({ isOpen, onClose, station }) {
  if (!isOpen || !station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{station.name} ({station.code})</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500">{station.network}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Station Overview
            </h4>
            <p className="leading-relaxed text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {station.description}
            </p>
          </div>

          {/* Coverage Status Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                Station Navigation
              </span>
              <span className="font-bold text-slate-900 capitalize">
                Interactive 2D Map
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                Total Platforms
              </span>
              <span className="font-bold text-slate-900">
                {station.platforms_count} Platforms
              </span>
            </div>
          </div>

          {/* Entrances */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Main Station Entrances & Gates
            </h4>
            <ul className="space-y-1.5">
              {station.entrances && station.entrances.map((ent, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{ent}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Available Facilities Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Station Amenities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {station.facilities_summary && station.facilities_summary.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Station Information & Commuter Notice */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Information & Commuter Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Station layout and amenities are cross-referenced with public railway directories, commuter surveys, and station wayfinding guides.
              <br />
              <strong>Last Updated:</strong> {station.last_updated}.
              <br />
              <span className="text-slate-500 mt-1 block">
                StationSathi is an independent commuter navigation assistant designed for Mumbai Central Railway passengers. Please follow station signage and official railway staff instructions while travelling.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
