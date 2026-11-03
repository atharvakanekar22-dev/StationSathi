import React, { useState } from 'react';
import {
  Train,
  ChevronDown,
  Search,
  Menu,
  X
} from 'lucide-react';

export default function Header({
  stations = [],
  currentStationId = 'dadar',
  onSelectStation,
  onOpenAssistant,
  onOpenInfoModal,
  onGoHome,
  onNavigateToSection
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner page-shell">
          {/* Logo & Railway Network */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group py-2"
            onClick={onGoHome}
          >
            <div className="brand-mark">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="brand-name">
                StationSathi
              </span>
              <span className="brand-subtitle">Mumbai station guide</span>
            </div>
          </div>

          <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            <button type="button" onClick={onGoHome} className="nav-link active">Home</button>
            <button type="button" onClick={onGoHome} className="nav-link">Stations</button>
            <button type="button" onClick={() => onNavigateToSection?.('facilities')} className="nav-link">Facilities</button>
            <button type="button" onClick={() => onNavigateToSection?.('route')} className="nav-link">Plan a route</button>
            <button type="button" onClick={onOpenAssistant} className="nav-link">Assistant</button>
            <button type="button" onClick={onOpenInfoModal} className="nav-link">About</button>
          </nav>
          <div className="header-actions">
            <div className="relative">
              <select
                value={currentStationId}
                onChange={(e) => onSelectStation(e.target.value)}
                className="station-select"
                aria-label="Select railway station"
              >
                {stations.map((st) => (
                  <option key={st.station_id} value={st.station_id}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="select-chevron" />
            </div>
          <div className="header-tools">
            <button
              onClick={onOpenAssistant}
              className="header-assistant"
              title="Search & Station Assistant"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ask Sathi</span>
            </button>

            <button
              onClick={onOpenInfoModal}
              className="header-info"
              title="Station Information & Help"
            >
              Info
            </button>
          </div>
          </div>
          <button type="button" className="menu-toggle" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
    </header>
  );
}
