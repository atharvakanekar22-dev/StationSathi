import React, { useState, useEffect, useRef } from 'react';
import InteractiveStationMap from './InteractiveStationMap';
import RoutePlanner from './RoutePlanner';
import DirectionsPanel from './DirectionsPanel';
import FacilitySearch from './FacilitySearch';
import ReportIssueModal from './ReportIssueModal';
import {
  fetchFacilities,
  fetchRoute
} from '../services/api';
import { MessageSquare } from 'lucide-react';

export default function StationDashboard({
  currentStation,
  graph,
  onOpenAssistant,
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

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingItem, setReportingItem] = useState(null);
  const routePlannerRef = useRef(null);
  const facilitiesRef = useRef(null);

  // Load facilities on station change
  useEffect(() => {
    async function loadData() {
      if (!currentStation) return;
      const res = await fetchFacilities(currentStation.station_id, activeCategory, searchTerm);
      setFacilities(res.data);
    }
    loadData();
  }, [currentStation?.station_id, activeCategory, searchTerm]);

  // Respond to quick actions and assistant events
  useEffect(() => {
    if (!selectedScenario) return;

    if (selectedScenario.type === 'NAVIGATE_SECTION') {
      const target = selectedScenario.section === 'route' ? routePlannerRef.current : facilitiesRef.current;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (selectedScenario.type === 'RESET') {
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
  async function handleCalculateRoute(customOrigin, customDest, customPref) {
    const orig = customOrigin || originNodeId;
    const dest = customDest || destinationNodeId;
    const pref = customPref || routePreference;

    if (!orig || !dest || !currentStation) return;

    setIsCalculatingRoute(true);
    const res = await fetchRoute(currentStation.station_id, orig, dest, pref);
    setActiveRoute(res.data);
    setIsCalculatingRoute(false);
  }

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

  return (
    <div className="dashboard-page flex-1 px-4 sm:px-8 py-6 space-y-6 flex flex-col">
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
            <span className="text-xs text-slate-400 font-medium">{currentStation.platforms_count} platforms</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Commuter Feedback Trigger */}
          <button
            onClick={() => handleOpenReport(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200 shadow-xs transition"
            title="Provide feedback on station information"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Feedback</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-blue-600 text-white rounded-full text-xs font-semibold shadow-xs transition"
          >
            <span className="text-sm leading-none">?</span>
            <span>Ask about this station</span>
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
          <div ref={routePlannerRef} className="dashboard-section-anchor">
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
          </div>

          {/* Facility Discovery Search */}
          <div ref={facilitiesRef} className="dashboard-section-anchor">
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
