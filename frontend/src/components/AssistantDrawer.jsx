import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Navigation,
  X,
} from 'lucide-react';

export default function AssistantDrawer({
  isOpen,
  onClose,
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
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Station Assistant</h3>
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
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Try a search
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

          {currentResponse && (
            <div className="space-y-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs space-y-2">
                <p className="text-slate-800 font-medium leading-relaxed">
                  {currentResponse.answer_text}
                </p>

                {currentResponse.requires_current_landmark && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                    Select a starting point on the map for step-by-step directions.
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
                  Show on map
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
