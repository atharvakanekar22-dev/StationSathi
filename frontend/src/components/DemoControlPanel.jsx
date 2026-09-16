import React from 'react';
import {
  RotateCcw,
  Search,
  Sparkles,
  Navigation,
  Accessibility,
  ArrowRightLeft,
  X,
  Play
} from 'lucide-react';

export default function DemoControlPanel({
  isOpen,
  onClose,
  onResetDemo,
  onRunScenario
}) {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Facility Discovery',
      icon: <Search className="w-4 h-4 text-blue-600" />,
      desc: 'Select Dadar -> Search "washroom" -> Highlight on map -> View verification details.',
      action: () => onRunScenario(1)
    },
    {
      id: 2,
      title: 'Scenario 2: Shoe-Polishing Service',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
      desc: 'Ask "Where can I polish my shoes?" -> Detect service -> Highlight licensed kiosk on map.',
      action: () => onRunScenario(2)
    },
    {
      id: 3,
      title: 'Scenario 3: Indoor Navigation',
      icon: <Navigation className="w-4 h-4 text-emerald-600" />,
      desc: 'Origin: East Entrance -> Destination: Platform 5 -> Shortest route calculation via graph.',
      action: () => onRunScenario(3)
    },
    {
      id: 4,
      title: 'Scenario 4: Accessibility Route',
      icon: <Accessibility className="w-4 h-4 text-purple-600" />,
      desc: 'Query "Platform 4 without stairs" -> Strict elevator path avoiding all stairways.',
      action: () => onRunScenario(4)
    },
    {
      id: 5,
      title: 'Scenario 5: Station Switching',
      icon: <ArrowRightLeft className="w-4 h-4 text-sky-600" />,
      desc: 'Switch Dadar to Thane -> Observe coverage label change to Basic station information.',
      action: () => onRunScenario(5)
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Demo Controller & Scenarios</h3>
              <p className="text-xs text-slate-500">Live presentation quick launcher & state controller</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Quick Reset Button */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-rose-900">Reset Demo State</h4>
              <p className="text-xs text-rose-700">Clears current routes, search filters, and restores Dadar clean map.</p>
            </div>
            <button
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Official Evaluation Scenarios (Module 13)
            </span>

            <div className="grid gap-2">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition">
                      {sc.icon}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{sc.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{sc.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sc.action();
                      onClose();
                    }}
                    className="ml-3 px-3 py-1.5 bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-xs font-semibold rounded-lg transition shrink-0"
                  >
                    Run
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
          >
            Close Controller
          </button>
        </div>
      </div>
    </div>
  );
}
