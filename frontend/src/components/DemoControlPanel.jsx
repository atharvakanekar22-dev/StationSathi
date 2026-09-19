import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  Sparkles,
  Navigation,
  Accessibility,
  Train,
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
  const [stationFilter, setStationFilter] = useState('all');

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'dadar_1',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Facility Discovery (Washrooms)',
      icon: <Search className="w-4 h-4 text-blue-600" />,
      desc: 'Filter Dadar washrooms -> Highlight on map -> Inspect verification & Divyangjan status.',
      action: () => onRunScenario('dadar_washroom')
    },
    {
      id: 'dadar_2',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Shoe-Polishing Service (PF 8 Kiosk)',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
      desc: 'Ask "Where can I polish my shoes?" -> Detect licensed kiosk on Platform 8.',
      action: () => onRunScenario('dadar_shoepolish')
    },
    {
      id: 'dadar_3',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Shortest Route to Platform 11',
      icon: <Navigation className="w-4 h-4 text-emerald-600" />,
      desc: 'East Entrance -> Central FOB -> Platform 11 (Express Terminal). Fast 127m path.',
      action: () => onRunScenario('dadar_shortest_pf11')
    },
    {
      id: 'dadar_4',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Step-Free Elevator Route to Platform 10',
      icon: <Accessibility className="w-4 h-4 text-purple-600" />,
      desc: 'East Entrance -> East Elevator -> Central FOB -> Platform 10 Elevator. 100% stair-free.',
      action: () => onRunScenario('dadar_accessible_pf10')
    },
    {
      id: 'csmt_1',
      stationId: 'csmt',
      stationName: 'CSMT',
      title: 'Suburban Concourse to Platform 4',
      icon: <Train className="w-4 h-4 text-indigo-600" />,
      desc: 'Walchand Hirachand Marg suburban gate to Platform 4 buffer stop apron.',
      action: () => onRunScenario('csmt_suburban_pf4')
    },
    {
      id: 'byculla_1',
      stationId: 'byculla',
      stationName: 'Byculla',
      title: 'Heritage East Gate to Platform 3',
      icon: <Navigation className="w-4 h-4 text-teal-600" />,
      desc: 'Dr. Ambedkar Road East Entrance across Central FOB to Platform 3 (Fast Northbound).',
      action: () => onRunScenario('byculla_fob_pf3')
    },
    {
      id: 'ghatkopar_1',
      stationId: 'ghatkopar',
      stationName: 'Ghatkopar',
      title: 'Metro 1 Interchange to Platform 1',
      icon: <Accessibility className="w-4 h-4 text-cyan-600" />,
      desc: 'Metro Line 1 elevated concourse directly to Platform 1 via accessible lift.',
      action: () => onRunScenario('ghatkopar_metro_pf1')
    },
    {
      id: 'thane_1',
      stationId: 'thane',
      stationName: 'Thane',
      title: 'SATIS Bus Deck to Platform 1',
      icon: <ArrowRightLeft className="w-4 h-4 text-sky-600" />,
      desc: 'Elevated SATIS bus terminal via accessible connecting ramp to Central FOB & Platform 1.',
      action: () => onRunScenario('thane_satis_pf1')
    },
    {
      id: 'kalyan_1',
      stationId: 'kalyan',
      stationName: 'Kalyan',
      title: 'West Bus Depot to Express Platform 4',
      icon: <Navigation className="w-4 h-4 text-orange-600" />,
      desc: 'West Bus Depot Entrance across South FOB to Platform 4 (Kasara/Nashik Express).',
      action: () => onRunScenario('kalyan_west_pf4')
    }
  ];

  const filteredScenarios = stationFilter === 'all'
    ? scenarios
    : scenarios.filter((s) => s.stationId === stationFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Demo Controller & Scenarios</h3>
              <p className="text-xs text-slate-500">Live presentation quick launcher across Central Railway stations</p>
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
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

          {/* Station Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'dadar', 'csmt', 'byculla', 'ghatkopar', 'thane', 'kalyan'].map((sid) => (
              <button
                key={sid}
                onClick={() => setStationFilter(sid)}
                className={`px-3 py-1 rounded-lg font-medium transition capitalize whitespace-nowrap ${
                  stationFilter === sid
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sid === 'all' ? 'All Stations' : sid.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Station Scenarios ({filteredScenarios.length})
            </span>

            <div className="grid gap-2">
              {filteredScenarios.map((sc) => (
                <div
                  key={sc.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition">
                      {sc.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-semibold text-slate-900">{sc.title}</h5>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {sc.stationName}
                        </span>
                      </div>
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
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right shrink-0">
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
