import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Send,
  Navigation,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  X,
  Bot
} from 'lucide-react';

export default function AssistantDrawer({
  isOpen,
  onClose,
  stationId = 'dadar',
  currentNodeId = null,
  onApplyAssistantResult,
  onAskQuery,
  isProcessing = false
}) {
  const [queryInput, setQueryInput] = useState('');
  const [currentResponse, setCurrentResponse] = useState(null);

  if (!isOpen) return null;

  const sampleQueries = [
    'Where can I polish my shoes?',
    'Find the nearest washroom',
    'Reach Platform 4 without using stairs',
    'I am at the East Entrance. Where is the nearest food counter?',
    'Show me the nearest elevator',
    'Where is the ticket counter?'
  ];

  const handleSend = async (qText) => {
    const text = qText || queryInput;
    if (!text.trim()) return;

    const res = await onAskQuery(text.trim());
    if (res && res.data) {
      setCurrentResponse(res.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Station Assistant</h3>
              <p className="text-[11px] text-slate-400">Natural-Language Intent & Navigation Parser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Conversation / Analysis Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Assistant Info Banner */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>Grounded Domain Intelligence</span>
            </div>
            <p className="text-[11px] text-blue-800/90">
              The assistant parses commuter requests into structured queries and executes against verified station maps. It will never hallucinate or invent non-existent railway facilities.
            </p>
          </div>

          {/* Sample Prompts */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Suggested Commuter Queries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQueries.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(prompt);
                    handleSend(prompt);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-left transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Current Response / Query Interpretation Breakdown */}
          {currentResponse && (
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Interpretation & Grounded Result
              </span>

              {/* Interpretation Card (Intent, Category, Station, Action) */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                  <span className="text-slate-400 font-medium">Interpreted Intent:</span>
                  <span className="font-bold text-sky-400 uppercase tracking-wider">
                    {currentResponse.interpreted_intent.replace('_', ' ')}
                  </span>
                </div>
                {currentResponse.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {currentResponse.category.replace('_', ' ')}
                    </span>
                  </div>
                )}
                {currentResponse.target_platform && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Platform:</span>
                    <span className="font-semibold text-amber-300">
                      {currentResponse.target_platform}
                    </span>
                  </div>
                )}
                {currentResponse.route_preference && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Constraint:</span>
                    <span className="font-semibold text-purple-300 capitalize">
                      {currentResponse.route_preference.replace('_', ' ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Action:</span>
                  <span className="text-emerald-400 font-semibold capitalize">
                    {currentResponse.suggested_action.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Answer Text Card */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs space-y-2">
                <p className="text-slate-800 font-medium leading-relaxed">
                  {currentResponse.answer_text}
                </p>

                {currentResponse.requires_current_landmark && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                    <strong>Note:</strong> Select your current landmark above to calculate nearest distance and step-by-step directions.
                  </div>
                )}

                {/* Apply Result Action Button */}
                <button
                  onClick={() => {
                    onApplyAssistantResult(currentResponse);
                    onClose();
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Apply to Map & Wayfinding
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ask: 'Where can I polish my shoes?'"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={!queryInput.trim() || isProcessing}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded-xl shadow-sm transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
