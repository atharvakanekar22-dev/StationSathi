import React from 'react';
import {
  Train,
  Sparkles,
  ChevronDown,
  Search
} from 'lucide-react';

export default function Header({
  stations = [],
  currentStationId = 'dadar',
  onSelectStation,
  onOpenAssistant,
  onOpenInfoModal,
  onGoHome
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/70 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Railway Network */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group py-2"
            onClick={onGoHome}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition">
              <Train className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-950">
                StationSathi
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                Central Railway
              </span>
            </div>
          </div>

          {/* Station Selector: Clean editorial dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={currentStationId}
                onChange={(e) => onSelectStation(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 pl-3.5 pr-8 py-2 rounded-full border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs transition"
                aria-label="Select railway station"
              >
                {stations.map((st) => (
                  <option key={st.station_id} value={st.station_id}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Action Tools: Search / Assistant & Help */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white transition shadow-sm"
              title="Search & Station Assistant"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            <button
              onClick={onOpenInfoModal}
              className="px-3.5 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
              title="Station Information & Help"
            >
              Help / About
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
