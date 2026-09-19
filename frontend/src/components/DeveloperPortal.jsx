import React, { useState } from 'react';
import {
  Server,
  Play,
  RotateCcw,
  Network,
  Database,
  Cpu,
  ArrowLeft,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Accessibility,
  Train,
  Layers,
  Info
} from 'lucide-react';

export default function DeveloperPortal({
  stations = [],
  currentStationId = 'dadar',
  onSelectStation,
  graph = null,
  isLiveBackend = true,
  onRunScenario,
  onResetDemo,
  onReturnToPassengerView
}) {
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'graph' | 'routing' | 'provenance' | 'system'
  const [selectedStationTab, setSelectedStationTab] = useState(currentStationId);

  const activeStation = stations.find((s) => s.station_id === selectedStationTab) || stations[0];
  const nodesList = graph?.nodes ? Object.values(graph.nodes) : [];
  const edgesList = graph?.edges || [];

  const scenarios = [
    {
      id: 'dadar_1',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Facility Discovery (Washrooms)',
      category: 'Facility Search',
      desc: 'Filters Dadar washrooms, highlights on SVG map, inspects Divyangjan accessibility notes.',
      action: () => {
        onRunScenario('dadar_washroom');
        onReturnToPassengerView();
      }
    },
    {
      id: 'dadar_2',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Licensed Shoe-Polishing (Platform 8)',
      category: 'Micro-Amenity',
      desc: 'Assistant NLP query identifies licensed shoe-shine kiosk on widened Platform 8 (former PF 1/2 island).',
      action: () => {
        onRunScenario('dadar_shoepolish');
        onReturnToPassengerView();
      }
    },
    {
      id: 'dadar_3',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Shortest Route to Platform 11',
      category: 'Dijkstra Routing',
      desc: 'East Concourse to Platform 11 via Central FOB staircase (127m, ~169 steps, stairs warning).',
      action: () => {
        onRunScenario('dadar_shortest_pf11');
        onReturnToPassengerView();
      }
    },
    {
      id: 'dadar_4',
      stationId: 'dadar',
      stationName: 'Dadar Central',
      title: 'Step-Free Elevator Route to Platform 10',
      category: 'Accessibility',
      desc: 'Strict stair-elimination route via East Concourse elevator, bridge deck, and Platform 10 lift.',
      action: () => {
        onRunScenario('dadar_accessible_pf10');
        onReturnToPassengerView();
      }
    },
    {
      id: 'csmt_1',
      stationId: 'csmt',
      stationName: 'CSMT',
      title: 'Suburban Concourse to Platform 4',
      category: 'Multi-Station',
      desc: 'Walchand Hirachand Marg entrance to buffer stop apron (step-free buffer concourse).',
      action: () => {
        onRunScenario('csmt_suburban_pf4');
        onReturnToPassengerView();
      }
    },
    {
      id: 'byculla_1',
      stationId: 'byculla',
      stationName: 'Byculla',
      title: 'Heritage East Gate to Platform 3',
      category: 'Multi-Station',
      desc: 'Dr. Ambedkar Road heritage hall across Central FOB to Platform 3.',
      action: () => {
        onRunScenario('byculla_fob_pf3');
        onReturnToPassengerView();
      }
    },
    {
      id: 'ghatkopar_1',
      stationId: 'ghatkopar',
      stationName: 'Ghatkopar',
      title: 'Metro 1 Interchange to Platform 1',
      category: 'Multimodal Hub',
      desc: 'Elevated Metro Line 1 concourse directly to Platform 1 via dedicated accessible lift.',
      action: () => {
        onRunScenario('ghatkopar_metro_pf1');
        onReturnToPassengerView();
      }
    },
    {
      id: 'thane_1',
      stationId: 'thane',
      stationName: 'Thane',
      title: 'SATIS Bus Deck to Platform 1',
      category: 'Multimodal Hub',
      desc: 'Elevated SATIS bus terminal via accessible connecting ramp to Central FOB & Platform 1.',
      action: () => {
        onRunScenario('thane_satis_pf1');
        onReturnToPassengerView();
      }
    },
    {
      id: 'kalyan_1',
      stationId: 'kalyan',
      stationName: 'Kalyan',
      title: 'West Bus Depot to Express Platform 4',
      category: 'Multi-Station',
      desc: 'West Bus Depot Entrance with ground ramp across South FOB to Platform 4.',
      action: () => {
        onRunScenario('kalyan_west_pf4');
        onReturnToPassengerView();
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Banner */}
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToPassengerView}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Passenger App</span>
            </button>
            <div className="h-5 w-px bg-slate-800" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Developer & Mentor Portal</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  DEMO / TECHNICAL MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Technical depth, graph topology, algorithms & provenance</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isLiveBackend ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-amber-950/60 text-amber-400 border-amber-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isLiveBackend ? 'FastAPI Backend Live (:8000)' : 'Client-Side Offline Mode'}</span>
            </div>

            <button
              onClick={onResetDemo}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-semibold">
          {[
            { id: 'scenarios', label: 'Evaluation Scenarios', icon: <Play className="w-3.5 h-3.5" /> },
            { id: 'graph', label: 'Graph Topology', icon: <Network className="w-3.5 h-3.5" /> },
            { id: 'routing', label: 'Dijkstra Cost Model', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'provenance', label: 'Provenance & Sources', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'system', label: 'System Health & APIs', icon: <Server className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab 1: Evaluation Scenarios */}
        {activeTab === 'scenarios' && (
          <div className="space-y-5">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white">Live Demonstration Scenarios (All 6 Stations)</h2>
              <p className="text-xs text-slate-400 mt-1">
                Clicking "Run Scenario" applies origin, destination, or search query parameters and navigates directly into the passenger view.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                        {sc.stationName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{sc.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{sc.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{sc.desc}</p>
                  </div>

                  <button
                    onClick={sc.action}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Scenario in App</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Graph Topology Inspector */}
        {activeTab === 'graph' && (
          <div className="space-y-5">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">Topological Graph Inspector</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect nodes, edges, distance types, and accessibility constraints across stations
                </p>
              </div>

              {/* Station selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {stations.map((st) => (
                  <button
                    key={st.station_id}
                    onClick={() => {
                      setSelectedStationTab(st.station_id);
                      onSelectStation(st.station_id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedStationTab === st.station_id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Graph Nodes</span>
                <span className="text-xl font-bold text-white">{nodesList.length}</span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Graph Edges</span>
                <span className="text-xl font-bold text-white">{edgesList.length}</span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Accessible Edges</span>
                <span className="text-xl font-bold text-emerald-400">
                  {edgesList.filter((e) => e.is_accessible).length}
                </span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Stair Edges</span>
                <span className="text-xl font-bold text-amber-400">
                  {edgesList.filter((e) => e.edge_type === 'stairs' || !e.is_accessible).length}
                </span>
              </div>
            </div>

            {/* Edges Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Walkable Edges ({edgesList.length})
                </h3>
                <span className="text-[11px] text-slate-500">Unit: Meters</span>
              </div>
              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Edge ID</th>
                      <th className="p-3">From</th>
                      <th className="p-3">To</th>
                      <th className="p-3">Distance</th>
                      <th className="p-3">Distance Type</th>
                      <th className="p-3">Edge Type</th>
                      <th className="p-3">Accessibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {edgesList.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono text-slate-400">{e.id}</td>
                        <td className="p-3 font-mono text-slate-300">{e.from_node}</td>
                        <td className="p-3 font-mono text-slate-300">{e.to_node}</td>
                        <td className="p-3 font-bold text-white">{e.distance_m} m</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                            {e.distance_type || 'estimated'}
                          </span>
                        </td>
                        <td className="p-3 capitalize text-slate-300">{e.edge_type}</td>
                        <td className="p-3">
                          {e.is_accessible ? (
                            <span className="text-emerald-400 font-semibold">Step-free</span>
                          ) : (
                            <span className="text-amber-400 font-semibold">Stairs</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dijkstra Cost Model */}
        {activeTab === 'routing' && (
          <div className="space-y-5">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white">Dijkstra Weighted-Cost Engine Formulation</h2>
              <p className="text-xs text-slate-400 mt-1">
                Mathematical routing weights used internally. Physical distance metrics (steps, walk time) always use genuine physical edge distance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400">1. Preference: Avoid Stairs (Step-Free)</h3>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                  <p>if edge.is_stairs or not edge.is_accessible:</p>
                  <p className="text-rose-400">    cost = Infinity (pruned from priority queue)</p>
                  <p>elif edge.is_elevator:</p>
                  <p className="text-emerald-400">    cost = distance * 0.9 (slight priority bonus)</p>
                  <p>else:</p>
                  <p>    cost = distance</p>
                </div>
                <p className="text-xs text-slate-400">
                  Guarantees that passengers with wheelchairs or luggage will never be routed onto stairs.
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-blue-400">2. Preference: Prefer Elevator</h3>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                  <p>if edge.is_stairs:</p>
                  <p className="text-amber-400">    cost = (distance * 5.0) + 50.0 (high stair penalty)</p>
                  <p>elif edge.is_elevator:</p>
                  <p className="text-emerald-400">    cost = distance * 0.7 (high elevator preference)</p>
                  <p>else:</p>
                  <p>    cost = distance</p>
                </div>
                <p className="text-xs text-slate-400">
                  Allows stairs if no elevator is physically available, but will walk up to 5x further to use a lift.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Provenance & Sources */}
        {activeTab === 'provenance' && (
          <div className="space-y-5">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white">Data Provenance & Source Catalog</h2>
              <p className="text-xs text-slate-400 mt-1">
                Every station, platform, and amenity retains explicit source metadata and verification tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map((st) => (
                <div key={st.station_id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{st.name} ({st.code})</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {st.verification_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.platform_information}</p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
                    <p><strong>Method:</strong> {st.source_method}</p>
                    {st.source_reference && <p><strong>Reference:</strong> {st.source_reference}</p>}
                    <p><strong>Updated:</strong> {st.last_updated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: System Health & APIs */}
        {activeTab === 'system' && (
          <div className="space-y-5">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white">System Health & API Endpoints</h2>
              <p className="text-xs text-slate-400 mt-1">
                FastAPI backend service endpoints and inspection tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Interactive Documentation</h3>
                <p className="text-xs text-slate-400">
                  Swagger UI documentation automatically generated from FastAPI schemas.
                </p>
                <div className="flex gap-2">
                  <a
                    href="http://127.0.0.1:8000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Swagger UI (:8000/docs)</span>
                  </a>
                  <a
                    href="http://127.0.0.1:8000/api/health"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    <span>Check /api/health</span>
                  </a>
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Passenger Feedback Review Queue</h3>
                <p className="text-xs text-slate-400">
                  Inspect community issue reports submitted via the "Report Incorrect Information" modal.
                </p>
                <a
                  href="http://127.0.0.1:8000/api/feedback/queue"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Feedback Queue (:8000/api/feedback/queue)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
