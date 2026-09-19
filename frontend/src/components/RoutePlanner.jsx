import React from 'react';
import {
  Navigation,
  MapPin,
  Compass,
  Accessibility,
  ArrowUpDown,
  RotateCcw,
  Footprints,
  Zap
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
    { id: 'shortest', label: 'Fastest', desc: 'Minimal walking distance' },
    { id: 'avoid_stairs', label: 'Avoid stairs', desc: 'Step-free elevators & ramps only' },
    { id: 'prefer_elevator', label: 'Prefer elevators', desc: 'Elevators prioritized over stairs' },
    { id: 'accessible_route', label: 'Accessible route', desc: 'Wheelchair & luggage path' }
  ];

  const handleSwap = () => {
    if (originNodeId && destinationNodeId) {
      const prevOrig = originNodeId;
      onOriginChange(destinationNodeId);
      onDestinationChange(prevOrig);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Indoor Wayfinding</h3>
          <p className="text-xs text-slate-500">Step-by-step directions inside the station</p>
        </div>
      </div>

      {/* Origin & Destination Controls */}
      <div className="space-y-3 relative">
        {/* Origin Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              From: Current location
            </span>
          </label>
          <select
            value={originNodeId}
            onChange={(e) => onOriginChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-slate-400 focus:bg-white focus:outline-none transition cursor-pointer"
          >
            <option value="">-- Select starting landmark --</option>
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
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5 text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            To: Destination
          </label>
          <select
            value={destinationNodeId}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-slate-400 focus:bg-white focus:outline-none transition cursor-pointer"
          >
            <option value="">-- Select destination platform or facility --</option>
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
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Route Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {preferences.map((pref) => (
            <button
              key={pref.id}
              type="button"
              onClick={() => onPreferenceChange(pref.id)}
              className={`p-2.5 rounded-xl text-left border text-xs transition ${
                routePreference === pref.id
                  ? 'border-slate-900 bg-slate-50 font-semibold text-slate-950 ring-1 ring-slate-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                {pref.id === 'avoid_stairs' ? (
                  <Accessibility className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                ) : pref.id === 'prefer_elevator' ? (
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : pref.id === 'accessible_route' ? (
                  <Accessibility className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-slate-900 shrink-0" />
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-slate-300/30 transition"
        >
          <Navigation className="w-4 h-4" />
          {isCalculating ? 'Finding Best Route...' : 'Get Directions'}
        </button>

        <button
          onClick={onClearRoute}
          className="p-3 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          title="Clear Route"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
