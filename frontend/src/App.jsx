import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import StationDashboard from './components/StationDashboard';
import AssistantDrawer from './components/AssistantDrawer';
import StationInfoModal from './components/StationInfoModal';
import ReportIssueModal from './components/ReportIssueModal';
import {
  fetchStations,
  fetchStationGraph,
  queryAssistant,
  checkBackendHealth
} from './services/api';
import { FALLBACK_STATIONS, FALLBACK_DADAR_GRAPH } from './data/fallbackData';

export default function App() {
  const [view, setView] = useState('landing');
  const [stations, setStations] = useState(FALLBACK_STATIONS);
  const [currentStationId, setCurrentStationId] = useState('dadar');
  const [currentStation, setCurrentStation] = useState(FALLBACK_STATIONS[0]);
  const [graph, setGraph] = useState(FALLBACK_DADAR_GRAPH);
  const [dataMode, setDataMode] = useState('checking');

  // Modals & Drawers
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Pass scenario triggers down to dashboard
  const [scenarioEvent, setScenarioEvent] = useState(null);

  // Initial check and station list loading
  useEffect(() => {
    async function init() {
      const [res, health] = await Promise.all([fetchStations(), checkBackendHealth()]);
      setStations(res.data);
      setDataMode(res.fallback || !health.online ? 'offline' : 'live');

      const st = res.data.find((s) => s.station_id === currentStationId) || res.data[0];
      setCurrentStation(st);

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
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
      <div className="min-h-screen bg-white flex flex-col">
        {/* Top Header */}
        <Header
          stations={stations}
          currentStationId={currentStationId}
          onSelectStation={handleSelectStation}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
          dataMode={dataMode}
          onGoHome={() => {
            window.location.hash = '';
            setView('landing');
          }}
        />

        <main className="flex-1 flex flex-col">
          {view === 'landing' ? (
            <LandingPage
              stations={stations}
              onSelectStation={handleSelectStation}
            />
          ) : (
            <StationDashboard
              currentStation={currentStation}
              graph={graph}
              onSelectStation={handleSelectStation}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              selectedScenario={scenarioEvent}
            />
          )}
        </main>

        <footer className="bg-slate-50 border-t border-slate-200 py-4 px-6 sm:px-10 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">StationSathi</span>
              <span>•</span>
              <span>Station maps, facilities and step-free directions</span>
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
                Map
              </button>
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="text-slate-500 hover:text-slate-950 font-medium transition"
              >
                Info
              </button>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="text-slate-500 hover:text-slate-950 font-medium transition"
              >
                Feedback
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
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
