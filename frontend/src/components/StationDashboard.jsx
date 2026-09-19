import React, { useState, useEffect } from 'react';
import InteractiveStationMap from './InteractiveStationMap';
import RoutePlanner from './RoutePlanner';
import DirectionsPanel from './DirectionsPanel';
import FacilitySearch from './FacilitySearch';
import BasicStationView from './BasicStationView';
import ReportIssueModal from './ReportIssueModal';
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
  AlertCircle,
  RotateCcw,
  Compass,
  MessageSquare
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

  const [showFactsheet, setShowFactsheet] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingItem, setReportingItem] = useState(null);

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
      setShowFactsheet(false);
    } else if (selectedScenario.type === 'SCENARIO_1') {
      setSearchTerm('washroom');
      setActiveCategory('washroom');
      const washroom = facilities.find((f) => f.category === 'washroom');
      if (washroom) {
        setSelectedFacility(washroom);
      }
    } else if (selectedScenario.type === 'SCENARIO_3') {
      setOriginNodeId('node_entrance_east');
      setDestinationNodeId('node_pf11');
      setRoutePreference('shortest');
      handleCalculateRoute('node_entrance_east', 'node_pf11', 'shortest');
    } else if (selectedScenario.type === 'SCENARIO_4') {
      setOriginNodeId('node_entrance_east');
      setDestinationNodeId('node_pf10');
      setRoutePreference('avoid_stairs');
      handleCalculateRoute('node_entrance_east', 'node_pf10', 'avoid_stairs');
    } else if (selectedScenario.type === 'ROUTE') {
      if (selectedScenario.originNodeId) setOriginNodeId(selectedScenario.originNodeId);
      if (selectedScenario.destinationNodeId) setDestinationNodeId(selectedScenario.destinationNodeId);
      if (selectedScenario.preference) setRoutePreference(selectedScenario.preference);
      if (selectedScenario.originNodeId && selectedScenario.destinationNodeId) {
        handleCalculateRoute(
          selectedScenario.originNodeId,
          selectedScenario.destinationNodeId,
          selectedScenario.preference || 'shortest'
        );
      }
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
    } else if (selectedScenario.searchTerm || selectedScenario.category) {
      if (selectedScenario.searchTerm) setSearchTerm(selectedScenario.searchTerm);
      if (selectedScenario.category) setActiveCategory(selectedScenario.category);
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

  // Report issue handler
  const handleOpenReport = (item = null) => {
    setReportingItem(item);
    setIsReportModalOpen(true);
  };

  // Guard for null station
  if (!currentStation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Loading station data...
      </div>
    );
  }

  // Toggleable factsheet view
  if (showFactsheet) {
    return (
      <div className="space-y-4">
        <div className="max-w-5xl mx-auto px-4 pt-4 flex justify-end">
          <button
            onClick={() => setShowFactsheet(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Return to Interactive Map</span>
          </button>
        </div>
        <BasicStationView
          station={currentStation}
          facilities={facilities}
          onSwitchToDadar={() => {
            setShowFactsheet(false);
            onSelectStation('dadar');
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-8 py-6 space-y-6 flex flex-col">
      {/* Station Overview & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {currentStation.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {currentStation.code}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {currentStation.platforms_count} Platforms
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {currentStation.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Commuter Feedback Trigger */}
          <button
            onClick={() => handleOpenReport(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200 shadow-xs transition"
            title="Provide feedback on station information"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Provide feedback</span>
          </button>

          <button
            onClick={() => setShowFactsheet(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200 shadow-xs transition"
            title="View Station Information Summary & Platform Layout"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>Overview</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-blue-600 text-white rounded-full text-xs font-semibold shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistant</span>
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
            station={currentStation}
            onProvideFeedback={handleOpenReport}
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
            onReportIssue={handleOpenReport}
          />
        </div>
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        stationId={currentStation.station_id}
        stationName={currentStation.name}
        targetItem={reportingItem}
      />
    </div>
  );
}
