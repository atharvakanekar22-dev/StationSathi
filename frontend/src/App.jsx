import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import StationDashboard from './components/StationDashboard';
import DemoControlPanel from './components/DemoControlPanel';
import AssistantDrawer from './components/AssistantDrawer';
import StationInfoModal from './components/StationInfoModal';
import {
  checkBackendHealth,
  fetchStations,
  fetchStation,
  fetchFacilities,
  fetchRoute,
  queryAssistant
} from './services/api';
import { FALLBACK_STATIONS, FALLBACK_DADAR_FACILITIES, FALLBACK_DADAR_GRAPH } from './data/fallbackData';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'landing'
  const [stations, setStations] = useState(FALLBACK_STATIONS);
  const [currentStationId, setCurrentStationId] = useState('dadar');
  const [currentStation, setCurrentStation] = useState(FALLBACK_STATIONS[0]);
  const [graph, setGraph] = useState(FALLBACK_DADAR_GRAPH);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Modals & Drawers
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Pass scenario triggers down to dashboard
  const [scenarioEvent, setScenarioEvent] = useState(null);

  // Initial check and station list loading
  useEffect(() => {
    async function init() {
      // 1. Health check
      const health = await checkBackendHealth();
      setIsLiveBackend(health.online);

      // 2. Fetch stations
      const res = await fetchStations();
      setStations(res.data);

      // 3. Set current station
      const st = res.data.find((s) => s.station_id === currentStationId) || res.data[0];
      setCurrentStation(st);

      // 4. Load Dadar graph from API if live
      try {
        const gRes = await fetch('/api/stations/dadar/graph');
        if (gRes.ok) {
          setGraph(await gRes.json());
        }
      } catch (e) {
        // Keeps FALLBACK_DADAR_GRAPH
      }
    }

    init();
  }, []);

  // Update currentStation when currentStationId or stations change
  useEffect(() => {
    if (stations.length > 0) {
      const st = stations.find((s) => s.station_id === currentStationId);
      if (st) setCurrentStation(st);
    }
  }, [currentStationId, stations]);

  // Handle station switching
  const handleSelectStation = (stationId) => {
    setCurrentStationId(stationId);
    setView('dashboard');
  };

  // Reset Demo State
  const handleResetDemo = () => {
    setCurrentStationId('dadar');
    setView('dashboard');
    setScenarioEvent({ type: 'RESET', timestamp: Date.now() });
  };

  // Run the 5 predefined demo scenarios from Module 13
  const handleRunScenario = async (scenarioNumber) => {
    setView('dashboard');

    if (scenarioNumber === 1) {
      // Scenario 1: Facility Discovery (Dadar -> Search washroom -> Highlight)
      setCurrentStationId('dadar');
      setScenarioEvent({
        type: 'SCENARIO_1',
        searchTerm: 'washroom',
        timestamp: Date.now()
      });
    } else if (scenarioNumber === 2) {
      // Scenario 2: Shoe-Polishing Service (Ask shoe polish query -> Highlight kiosk)
      setCurrentStationId('dadar');
      setIsAssistantOpen(true);
    } else if (scenarioNumber === 3) {
      // Scenario 3: Indoor Navigation (East Entrance -> Platform 5 -> Shortest)
      setCurrentStationId('dadar');
      setScenarioEvent({
        type: 'SCENARIO_3',
        originNodeId: 'node_entrance_east',
        destinationNodeId: 'node_pf5',
        preference: 'shortest',
        timestamp: Date.now()
      });
    } else if (scenarioNumber === 4) {
      // Scenario 4: Accessibility Route (East Entrance -> Platform 4 -> Avoid Stairs)
      setCurrentStationId('dadar');
      setScenarioEvent({
        type: 'SCENARIO_4',
        originNodeId: 'node_entrance_east',
        destinationNodeId: 'node_pf4',
        preference: 'avoid_stairs',
        timestamp: Date.now()
      });
    } else if (scenarioNumber === 5) {
      // Scenario 5: Station Switching (Dadar -> Thane)
      setCurrentStationId('thane');
      setScenarioEvent({
        type: 'SCENARIO_5',
        timestamp: Date.now()
      });
    }
  };

  // Natural Language query handler
  const handleAskQuery = async (queryText) => {
    return await queryAssistant(queryText, currentStationId, null);
  };

  // Apply assistant result into dashboard
  const handleApplyAssistantResult = (resData) => {
    if (resData.recommended_destination_node_id) {
      setScenarioEvent({
        type: 'APPLY_ASSISTANT',
        destinationNodeId: resData.recommended_destination_node_id,
        originNodeId: resData.recommended_origin_node_id || 'node_entrance_east',
        preference: resData.route_preference || 'shortest',
        category: resData.category,
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        stations={stations}
        currentStationId={currentStationId}
        onSelectStation={handleSelectStation}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        onGoHome={() => setView('landing')}
        isLiveBackend={isLiveBackend}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {view === 'landing' ? (
          <LandingPage
            stations={stations}
            onSelectStation={handleSelectStation}
            onExploreClick={() => setView('dashboard')}
          />
        ) : (
          <StationDashboard
            currentStation={currentStation}
            graph={graph}
            onSelectStation={handleSelectStation}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onOpenInfoModal={() => setIsInfoModalOpen(true)}
            selectedScenario={scenarioEvent}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">StationSathi</span>
            <span>•</span>
            <span>Mumbai Central Railway Indoor Wayfinding Prototype</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Dadar Central (DR)</span>
            <span>•</span>
            <span>Dijkstra Weighted Cost Routing</span>
            <span>•</span>
            <span>Grounded Natural-Language Assistant</span>
          </div>
        </div>
      </footer>

      {/* Demo Controller Modal */}
      <DemoControlPanel
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        onResetDemo={handleResetDemo}
        onRunScenario={handleRunScenario}
      />

      {/* Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        stationId={currentStationId}
        currentNodeId={null}
        onApplyAssistantResult={handleApplyAssistantResult}
        onAskQuery={handleAskQuery}
      />

      {/* Station Information Modal */}
      <StationInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        station={currentStation}
      />
    </div>
  );
}
