import React, { useState, useEffect } from 'react';
import InteractiveStationMap from './InteractiveStationMap';
import RoutePlanner from './RoutePlanner';
import DirectionsPanel from './DirectionsPanel';
import FacilitySearch from './FacilitySearch';
import BasicStationView from './BasicStationView';
import VerificationBadge from './VerificationBadge';
import {
  fetchFacilities,
  fetchRoute,
  queryAssistant
} from '../services/api';
import {
  Navigation,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Compass
} from 'lucide-react';

export default function StationDashboard({
  currentStation,
  graph,
  onSelectStation,
  onOpenAssistant,
  onOpenInfoModal,
  selectedScenario = null
}) {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Routing State
  const [originNodeId, setOriginNodeId] = useState('');
  const [destinationNodeId, setDestinationNodeId] = useState('');
  const [routePreference, setRoutePreference] = useState('shortest');
  const [activeRoute, setActiveRoute] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Load facilities on station change
  useEffect(() => {
    async function loadData() {
      if (!currentStation) return;
      const res = await fetchFacilities(currentStation.station_id, activeCategory, searchTerm);
      setFacilities(res.data);
    }
    loadData();
  }, [currentStation?.station_id, activeCategory, searchTerm]);

  // Respond to Demo Controller Scenarios & Assistant Events
  useEffect(() => {
    if (!selectedScenario) return;

    if (selectedScenario.type === 'RESET') {
      setActiveRoute(null);
      setOriginNodeId('');
      setDestinationNodeId('');
      setSelectedFacility(null);
      setSearchTerm('');
      setActiveCategory('all');
    } else if (selectedScenario.type === 'SCENARIO_1') {
      setSearchTerm('washroom');
      setActiveCategory('washroom');
      const washroom = facilities.find((f) => f.category === 'washroom');
      if (washroom) {
        setSelectedFacility(washroom);
      }
    } else if (selectedScenario.type === 'SCENARIO_3') {
      setOriginNodeId('node_entrance_east');
      setDestinationNodeId('node_pf5');
      setRoutePreference('shortest');
      handleCalculateRoute('node_entrance_east', 'node_pf5', 'shortest');
    } else if (selectedScenario.type === 'SCENARIO_4') {
      setOriginNodeId('node_entrance_east');
      setDestinationNodeId('node_pf4');
      setRoutePreference('avoid_stairs');
      handleCalculateRoute('node_entrance_east', 'node_pf4', 'avoid_stairs');
    } else if (selectedScenario.type === 'APPLY_ASSISTANT') {
      if (selectedScenario.originNodeId) setOriginNodeId(selectedScenario.originNodeId);
      if (selectedScenario.destinationNodeId) setDestinationNodeId(selectedScenario.destinationNodeId);
      if (selectedScenario.preference) setRoutePreference(selectedScenario.preference);
      if (selectedScenario.category) setActiveCategory(selectedScenario.category);

      if (selectedScenario.originNodeId && selectedScenario.destinationNodeId) {
        handleCalculateRoute(
          selectedScenario.originNodeId,
          selectedScenario.destinationNodeId,
          selectedScenario.preference || 'shortest'
        );
      }
    }
  }, [selectedScenario]);

  // Route calculation
  const handleCalculateRoute = async (customOrigin, customDest, customPref) => {
    const orig = customOrigin || originNodeId;
    const dest = customDest || destinationNodeId;
    const pref = customPref || routePreference;

    if (!orig || !dest || !currentStation) return;

    setIsCalculatingRoute(true);
    const res = await fetchRoute(currentStation.station_id, orig, dest, pref);
    setActiveRoute(res.data);
    setIsCalculatingRoute(false);
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
    setOriginNodeId('');
    setDestinationNodeId('');
    setSelectedFacility(null);
  };

  // Facility selection
  const handleSelectFacility = (fac) => {
    setSelectedFacility(fac);
    if (fac && fac.node_id) {
      setDestinationNodeId(fac.node_id);
    }
  };

  // Guard for null station
  if (!currentStation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Loading station data...
      </div>
    );
  }

  // If station is not detailed prototype, show BasicStationView
  if (currentStation.coverage !== 'detailed_prototype') {
    return (
      <BasicStationView
        station={currentStation}
        facilities={facilities}
        onSwitchToDadar={() => onSelectStation('dadar')}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Station Overview & Control Strip */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentStation.name} ({currentStation.code})
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Detailed Navigation Active
            </span>
            <VerificationBadge status={currentStation.verification_status} />
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {currentStation.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition border border-blue-200"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Assistant Query</span>
          </button>
          <button
            onClick={onOpenInfoModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <Info className="w-4 h-4" />
            <span>Station Info</span>
          </button>
        </div>
      </div>

      {/* Main Work Area: Interactive Map & Wayfinding Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive 2D SVG Station Map */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveStationMap
            facilities={facilities}
            graph={graph}
            activeRoute={activeRoute}
            originNodeId={originNodeId}
            destinationNodeId={destinationNodeId}
            selectedFacility={selectedFacility}
            onSelectFacility={handleSelectFacility}
            onSetOrigin={(nodeId) => setOriginNodeId(nodeId)}
            onSetDestination={(nodeId) => {
              setDestinationNodeId(nodeId);
              if (originNodeId) {
                handleCalculateRoute(originNodeId, nodeId, routePreference);
              }
            }}
            activeCategoryFilter={activeCategory}
            onCategoryFilterChange={(cat) => setActiveCategory(cat)}
          />

          {/* Turn-by-Turn Directions Panel (Appears when route is active) */}
          {activeRoute && (
            <DirectionsPanel
              route={activeRoute}
              onClose={() => setActiveRoute(null)}
            />
          )}
        </div>

        {/* Right Column: Route Planner & Facility Discovery Search */}
        <div className="lg:col-span-4 space-y-4">
          {/* Indoor Route Planner */}
          <RoutePlanner
            graph={graph}
            originNodeId={originNodeId}
            destinationNodeId={destinationNodeId}
            routePreference={routePreference}
            onOriginChange={(nodeId) => setOriginNodeId(nodeId)}
            onDestinationChange={(nodeId) => setDestinationNodeId(nodeId)}
            onPreferenceChange={(pref) => setRoutePreference(pref)}
            onCalculateRoute={() => handleCalculateRoute()}
            onClearRoute={handleClearRoute}
            isCalculating={isCalculatingRoute}
          />

          {/* Facility Discovery Search */}
          <FacilitySearch
            facilities={facilities}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
            onSelectFacility={handleSelectFacility}
            onSetDestination={(nodeId) => {
              setDestinationNodeId(nodeId);
              if (originNodeId) {
                handleCalculateRoute(originNodeId, nodeId, routePreference);
              }
            }}
            selectedFacility={selectedFacility}
          />
        </div>
      </div>
    </div>
  );
}
