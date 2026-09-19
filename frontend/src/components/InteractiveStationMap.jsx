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
  ExternalLink,
  MessageSquare
} from 'lucide-react';

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
  onCategoryFilterChange,
  station = null,
  onProvideFeedback
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredFacility, setHoveredFacility] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  const containerRef = useRef(null);

  // Reset zoom & pan when station changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [graph?.station_id]);

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

  const currentStationId = graph?.station_id || station?.station_id || 'dadar';

  // Render station architectural footprints based on station_id
  const renderStationGeometry = (sid) => {
    if (sid === 'csmt') {
      return (
        <g id="geometry-csmt">
          {/* Tracks Background Pattern */}
          <rect x="350" y="80" width="550" height="460" fill="url(#track-pattern)" opacity="0.6" />
          {/* Suburban Star Concourse */}
          <rect x="50" y="80" width="220" height="150" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="160" y="110" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">SUBURBAN STAR CONCOURSE</text>
          <text x="160" y="125" fill="#94a3b8" fontSize="9" textAnchor="middle">Walchand Hirachand Marg Gate</text>
          {/* Heritage Grand Concourse */}
          <rect x="50" y="240" width="220" height="130" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="160" y="270" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">HERITAGE CONCOURSE</text>
          <text x="160" y="285" fill="#94a3b8" fontSize="9" textAnchor="middle">Dr. D.N. Road Main Heritage Gate</text>
          {/* Mainline Outstation Concourse */}
          <rect x="50" y="380" width="220" height="160" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="160" y="410" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">MAINLINE TERMINUS CONCOURSE</text>
          <text x="160" y="425" fill="#94a3b8" fontSize="9" textAnchor="middle">P. D'Mello Road East Gate</text>
          {/* Concourse Buffer Stop Apron */}
          <rect x="275" y="80" width="60" height="460" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <text x="305" y="310" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 305 310)">BUFFER STOP APRON (STEP-FREE LEVEL)</text>
          {/* Platforms */}
          <g id="csmt-platforms">
            <rect x="345" y="110" width="460" height="45" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="440" y="137" fill="#e2e8f0" fontSize="11" fontWeight="bold">PF 1 (Harbour Line Buffer)</text>
            <rect x="345" y="180" width="460" height="45" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="440" y="207" fill="#e2e8f0" fontSize="11" fontWeight="bold">PF 4 (Main Line Suburban Buffer)</text>
            <rect x="345" y="245" width="460" height="45" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="440" y="272" fill="#e2e8f0" fontSize="11" fontWeight="bold">PF 7 (Fast Suburban Buffer)</text>
            <rect x="345" y="330" width="480" height="50" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="440" y="360" fill="#e2e8f0" fontSize="11" fontWeight="bold">PF 8 (Mainline Outstation Express)</text>
            <rect x="345" y="415" width="480" height="50" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="440" y="445" fill="#e2e8f0" fontSize="11" fontWeight="bold">PF 12 (Mainline Express Buffer)</text>
          </g>
        </g>
      );
    }

    if (sid === 'byculla') {
      return (
        <g id="geometry-byculla">
          <rect x="220" y="90" width="500" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* West Concourse */}
          <rect x="60" y="180" width="140" height="260" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="130" y="210" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">WEST CONCOURSE</text>
          <text x="130" y="225" fill="#64748b" fontSize="9" textAnchor="middle">Jijamata Udyan Side</text>
          {/* East Heritage Concourse */}
          <rect x="740" y="180" width="150" height="260" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="815" y="210" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">EAST HERITAGE HALL</text>
          <text x="815" y="225" fill="#64748b" fontSize="9" textAnchor="middle">Dr. Ambedkar Road</text>
          {/* Central FOB */}
          <rect x="60" y="285" width="830" height="30" rx="4" fill="#1e3a8a" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="480" y="305" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">CENTRAL FOOT OVERBRIDGE (EAST-WEST LINK)</text>
          {/* Platforms 1 & 2 */}
          <rect x="320" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="360" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 1 & 2</text>
          <text x="360" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Slow Corridor</text>
          {/* Platforms 3 & 4 */}
          <rect x="520" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="560" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 3 & 4</text>
          <text x="560" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Fast Corridor</text>
        </g>
      );
    }

    if (sid === 'ghatkopar') {
      return (
        <g id="geometry-ghatkopar">
          <rect x="250" y="90" width="500" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* Elevated Metro Line 1 Transfer Deck */}
          <rect x="50" y="160" width="180" height="260" rx="10" fill="#0f2942" stroke="#0ea5e9" strokeWidth="1.8" />
          <text x="140" y="195" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">METRO LINE 1 TRANSFER DECK</text>
          <text x="140" y="210" fill="#94a3b8" fontSize="9" textAnchor="middle">Elevated Interchange Concourse</text>
          {/* Skywalk Link */}
          <rect x="50" y="90" width="180" height="60" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <text x="140" y="125" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">WEST SKYWALK LINK</text>
          {/* East Concourse */}
          <rect x="760" y="180" width="140" height="260" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="830" y="210" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">EAST CONCOURSE</text>
          <text x="830" y="225" fill="#64748b" fontSize="9" textAnchor="middle">LBS Marg / Station Rd</text>
          {/* Middle FOB */}
          <rect x="60" y="265" width="840" height="30" rx="4" fill="#1e3a8a" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="480" y="285" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">MIDDLE FOOT OVERBRIDGE (METRO-RAILWAY HIGH CAPACITY)</text>
          {/* Platform 1 */}
          <rect x="330" y="90" width="70" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="365" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 1</text>
          <text x="365" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Slow NB</text>
          {/* Platform 2 & 3 */}
          <rect x="470" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="510" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 2 & 3</text>
          <text x="510" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Slow SB / Fast NB</text>
          {/* Platform 4 */}
          <rect x="635" y="90" width="70" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="670" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 4</text>
          <text x="670" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Fast SB</text>
        </g>
      );
    }

    if (sid === 'thane') {
      return (
        <g id="geometry-thane">
          <rect x="240" y="90" width="530" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* SATIS Elevated Bus Deck */}
          <rect x="45" y="90" width="150" height="90" rx="8" fill="#0f2942" stroke="#0284c7" strokeWidth="1.5" />
          <text x="120" y="120" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">SATIS BUS DECK</text>
          <text x="120" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">Elevated Bus Terminal</text>
          {/* SATIS Accessible Ramp */}
          <rect x="195" y="160" width="65" height="105" rx="4" fill="#1e3a8a" opacity="0.8" stroke="#3b82f6" strokeWidth="1" />
          <text x="227" y="215" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle" transform="rotate(90 227 215)">SATIS RAMP</text>
          {/* West Concourse */}
          <rect x="45" y="195" width="145" height="250" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="117" y="230" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">WEST CONCOURSE</text>
          <text x="117" y="245" fill="#64748b" fontSize="9" textAnchor="middle">Gokhale Rd / Talao Pali</text>
          {/* East Kopri Concourse */}
          <rect x="780" y="170" width="150" height="280" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="855" y="205" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">EAST KOPRI CONCOURSE</text>
          <text x="855" y="220" fill="#64748b" fontSize="9" textAnchor="middle">CIDCO Bus Terminal</text>
          {/* Central FOB */}
          <rect x="50" y="265" width="850" height="30" rx="4" fill="#1e3a8a" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="480" y="285" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">CENTRAL FOOT OVERBRIDGE (JUNCTION PASSENGER SPAN)</text>
          {/* Platform 1 & 2 */}
          <rect x="310" y="90" width="75" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="347" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 1 & 2</text>
          <text x="347" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Mainline Slow</text>
          {/* Platform 5 */}
          <rect x="475" y="90" width="70" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="510" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 5</text>
          <text x="510" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Express SB</text>
          {/* Platform 9 & 10 */}
          <rect x="640" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="680" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 9 & 10</text>
          <text x="680" y="140" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">Trans-Harbour</text>
        </g>
      );
    }

    if (sid === 'kalyan') {
      return (
        <g id="geometry-kalyan">
          <rect x="230" y="90" width="530" height="470" fill="url(#track-pattern)" opacity="0.6" />
          {/* West Concourse */}
          <rect x="50" y="180" width="145" height="270" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="122" y="215" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">WEST CONCOURSE</text>
          <text x="122" y="230" fill="#64748b" fontSize="9" textAnchor="middle">KDMT Bus Stand / Market</text>
          {/* West Accessible Ramp */}
          <rect x="195" y="175" width="65" height="90" rx="4" fill="#1e3a8a" opacity="0.8" stroke="#3b82f6" strokeWidth="1" />
          <text x="227" y="225" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle" transform="rotate(90 227 225)">DIVYANGJAN RAMP</text>
          {/* East Concourse */}
          <rect x="770" y="180" width="145" height="270" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="842" y="215" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">EAST CONCOURSE</text>
          <text x="842" y="230" fill="#64748b" fontSize="9" textAnchor="middle">Kolsewadi / Waldhuni</text>
          {/* South FOB */}
          <rect x="60" y="265" width="830" height="30" rx="4" fill="#1e3a8a" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="480" y="285" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">SOUTH FOOT OVERBRIDGE (JUNCTION DECK)</text>
          {/* Platform 1 */}
          <rect x="315" y="90" width="70" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="350" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 1</text>
          <text x="350" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Suburban Terminus</text>
          {/* Platform 4 & 5 */}
          <rect x="475" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="515" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 4 & 5</text>
          <text x="515" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Express Corridor</text>
          {/* Platform 7 */}
          <rect x="645" y="90" width="70" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="680" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 7</text>
          <text x="680" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Mainline Junction</text>
        </g>
      );
    }

    // Default: Dadar Central with corrected platform numbering (8, 9, 10, 11)
    return (
      <g id="geometry-dadar">
        <rect x="150" y="90" width="70" height="470" fill="url(#track-pattern)" opacity="0.6" />
        <rect x="300" y="90" width="100" height="470" fill="url(#track-pattern)" opacity="0.6" />
        <rect x="480" y="90" width="90" height="470" fill="url(#track-pattern)" opacity="0.6" />
        <rect x="650" y="90" width="75" height="470" fill="url(#track-pattern)" opacity="0.6" />

        {/* West Concourse Footprint */}
        <g id="west-concourse">
          <rect x="50" y="160" width="90" height="340" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="95" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">WEST</text>
          <text x="95" y="205" fill="#64748b" fontSize="9" textAnchor="middle">Senapati Bapat</text>
        </g>

        {/* East Main Concourse Footprint */}
        <g id="east-concourse">
          <rect x="800" y="140" width="150" height="380" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <rect x="810" y="150" width="130" height="40" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="875" y="175" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">EAST MAIN CONCOURSE</text>
          <text x="875" y="505" fill="#64748b" fontSize="9" textAnchor="middle">Dadar TT / Swami Gyan Jivandas Marg</text>
        </g>

        {/* Platform 8 (Renumbered Slow Line, widened platform) */}
        <g id="platform-8">
          <rect x="225" y="90" width="75" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <line x1="228" y1="95" x2="228" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="297" y1="95" x2="297" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
          <text x="262" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 8</text>
          <text x="262" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Slow Line NB</text>
        </g>

        {/* Platforms 9 & 10 (Fast Lines) */}
        <g id="platform-9-10">
          <rect x="395" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <line x1="398" y1="95" x2="398" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="472" y1="95" x2="472" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
          <text x="415" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 9</text>
          <text x="455" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 10</text>
          <text x="435" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Fast Line</text>
        </g>

        {/* Platforms 11 & 12 (Mainline & Express Terminal) */}
        <g id="platform-11-12">
          <rect x="575" y="90" width="80" height="470" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <line x1="578" y1="95" x2="578" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="652" y1="95" x2="652" y2="555" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
          <text x="595" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 11</text>
          <text x="635" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">PF 12</text>
          <text x="615" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Terminal</text>
        </g>

        {/* North FOB */}
        <g id="fob-north">
          <rect x="70" y="165" width="770" height="30" rx="4" fill="#334155" opacity="0.85" stroke="#475569" strokeWidth="1" />
          <text x="500" y="184" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">NORTH FOOT OVERBRIDGE</text>
        </g>

        {/* Central FOB (Accessible Elevator Equipped) */}
        <g id="fob-central">
          <rect x="60" y="315" width="810" height="34" rx="4" fill="#1e3a8a" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="500" y="336" fill="#93c5fd" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            CENTRAL FOOT OVERBRIDGE (ACCESSIBLE ELEVATOR EQUIPPED)
          </text>
        </g>

        {/* South FOB */}
        <g id="fob-south">
          <rect x="70" y="465" width="770" height="30" rx="4" fill="#334155" opacity="0.85" stroke="#475569" strokeWidth="1" />
          <text x="500" y="484" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">SOUTH FOOT OVERBRIDGE</text>
        </g>
      </g>
    );
  };

  return (
    <div className="relative w-full h-[540px] lg:h-[640px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800/90 select-none shadow-2xl shadow-slate-900/30 flex flex-col">
      {/* Top Map Toolbar: Category Pills & Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-slate-800 shadow-md">
          {[
            { id: 'all', label: 'All' },
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
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeCategoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Top Right: Accuracy Label & Map Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Map Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Station map</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-800 shadow-md text-slate-300">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-800 mx-0.5" />
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`p-1.5 rounded-lg transition ${
                showLegend ? 'bg-blue-600 text-white' : 'hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle Legend"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
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
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            <pattern id="track-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 0 6 L 12 6 M 6 0 L 6 12" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
            </pattern>
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid background */}
          <rect width="1000" height="650" fill="#020617" />
          <rect width="1000" height="650" fill="url(#grid)" />

          {/* Data-driven Station Architectural Footprints */}
          {renderStationGeometry(currentStationId)}

          {/* Walkable Graph Edges (Subtle Guide Grid) */}
          {graph && graph.edges && (
            <g id="graph-edges" opacity="0.35">
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
                    stroke={edge.edge_type === 'stairs' ? '#f59e0b' : edge.edge_type === 'elevator' ? '#10b981' : edge.edge_type === 'ramp' ? '#06b6d4' : '#64748b'}
                    strokeWidth={edge.edge_type === 'elevator' ? 2.5 : 1.5}
                    strokeDasharray={edge.edge_type === 'stairs' ? '3 3' : undefined}
                  />
                );
              })}
            </g>
          )}

          {/* Active Route Highlight (Animated Glowing Polyline) */}
          {routePathD && (
            <g id="active-route" filter="url(#route-glow)">
              <path
                d={routePathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
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
                markerColor = '#818cf8';
                badgeText = 'WC';
              } else if (fac.category === 'shoepolish') {
                markerColor = '#f59e0b';
                badgeText = 'SP';
              } else if (fac.category === 'elevator') {
                markerColor = '#10b981';
                badgeText = 'LIFT';
              } else if (fac.category === 'ticket_counter') {
                markerColor = '#0284c7';
                badgeText = 'UTS';
              } else if (fac.category === 'food_stall') {
                markerColor = '#f97316';
                badgeText = 'FOOD';
              } else if (fac.category === 'drinking_water') {
                markerColor = '#06b6d4';
                badgeText = 'H2O';
              } else if (fac.category === 'help_desk') {
                markerColor = '#a855f7';
                badgeText = 'RPF';
              } else if (fac.category === 'platform') {
                markerColor = '#64748b';
                badgeText = 'PF';
              }

              return (
                <g
                  key={fac.facility_id}
                  className="cursor-pointer transition-all duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFacility(fac);
                  }}
                  onMouseEnter={() => setHoveredFacility(fac)}
                  onMouseLeave={() => setHoveredFacility(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 16 : 11}
                    fill={markerColor}
                    fillOpacity={isSelected ? 0.35 : 0.15}
                    className={isSelected ? 'animate-ping' : ''}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : 7}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="url(#node-shadow)"
                  />
                  <text
                    x={x}
                    y={y + 16}
                    fill="#e2e8f0"
                    fontSize={isSelected ? '10' : '8'}
                    fontWeight="bold"
                    textAnchor="middle"
                    pointerEvents="none"
                    className="drop-shadow-md"
                  >
                    {badgeText}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Origin Starting Pin */}
          {originNodeId && graph && graph.nodes[originNodeId] && (
            <g id="origin-pin">
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
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              {hoveredFacility.category.replace('_', ' ')}
            </span>
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
            <span className="text-slate-400">Station information</span>
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

          {onProvideFeedback && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onProvideFeedback(selectedFacility);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Provide feedback</span>
              </button>
            </div>
          )}
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
              <span>Foot Overbridge / Ramp</span>
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
