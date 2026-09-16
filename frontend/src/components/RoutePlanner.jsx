import React from 'react';
import {
  Navigation,
  MapPin,
  Compass,
  Accessibility,
  ArrowUpDown,
  RotateCcw,
  Footprints,
  ShieldCheck
} from 'lucide-react';

export default function RoutePlanner({
  graph = null,
  originNodeId = '',
  destinationNodeId = '',
  routePreference = 'shortest',
  onOriginChange,
  onDestinationChange,
  onPreferenceChange,
  onCalculateRoute,
  onClearRoute,
  isCalculating = false
}) {
  const nodes = graph?.nodes ? Object.values(graph.nodes) : [];

  // Group nodes by category for easier selection
  const entrances = nodes.filter((n) => n.type === 'entrance');
  const concourses = nodes.filter((n) => n.type === 'concourse');
  const platforms = nodes.filter((n) => n.type === 'platform');
  const fobs = nodes.filter((n) => n.type === 'fob');
  const facilities = nodes.filter((n) => n.type === 'facility' || n.type === 'elevator');

  const preferences = [
    { id: 'shortest', label: 'Shortest route', desc: 'Minimal metric walking distance' },
    { id: 'avoid_stairs', label: 'Avoid stairs', desc: 'Step-free elevators & ramps only' },
    { id: 'prefer_elevator', label: 'Prefer elevator', desc: 'Elevators prioritized over stairs' },
    { id: 'accessible_route', label: 'Accessible route', desc: 'Wheelchair & heavy luggage path' }
  ];

  const handleSwap = () => {
    if (originNodeId && destinationNodeId) {
      const prevOrig = originNodeId;
      onOriginChange(destinationNodeId);
      onDestinationChange(prevOrig);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Indoor Wayfinding</h3>
          <p className="text-xs text-slate-500">Calculate indoor station routes with accessibility filters</p>
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
          Dijkstra Engine
        </span>
      </div>

      {/* Origin & Destination Controls */}
      <div className="space-y-2.5 relative">
        {/* Origin Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Select your current landmark:
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Manual landmark selection</span>
          </label>
          <select
            value={originNodeId}
            onChange={(e) => onOriginChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
          >
            <option value="">-- Choose your current location --</option>
            <optgroup label="Entrances & Gates">
              {entrances.map((n) => (
                <option key={n.id} value={n.id}>{n.name} ({n.level})</option>
              ))}
            </optgroup>
            <optgroup label="Concourses & Halls">
              {concourses.map((n) => (
                <option key={n.id} value={n.id}>{n.name} ({n.level})</option>
              ))}
            </optgroup>
            <optgroup label="Platforms">
              {platforms.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
            <optgroup label="Foot Overbridges (FOB)">
              {fobs.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
            <optgroup label="Facilities & Services">
              {facilities.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-end pr-2 -my-1">
          <button
            onClick={handleSwap}
            disabled={!originNodeId || !destinationNodeId}
            className="p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 transition"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5 text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Destination:
          </label>
          <select
            value={destinationNodeId}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
          >
            <option value="">-- Choose destination landmark or platform --</option>
            <optgroup label="Platforms">
              {platforms.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
            <optgroup label="Facilities & Services">
              {facilities.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
            <optgroup label="Entrances & Exits">
              {entrances.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
            <optgroup label="Foot Overbridges (FOB)">
              {fobs.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Route Preference Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Route Preference:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {preferences.map((pref) => (
            <button
              key={pref.id}
              type="button"
              onClick={() => onPreferenceChange(pref.id)}
              className={`p-2 rounded-xl text-left border text-xs transition ${
                routePreference === pref.id
                  ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-900 ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                {pref.id === 'avoid_stairs' ? (
                  <Accessibility className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                ) : pref.id === 'prefer_elevator' ? (
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Footprints className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
                <span className="truncate">{pref.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5 truncate">{pref.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onCalculateRoute}
          disabled={!originNodeId || !destinationNodeId || isCalculating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Navigation className="w-4 h-4" />
          {isCalculating ? 'Calculating Route...' : 'Calculate Indoor Route'}
        </button>

        <button
          onClick={onClearRoute}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Clear Route"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
