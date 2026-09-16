import React from 'react';
import {
  Train,
  Compass,
  Sparkles,
  Info,
  Server,
  PlayCircle,
  ChevronDown
} from 'lucide-react';

export default function Header({
  stations = [],
  currentStationId = 'dadar',
  onSelectStation,
  onOpenAssistant,
  onOpenDemoControls,
  onOpenInfoModal,
  onGoHome,
  isLiveBackend = true
}) {
  const currentStation = stations.find((s) => s.station_id === currentStationId) || stations[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onGoHome}>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">StationSathi</span>
                <span className="text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-300 font-semibold border border-blue-700/50">
                  Central Railway
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Find your way inside the station.</p>
            </div>
          </div>

          {/* Station Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={currentStationId}
                onChange={(e) => onSelectStation(e.target.value)}
                className="appearance-none bg-slate-800 text-slate-100 pl-3 pr-8 py-1.5 rounded-lg border border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                {stations.map((st) => (
                  <option key={st.station_id} value={st.station_id}>
                    {st.name} ({st.code}) {st.coverage === 'detailed_prototype' ? '★ Detailed' : '• Basic'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Station Coverage Pill */}
            {currentStation && (
              <span
                className={`hidden md:inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${
                  currentStation.coverage === 'detailed_prototype'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {currentStation.coverage === 'detailed_prototype'
                  ? 'Detailed Prototype'
                  : 'Basic Information'}
              </span>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Demo Controls Launcher */}
            <button
              onClick={onOpenDemoControls}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition shadow-sm"
              title="Open Hackathon Demo Controller"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Demo Scenarios</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistant</span>
            </button>

            {/* Station Info Modal */}
            <button
              onClick={onOpenInfoModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Station Information & Verification Details"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Backend Status Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border ${
                isLiveBackend
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
              }`}
              title={isLiveBackend ? 'Connected to authoritative FastAPI backend' : 'Running in Prototype Data Fallback mode'}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden lg:inline">{isLiveBackend ? 'FastAPI Live' : 'Prototype Mode'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
