import React from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Sparkles,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function FacilitySearch({
  facilities = [],
  searchTerm = '',
  onSearchChange,
  activeCategory = 'all',
  onCategorySelect,
  onSelectFacility,
  onSetDestination,
  selectedFacility = null
}) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'washroom', label: 'Washrooms' },
    { id: 'shoepolish', label: 'Shoe Polish' },
    { id: 'elevator', label: 'Elevators' },
    { id: 'ticket_counter', label: 'Tickets' },
    { id: 'food_stall', label: 'Food' },
    { id: 'drinking_water', label: 'Water' },
    { id: 'help_desk', label: 'Help Desk' },
    { id: 'platform', label: 'Platforms' }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Facility & Service Search</h3>
          <p className="text-xs text-slate-500">Discover platforms, amenities, and commuter services</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
          {facilities.length} Mapped
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search washrooms, shoe polish, elevators, platforms..."
          className="w-full bg-slate-50 pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Facilities Result List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px]">
        {facilities.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No facilities found matching criteria</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Try searching for "washroom", "shoe polish", "elevator", or select a category pill above.
            </p>
          </div>
        ) : (
          facilities.map((fac) => {
            const isSelected = selectedFacility && selectedFacility.facility_id === fac.facility_id;
            return (
              <div
                key={fac.facility_id}
                onClick={() => onSelectFacility(fac)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                      {fac.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{fac.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {fac.floor_level}
                    </p>
                  </div>
                  <VerificationBadge status={fac.verification_status} />
                </div>

                {fac.notes && (
                  <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    {fac.notes}
                  </p>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Updated {fac.last_updated}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFacility(fac);
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
                    >
                      Show on Map
                    </button>
                    {fac.node_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetDestination(fac.node_id);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition"
                      >
                        <Navigation className="w-3 h-3" />
                        Navigate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
