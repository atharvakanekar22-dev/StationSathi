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

export default function DirectionsPanel({ route, onClose }) {
  if (!route) return null;

  if (!route.success) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">Route Not Found</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {route.explanation || "We don't have enough mapped information to provide a reliable route for this location yet."}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              Note: We only provide verified pathways. If a reliable step-free or direct route is not yet verified between these points, we do not estimate or invent one.
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

  const mins = Math.max(1, Math.round(route.estimated_time_seconds / 60));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col gap-3.5">
      {/* Header & Status */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Your Route</h3>
          <p className="text-xs text-slate-500 mt-0.5">{route.explanation}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metrics Card: Approx. distance and walking time */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Approx. Distance
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {route.total_distance_m} m
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Approx. Walking Time
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {mins} min
          </span>
        </div>
      </div>

      {/* Reassuring Accessibility Confirmation */}
      <div
        className={`px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2.5 border ${
          route.is_step_free
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}
      >
        {route.is_step_free ? (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Step-free route:</strong> Accessible throughout using elevators and level corridors.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Includes stairs:</strong> To avoid staircases, select the "Avoid stairs" preference above.</span>
          </>
        )}
      </div>

      {/* Step-by-Step Turns List */}
      <div className="space-y-2 mt-1 max-h-[300px] overflow-y-auto pr-1">
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
                    <span className="text-emerald-600 font-semibold">• Accessible Elevator</span>
                  )}
                  {step.edge_type === 'stairs' && (
                    <span className="text-amber-600 font-semibold">• Staircase</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
