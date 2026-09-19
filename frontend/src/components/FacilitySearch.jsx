import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  X
} from 'lucide-react';

export default function FacilitySearch({
  facilities = [],
  searchTerm = '',
  onSearchChange,
  activeCategory = 'all',
  onCategorySelect,
  onSelectFacility,
  onSetDestination,
  selectedFacility = null,
  onProvideFeedback
}) {
  const [expandedSourceId, setExpandedSourceId] = useState(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'platform', label: 'Platforms' },
    { id: 'elevator', label: 'Lifts / Elevators' },
    { id: 'washroom', label: 'Washrooms' },
    { id: 'shoepolish', label: 'Shoe Polish' },
    { id: 'ticket_counter', label: 'Ticket Windows' },
    { id: 'food_stall', label: 'Food & Stalls' },
    { id: 'drinking_water', label: 'Drinking Water' },
    { id: 'help_desk', label: 'Help Desk' }
  ];

  const toggleSource = (facId, e) => {
    e.stopPropagation();
    setExpandedSourceId((prev) => (prev === facId ? null : facId));
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Facility Directory</h3>
          <p className="text-xs text-slate-500">Discover platforms, elevators, washrooms, and kiosks</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
          {facilities.length} Listed
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search platforms, washrooms, shoe polish, elevators..."
          className="w-full bg-slate-50 pl-10 pr-8 py-2.5 rounded-full text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white text-slate-900 placeholder:text-slate-400 transition"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Facilities Result List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px]">
        {facilities.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Search className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No facilities matching criteria</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Try searching for a platform number, washroom, or shoe polish kiosk.
            </p>
          </div>
        ) : (
          facilities.map((fac) => {
            const isSelected = selectedFacility && selectedFacility.facility_id === fac.facility_id;
            const isSourceExpanded = expandedSourceId === fac.facility_id;

            return (
              <div
                key={fac.facility_id}
                onClick={() => onSelectFacility(fac)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/70 shadow-xs ring-1 ring-slate-900'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Header: Title, Category & Location */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{fac.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.floor_level}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {fac.category.replace('_', ' ')}
                  </span>
                </div>

                {fac.notes && (
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed">
                    {fac.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Updated {fac.last_updated || 'Sep 2026'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFacility(fac);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-950 rounded-full hover:bg-slate-100 transition"
                    >
                      Show on map
                    </button>
                    {fac.node_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetDestination(fac.node_id);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-950 hover:bg-blue-600 text-white rounded-full text-xs font-semibold shadow-xs transition"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Get directions</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtle Information Source Accordion & Provide Feedback */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <button
                    onClick={(e) => toggleSource(fac.facility_id, e)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium transition"
                  >
                    <span>Information source</span>
                    {isSourceExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {onProvideFeedback && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProvideFeedback(fac);
                      }}
                      className="flex items-center gap-1 text-slate-400 hover:text-blue-600 font-medium transition"
                      title="Provide feedback on this facility"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Provide feedback</span>
                    </button>
                  )}
                </div>

                {/* Collapsible Source Details */}
                {isSourceExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 animate-in fade-in duration-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Source:</span>
                      <span className="font-medium text-slate-800">
                        Station information
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Last updated:</span>
                      <span className="font-medium text-slate-700">
                        {fac.last_updated || 'Sep 2026'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
