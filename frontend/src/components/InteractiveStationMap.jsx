import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function InteractiveStationMap({
  facilities = [],
  graph = null,
  activeRoute = null,
  originNodeId = null,
  destinationNodeId = null,
  selectedFacility = null,
  onSelectFacility,
  onSetOrigin,
  onSetDestination,
  activeCategoryFilter = 'all',
  onCategoryFilterChange
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredFacility, setHoveredFacility] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  const containerRef = useRef(null);

  // Reset zoom & pan
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2.2, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, z - 0.2));

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(2.2, Math.max(0.7, z + delta)));
  };

  // Build SVG path string for the active route
  const getRoutePathD = () => {
    if (!activeRoute || !activeRoute.path_node_ids || !graph) return null;
    const nodeCoords = activeRoute.path_node_ids
      .map((nid) => graph.nodes[nid])
      .filter(Boolean);

    if (nodeCoords.length < 2) return null;

    return nodeCoords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  };

  const routePathD = getRoutePathD();

  // Filter facilities based on active category
  const filteredFacilities = facilities.filter((f) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'washroom') return f.category === 'washroom';
    if (activeCategoryFilter === 'shoepolish') return f.category === 'shoepolish';
    if (activeCategoryFilter === 'elevator') return f.category === 'elevator';
    if (activeCategoryFilter === 'ticket') return f.category === 'ticket_counter';
    if (activeCategoryFilter === 'food_water') return f.category === 'food_stall' || f.category === 'drinking_water';
    if (activeCategoryFilter === 'platform') return f.category === 'platform';
    return true;
  });

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 select-none shadow-md flex flex-col">
      {/* Top Map Toolbar: Category Pills & Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-md">
          {[
            { id: 'all', label: 'All Layers' },
            { id: 'washroom', label: 'Washrooms' },
            { id: 'shoepolish', label: 'Shoe Polish' },
            { id: 'elevator', label: 'Elevators' },
            { id: 'ticket', label: 'Ticketing' },
            { id: 'food_water', label: 'Food & Water' },
            { id: 'platform', label: 'Platforms' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryFilterChange(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                activeCategoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-md">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Reset Map View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`px-2 py-1 text-xs font-medium rounded-lg transition ${
              showLegend ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Map Legend"
          >
            Legend
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative"
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '500px 325px'
          }}
        >
          <defs>
            {/* Track pattern */}
            <pattern id="track-pattern" width="12" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="3" x2="12" y2="3" stroke="#334155" strokeWidth="1" />
              <line x1="6" y1="0" x2="6" y2="6" stroke="#475569" strokeWidth="1.5" />
            </pattern>
            {/* Route glow filter */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="1000" height="650" fill="#090d16" />

          {/* Station Outer Boundary / Footprint */}
          <rect x="40" y="50" width="920" height="550" rx="16" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

          {/* Railway Tracks Areas between Platforms */}
          {/* Tracks 1 & 2 (between West & PF1/2) */}
          <rect x="150" y="90" width="70" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* Tracks 3 & 4 (between PF1/2 & PF3/4) */}
          <rect x="300" y="90" width="100" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* Tracks 5 & 6 (between PF3/4 & PF5/6) */}
          <rect x="480" y="90" width="100" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* Tracks 7 & 8 (between PF5/6 & East) */}
          <rect x="660" y="90" width="70" height="470" fill="url(#track-pattern)" opacity="0.6" />

          {/* West Concourse Footprint */}
          <g id="west-concourse">
            <rect x="50" y="160" width="90" height="340" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <text x="95" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
              WEST
            </text>
            <text x="95" y="205" fill="#64748b" fontSize="9" textAnchor="middle">
              Senapati Bapat
            </text>
          </g>

          {/* East Concourse Footprint (Main Concourse) */}
          <g id="east-concourse">
            <rect x="800" y="140" width="150" height="380" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="810" y="150" width="130" height="40" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="875" y="175" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              EAST MAIN CONCOURSE
            </text>
            <text x="875" y="505" fill="#64748b" fontSize="9" textAnchor="middle">
              Dadar TT / Swami Gyan Jivandas Marg
            </text>
          </g>

          {/* Platform Islands */}
          {/* Platforms 1 & 2 (Central Slow Line) */}
          <g id="platform-1-2">
            <rect x="230" y="90" width="60" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            {/* Safety tactile yellow lines */}
            <line x1="233" y1="95" x2="233" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="287" y1="95" x2="287" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
            <text x="245" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 1</text>
            <text x="275" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 2</text>
            <text x="260" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Slow Line</text>
          </g>

          {/* Platforms 3 & 4 (Central Fast Line) */}
          <g id="platform-3-4">
            <rect x="410" y="90" width="60" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="413" y1="95" x2="413" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="467" y1="95" x2="467" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
            <text x="425" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 3</text>
            <text x="455" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 4</text>
            <text x="440" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Fast Line</text>
          </g>

          {/* Platforms 5 & 6 (Mainline & Express Terminal) */}
          <g id="platform-5-6">
            <rect x="590" y="90" width="60" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="593" y1="95" x2="593" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="647" y1="95" x2="647" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
            <text x="605" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 5</text>
            <text x="635" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 6</text>
            <text x="620" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Terminal</text>
          </g>

          {/* Foot Overbridges (Overhead Layer) */}
          {/* North FOB */}
          <g id="fob-north">
            <rect x="70" y="165" width="770" height="30" rx="4" fill="#334155" opacity="0.85" stroke="#475569" strokeWidth="1" />
            <text x="500" y="184" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
              NORTH FOOT OVERBRIDGE
            </text>
          </g>

          {/* Central FOB (Primary Accessible Bridge with Elevators) */}
          <g id="fob-central">
            <rect x="60" y="315" width="810" height="34" rx="4" fill="#1e3a8a" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="500" y="336" fill="#93c5fd" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
              CENTRAL FOOT OVERBRIDGE (ACCESSIBLE ELEVATOR EQUIPPED)
            </text>
          </g>

          {/* South FOB */}
          <g id="fob-south">
            <rect x="70" y="465" width="770" height="30" rx="4" fill="#334155" opacity="0.85" stroke="#475569" strokeWidth="1" />
            <text x="500" y="484" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
              SOUTH FOOT OVERBRIDGE
            </text>
          </g>

          {/* Walkable Graph Edges (Subtle Guide Grid) */}
          {graph && graph.edges && (
            <g id="graph-edges" opacity="0.3">
              {graph.edges.map((edge) => {
                const u = graph.nodes[edge.from_node];
                const v = graph.nodes[edge.to_node];
                if (!u || !v) return null;
                return (
                  <line
                    key={edge.id}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={edge.edge_type === 'stairs' ? '#f59e0b' : edge.edge_type === 'elevator' ? '#10b981' : '#64748b'}
                    strokeWidth={edge.edge_type === 'elevator' ? 2 : 1.5}
                    strokeDasharray={edge.edge_type === 'stairs' ? '3 3' : undefined}
                  />
                );
              })}
            </g>
          )}

          {/* Active Route Highlight (Animated Glowing Polyline) */}
          {routePathD && (
            <g id="active-route" filter="url(#route-glow)">
              {/* Route shadow line */}
              <path
                d={routePathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              {/* Route animated foreground line */}
              <path
                d={routePathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animated-route-line"
              />
            </g>
          )}

          {/* Facility Markers & Interactive Nodes */}
          <g id="facilities-layer">
            {filteredFacilities.map((fac) => {
              if (!fac.svg_coords) return null;
              const { x, y } = fac.svg_coords;
              const isSelected = selectedFacility && selectedFacility.facility_id === fac.facility_id;
              const isOrigin = originNodeId === fac.node_id;
              const isDestination = destinationNodeId === fac.node_id;

              let markerColor = '#3b82f6';
              let badgeText = 'FAC';

              if (fac.category === 'washroom') {
                markerColor = '#6366f1';
                badgeText = 'WC';
              } else if (fac.category === 'shoepolish') {
                markerColor = '#d97706';
                badgeText = 'SHINE';
              } else if (fac.category === 'elevator') {
                markerColor = '#10b981';
                badgeText = 'LIFT';
              } else if (fac.category === 'ticket_counter') {
                markerColor = '#0284c7';
                badgeText = 'UTS';
              } else if (fac.category === 'food_stall') {
                markerColor = '#ea580c';
                badgeText = 'FOOD';
              } else if (fac.category === 'drinking_water') {
                markerColor = '#06b6d4';
                badgeText = 'H2O';
              } else if (fac.category === 'help_desk') {
                markerColor = '#3b82f6';
                badgeText = 'HELP';
              } else if (fac.category === 'entrance_exit') {
                markerColor = '#059669';
                badgeText = 'ENTRY';
              } else if (fac.category === 'platform') {
                markerColor = '#475569';
                badgeText = 'PF';
              }

              return (
                <g
                  key={fac.facility_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFacility(fac);
                  }}
                  onMouseEnter={() => setHoveredFacility(fac)}
                  onMouseLeave={() => setHoveredFacility(null)}
                  className="cursor-pointer transition-transform hover:scale-115"
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle cx={x} cy={y} r="18" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="animate-pulse" />
                  )}

                  {/* Marker Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? '13' : '10'}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="shadow-sm"
                  />

                  {/* Marker Text Label */}
                  <text
                    x={x}
                    y={y + 3}
                    fill="#ffffff"
                    fontSize={badgeText.length > 3 ? '6' : '7'}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {badgeText}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Current Landmark Waypoint Pin */}
          {originNodeId && graph && graph.nodes[originNodeId] && (
            <g id="origin-pin" className="pulsing-marker">
              <circle
                cx={graph.nodes[originNodeId].x}
                cy={graph.nodes[originNodeId].y}
                r="16"
                fill="#10b981"
                opacity="0.35"
              />
              <circle
                cx={graph.nodes[originNodeId].x}
                cy={graph.nodes[originNodeId].y}
                r="9"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <text
                x={graph.nodes[originNodeId].x}
                y={graph.nodes[originNodeId].y - 14}
                fill="#34d399"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                YOU ARE HERE
              </text>
            </g>
          )}

          {/* Destination Waypoint Pin */}
          {destinationNodeId && graph && graph.nodes[destinationNodeId] && (
            <g id="dest-pin">
              <circle
                cx={graph.nodes[destinationNodeId].x}
                cy={graph.nodes[destinationNodeId].y}
                r="16"
                fill="#ef4444"
                opacity="0.35"
              />
              <circle
                cx={graph.nodes[destinationNodeId].x}
                cy={graph.nodes[destinationNodeId].y}
                r="9"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <text
                x={graph.nodes[destinationNodeId].x}
                y={graph.nodes[destinationNodeId].y - 14}
                fill="#f87171"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                DESTINATION
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredFacility && (
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-xl max-w-xs pointer-events-none backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-200">{hoveredFacility.name}</span>
            <VerificationBadge status={hoveredFacility.verification_status} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{hoveredFacility.floor_level}</p>
        </div>
      )}

      {/* Selected Facility Inspector Card Overlay */}
      {selectedFacility && (
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/95 text-white p-4 rounded-2xl border border-blue-500/40 shadow-2xl max-w-sm w-full backdrop-blur-md animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                {selectedFacility.category.replace('_', ' ')}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{selectedFacility.name}</h4>
              <p className="text-xs text-slate-400">{selectedFacility.floor_level}</p>
            </div>
            <button
              onClick={() => onSelectFacility(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ×
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <span>Status: <strong className="text-emerald-400 capitalize">{selectedFacility.availability_status}</strong></span>
            <VerificationBadge status={selectedFacility.verification_status} />
          </div>

          {selectedFacility.notes && (
            <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              {selectedFacility.notes}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedFacility.node_id) {
                  onSetDestination(selectedFacility.node_id);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              Navigate Here
            </button>
            <button
              onClick={() => {
                if (selectedFacility.node_id) {
                  onSetOrigin(selectedFacility.node_id);
                }
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
              title="Set as your current starting landmark"
            >
              Set Start
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Legend Drawer */}
      {showLegend && (
        <div className="absolute top-16 right-3 z-20 bg-slate-900/95 border border-slate-800 p-3 rounded-xl shadow-xl text-xs text-slate-300 backdrop-blur-md w-56 space-y-2">
          <h5 className="font-bold text-white border-b border-slate-800 pb-1">Map Legend</h5>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>Washroom (Divyangjan accessible)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Shoe-Polishing Kiosk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Accessible Elevator (Lift)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span>Ticket Office / ATVM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span>IRCTC Food Stall</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>Drinking Water Tap</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-blue-600 rounded-sm" />
              <span>Central Foot Overbridge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 border-b-2 border-dashed border-sky-400" />
              <span>Calculated Indoor Route</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
