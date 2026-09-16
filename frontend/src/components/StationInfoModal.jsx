import React from 'react';
import {
  Info,
  ShieldCheck,
  AlertTriangle,
  Building,
  Layers,
  Calendar,
  X,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

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
                <VerificationBadge status={station.verification_status} />
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
                Mapping Coverage Level
              </span>
              <span className="font-bold text-slate-900 capitalize">
                {station.coverage_label || station.coverage.replace('_', ' ')}
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

          {/* Data Provenance & Ethics Disclaimers */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Data Provenance & Reliability Disclaimers</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              <strong>Source:</strong> {station.source_method || 'OpenStreetMap nodes and field survey cross-reference'}.
              <br />
              <strong>Last Updated:</strong> {station.last_updated}.
              <br />
              <strong>Ethical Notice:</strong> StationSathi is an academic research & hackathon prototype. It does not claim official endorsement by Indian Railways or Central Railway. All facility coordinates and walking distances are prototype estimates.
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
