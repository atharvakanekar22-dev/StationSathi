import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import StationDashboard from './components/StationDashboard';
import DemoControlPanel from './components/DemoControlPanel';
import AssistantDrawer from './components/AssistantDrawer';
import StationInfoModal from './components/StationInfoModal';
import DeveloperPortal from './components/DeveloperPortal';
import ReportIssueModal from './components/ReportIssueModal';
import {
  checkBackendHealth,
  fetchStations,
  fetchStation,
  fetchStationGraph,
  fetchFacilities,
  fetchRoute,
  queryAssistant
} from './services/api';
import { FALLBACK_STATIONS, FALLBACK_DADAR_FACILITIES, FALLBACK_DADAR_GRAPH } from './data/fallbackData';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'demo'
  const [stations, setStations] = useState(FALLBACK_STATIONS);
  const [currentStationId, setCurrentStationId] = useState('dadar');
  const [currentStation, setCurrentStation] = useState(FALLBACK_STATIONS[0]);
  const [graph, setGraph] = useState(FALLBACK_DADAR_GRAPH);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Modals & Drawers
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Pass scenario triggers down to dashboard
  const [scenarioEvent, setScenarioEvent] = useState(null);

  // Hash change routing for #/demo
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/demo' || window.location.hash === '#demo') {
        setView('demo');
      } else if (window.location.hash === '#/landing') {
        setView('landing');
      }
    };

    if (window.location.hash === '#/demo' || window.location.hash === '#demo') {
      setView('demo');
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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

      // 4. Load initial station graph
      const gRes = await fetchStationGraph(currentStationId);
      if (gRes?.data) {
        setGraph(gRes.data);
      }
    }

    init();
  }, []);

  // Update currentStation and graph when currentStationId changes
  useEffect(() => {
    async function updateStationAndGraph() {
      if (!currentStationId) return;
      if (stations.length > 0) {
        const st = stations.find((s) => s.station_id === currentStationId);
        if (st) setCurrentStation(st);
      }
      const gRes = await fetchStationGraph(currentStationId);
      if (gRes?.data) {
        setGraph(gRes.data);
      }
    }
    updateStationAndGraph();
  }, [currentStationId, stations]);

  // Handle station switching
  const handleSelectStation = (stationId, extraPayload = null) => {
    setCurrentStationId(stationId);
    setView('dashboard');
    if (extraPayload) {
      setScenarioEvent({
        ...extraPayload,
        timestamp: Date.now()
      });
    }
  };

  // Reset Demo State
  const handleResetDemo = () => {
    setCurrentStationId('dadar');
    setView('dashboard');
    setScenarioEvent({ type: 'RESET', timestamp: Date.now() });
  };

  // Run predefined demo scenarios across stations
  const handleRunScenario = async (scenarioKeyOrId) => {
    window.location.hash = '';
    setView('dashboard');

    if (scenarioKeyOrId === 1 || scenarioKeyOrId === 'dadar_washroom') {
      // Scenario 1: Facility Discovery (Dadar -> Search washroom -> Highlight)
      setCurrentStationId('dadar');
      setScenarioEvent({
        type: 'SCENARIO_1',
        searchTerm: 'washroom',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 2 || scenarioKeyOrId === 'dadar_shoepolish') {
      // Scenario 2: Shoe-Polishing Service (Ask shoe polish query -> Highlight kiosk)
      setCurrentStationId('dadar');
      setIsAssistantOpen(true);
    } else if (scenarioKeyOrId === 3 || scenarioKeyOrId === 'dadar_shortest_pf11') {
      // Scenario 3: Indoor Navigation (East Entrance -> Platform 11 -> Shortest)
      setCurrentStationId('dadar');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_entrance_east',
        destinationNodeId: 'node_pf11',
        preference: 'shortest',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 4 || scenarioKeyOrId === 'dadar_accessible_pf10') {
      // Scenario 4: Accessibility Route (East Entrance -> Platform 10 -> Avoid Stairs via Elevator)
      setCurrentStationId('dadar');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_entrance_east',
        destinationNodeId: 'node_pf10',
        preference: 'avoid_stairs',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 5 || scenarioKeyOrId === 'csmt_suburban_pf4') {
      // Scenario 5: CSMT Suburban Buffer Navigation
      setCurrentStationId('csmt');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_csmt_gate_suburban',
        destinationNodeId: 'node_csmt_pf4',
        preference: 'shortest',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 'byculla_fob_pf3') {
      // Scenario: Byculla Heritage Gate to Platform 3
      setCurrentStationId('byculla');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_byculla_entrance_east',
        destinationNodeId: 'node_byculla_pf3',
        preference: 'shortest',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 'ghatkopar_metro_pf1') {
      // Scenario: Ghatkopar Metro 1 Interchange to Platform 1 (Accessible)
      setCurrentStationId('ghatkopar');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_ghatkopar_gate_metro',
        destinationNodeId: 'node_ghatkopar_pf1',
        preference: 'avoid_stairs',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 'thane_satis_pf1') {
      // Scenario: Thane Elevated SATIS Bus Deck to Platform 1
      setCurrentStationId('thane');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_thane_gate_satis',
        destinationNodeId: 'node_thane_pf1',
        preference: 'shortest',
        timestamp: Date.now()
      });
    } else if (scenarioKeyOrId === 'kalyan_west_pf4') {
      // Scenario: Kalyan West Bus Depot to Platform 4 Express
      setCurrentStationId('kalyan');
      setScenarioEvent({
        type: 'ROUTE',
        originNodeId: 'node_kalyan_gate_west',
        destinationNodeId: 'node_kalyan_pf4',
        preference: 'shortest',
        timestamp: Date.now()
      });
    } else if (typeof scenarioKeyOrId === 'object' && scenarioKeyOrId !== null) {
      if (scenarioKeyOrId.stationId) {
        setCurrentStationId(scenarioKeyOrId.stationId);
      }
      setScenarioEvent({
        ...scenarioKeyOrId,
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
    <div className="min-h-screen bg-[#e8edf2] py-3 sm:py-6 lg:py-8 px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans text-slate-900 antialiased">
      {/* Main Floating Application Shell (Vespa & Luxury Watch Canvas) */}
      <div className="w-full max-w-[1400px] min-h-[92vh] bg-[#fbfcfd] rounded-[2.25rem] sm:rounded-[2.75rem] shadow-2xl shadow-slate-400/25 border border-white/80 overflow-hidden flex flex-col relative">
        {/* Top Header */}
        <Header
          stations={stations}
          currentStationId={currentStationId}
          onSelectStation={handleSelectStation}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
          onGoHome={() => {
            window.location.hash = '';
            setView('landing');
          }}
        />

        {/* Main View Area */}
        <main className="flex-1 flex flex-col">
          {view === 'demo' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
              <DeveloperPortal
                stations={stations}
                onSelectStation={handleSelectStation}
                onRunScenario={handleRunScenario}
                onBackToApp={() => {
                  window.location.hash = '';
                  setView('dashboard');
                }}
              />
            </div>
          ) : view === 'landing' ? (
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

        {/* Passenger Footer */}
        <footer className="bg-white/80 backdrop-blur-xs border-t border-slate-200/70 py-5 px-6 sm:px-10 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">StationSathi</span>
              <span>•</span>
              <span>Intelligent Indoor Station Assistant for Mumbai Central Railway</span>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  window.location.hash = '';
                  setView('landing');
                }}
                className="text-slate-500 hover:text-slate-950 font-medium transition"
              >
                Home
              </button>
              <button
                onClick={() => {
                  window.location.hash = '';
                  setView('dashboard');
                }}
                className="text-slate-500 hover:text-slate-950 font-medium transition"
              >
                Station Map
              </button>
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="text-slate-500 hover:text-slate-950 font-medium transition"
              >
                Station Info
              </button>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="text-slate-500 hover:text-slate-950 font-medium transition"
              >
                Provide Feedback
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Demo Controller Modal (Legacy quick trigger) */}
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

      {/* Provide Feedback Modal */}
      <ReportIssueModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        stationId={currentStation?.station_id || 'dadar'}
        stationName={currentStation?.name || 'Dadar'}
      />
    </div>
  );
}
