import React from 'react';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Footprints,
  Accessibility,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function DirectionsPanel({ route, onClose }) {
  if (!route) return null;

  if (!route.success) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-900">No Mapped Route Available</h4>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">{route.explanation}</p>
            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              Note: The prototype dataset only traverses mapped, verified pathways. If an accessible route does not exist between these points, we do not invent one.
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const mins = Math.floor(route.estimated_time_seconds / 60);
  const secs = route.estimated_time_seconds % 60;
  const timeStr = mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
      {/* Header & Accessibility Status */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Step-by-Step Directions</h3>
            <VerificationBadge status={route.verification_status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{route.explanation}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metrics Card (Estimated values clearly labeled!) */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Est. Distance
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {route.total_distance_m} m
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Est. Steps
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            ~{route.estimated_steps}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Est. Walk Time
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {timeStr}
          </span>
        </div>
      </div>

      {/* Step-Free Accessibility Notice */}
      <div
        className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border ${
          route.is_step_free
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}
      >
        {route.is_step_free ? (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Step-Free Route:</strong> Verified accessible using elevators and level corridors.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Notice:</strong> This route includes staircases. Switch preference to "Avoid stairs" for accessible elevators.</span>
          </>
        )}
      </div>

      {/* Turn-by-Turn Steps List */}
      <div className="space-y-2 mt-1 max-h-[320px] overflow-y-auto pr-1">
        {route.steps.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === route.steps.length - 1;

          let badgeBg = 'bg-blue-100 text-blue-800';
          if (step.edge_type === 'stairs') badgeBg = 'bg-amber-100 text-amber-800';
          if (step.edge_type === 'elevator') badgeBg = 'bg-emerald-100 text-emerald-800';
          if (isFirst || isLast) badgeBg = 'bg-slate-900 text-white';

          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition text-xs"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${badgeBg}`}
              >
                {step.step_number}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 leading-snug">{step.instruction}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="capitalize">{step.edge_type}</span>
                  {step.edge_type === 'elevator' && (
                    <span className="text-emerald-600 font-semibold">• Accessible Lift</span>
                  )}
                  {step.edge_type === 'stairs' && (
                    <span className="text-amber-600 font-semibold">• Flight of Stairs</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 text-center italic mt-1">
        * Estimated distances and step counts are computed strictly from verified graph coordinates (~0.75m per stride).
      </p>
    </div>
  );
}
