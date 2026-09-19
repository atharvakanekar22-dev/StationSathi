import {
  FALLBACK_STATIONS,
  FALLBACK_FACILITIES,
  FALLBACK_DADAR_FACILITIES,
  FALLBACK_GRAPHS,
  FALLBACK_DADAR_GRAPH,
  DEMO_FALLBACK_ROUTES
} from '../data/fallbackData';

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, authoritative: data.authoritative ?? true };
    }
    return { online: false, authoritative: false };
  } catch (err) {
    return { online: false, authoritative: false };
  }
}

export async function fetchStations() {
  try {
    const res = await fetch(`${API_BASE}/stations`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return { data: await res.json(), fallback: false };
    }
    throw new Error('API request failed');
  } catch (err) {
    return { data: FALLBACK_STATIONS, fallback: true };
  }
}

export async function fetchStation(stationId) {
  try {
    const res = await fetch(`${API_BASE}/stations/${stationId}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return { data: await res.json(), fallback: false };
    }
    throw new Error('API request failed');
  } catch (err) {
    const station = FALLBACK_STATIONS.find((s) => s.station_id === stationId.toLowerCase()) || FALLBACK_STATIONS[0];
    return { data: station, fallback: true };
  }
}

export async function fetchStationGraph(stationId) {
  try {
    const res = await fetch(`${API_BASE}/stations/${stationId}/graph`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return { data: await res.json(), fallback: false };
    }
    throw new Error('API request failed');
  } catch (err) {
    const graph = FALLBACK_GRAPHS[stationId.toLowerCase()] || FALLBACK_DADAR_GRAPH;
    return { data: graph, fallback: true };
  }
}

export async function fetchFacilities(stationId, category = null, search = null) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/stations/${stationId}/facilities?${params.toString()}`, {
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      return { data: await res.json(), fallback: false };
    }
    throw new Error('API request failed');
  } catch (err) {
    let list = FALLBACK_FACILITIES[stationId.toLowerCase()] || [];

    if (category && category !== 'all') {
      list = list.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (f) => f.name.toLowerCase().includes(q) || (f.notes && f.notes.toLowerCase().includes(q))
      );
    }
    return { data: list, fallback: true };
  }
}

export async function fetchRoute(stationId, originId, destinationId, preference = 'shortest') {
  try {
    const res = await fetch(`${API_BASE}/navigation/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        station_id: stationId,
        origin_node_id: originId,
        destination_node_id: destinationId,
        preference: preference
      }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return { data: await res.json(), fallback: false };
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Navigation route failed');
  } catch (err) {
    // Check if matching predefined scenario exists
    const key = `${originId}-${destinationId}-${preference}`;
    if (DEMO_FALLBACK_ROUTES[key]) {
      return { data: DEMO_FALLBACK_ROUTES[key], fallback: true };
    }

    // Generic fallback route
    return {
      data: {
        success: true,
        station_id: stationId,
        preference_applied: preference,
        explanation: `Calculated standard path from ${originId} to ${destinationId}.`,
        total_distance_m: 85.0,
        estimated_steps: 113,
        estimated_time_seconds: 77,
        is_step_free: preference === 'avoid_stairs',
        path_node_ids: [originId, destinationId],
        steps: [
          { step_number: 1, instruction: `Start at ${originId}`, edge_type: 'walkway', distance_m: 0, is_accessible: true },
          { step_number: 2, instruction: `Walk across concourse towards destination (approx. 85m)`, edge_type: 'walkway', distance_m: 85, is_accessible: true },
          { step_number: 3, instruction: `Arrive at destination: ${destinationId}`, edge_type: 'walkway', distance_m: 0, is_accessible: true }
        ],
        verification_status: 'prototype_data'
      },
      fallback: true
    };
  }
}

export async function queryAssistant(query, stationId = 'dadar', currentNodeId = null) {
  try {
    const res = await fetch(`${API_BASE}/assistant/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query,
        station_id: stationId,
        current_node_id: currentNodeId
      }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return { data: await res.json(), fallback: false };
    }
    throw new Error('Assistant API failed');
  } catch (err) {
    const q = query.toLowerCase();
    const stationFacs = FALLBACK_FACILITIES[stationId.toLowerCase()] || FALLBACK_DADAR_FACILITIES;

    if (q.includes('shoe') || q.includes('polish')) {
      const shoes = stationFacs.filter((f) => f.category === 'shoepolish');
      return {
        data: {
          interpreted_intent: 'facility_search',
          category: 'shoepolish',
          explanation: 'Identified commuter request for shoe-polishing kiosk.',
          answer_text: shoes.length > 0
            ? `Found ${shoes.length} shoe-polishing stand(s) at ${stationId.toUpperCase()}.`
            : `The requested facility is not currently mapped in StationSathi for ${stationId.toUpperCase()}.`,
          suggested_action: 'show_facilities',
          matched_facilities: shoes,
          recommended_destination_node_id: shoes[0]?.node_id || null,
          requires_current_landmark: false,
          verification_status: 'prototype_data'
        },
        fallback: true
      };
    }

    if (q.includes('washroom') || q.includes('toilet')) {
      const washrooms = stationFacs.filter((f) => f.category === 'washroom');
      return {
        data: {
          interpreted_intent: 'facility_search',
          category: 'washroom',
          explanation: `Found ${washrooms.length} washroom complex(es). Distance ranking requires your current landmark.`,
          answer_text: `Mapped ${washrooms.length} washroom location(s) at ${stationId.toUpperCase()}. Please select your current landmark for exact walking distance.`,
          suggested_action: 'select_landmark',
          matched_facilities: washrooms,
          recommended_destination_node_id: washrooms[0]?.node_id || null,
          requires_current_landmark: !currentNodeId,
          verification_status: 'prototype_data'
        },
        fallback: true
      };
    }

    if (q.includes('platform 10') || (q.includes('without') && (q.includes('stair') || q.includes('stairs')))) {
      const pf10 = stationFacs.find((f) => f.node_id === 'node_pf10');
      return {
        data: {
          interpreted_intent: 'accessibility_route',
          category: 'platform',
          target_platform: 'Platform 10',
          route_preference: 'avoid_stairs',
          explanation: 'Detected route to Platform 10 with strict stair avoidance constraint.',
          answer_text: 'Calculated accessible route to Platform 10 avoiding all stairs via Central FOB elevator.',
          suggested_action: 'calculate_route',
          matched_facilities: pf10 ? [pf10] : [],
          recommended_destination_node_id: 'node_pf10',
          recommended_origin_node_id: currentNodeId || 'node_entrance_east',
          requires_current_landmark: false,
          verification_status: 'prototype_data'
        },
        fallback: true
      };
    }

    if (q.includes('platform 11')) {
      const pf11 = stationFacs.find((f) => f.node_id === 'node_pf11');
      return {
        data: {
          interpreted_intent: 'route_planning',
          category: 'platform',
          target_platform: 'Platform 11',
          route_preference: 'shortest',
          explanation: 'Detected route to Platform 11.',
          answer_text: 'Calculated navigation route to Platform 11 via Central FOB.',
          suggested_action: 'calculate_route',
          matched_facilities: pf11 ? [pf11] : [],
          recommended_destination_node_id: 'node_pf11',
          recommended_origin_node_id: currentNodeId || 'node_entrance_east',
          requires_current_landmark: false,
          verification_status: 'prototype_data'
        },
        fallback: true
      };
    }

    // Default fallback
    return {
      data: {
        interpreted_intent: 'station_information',
        category: null,
        explanation: `Local query processor matching ${stationId.toUpperCase()} facilities.`,
        answer_text: `StationSathi provides indoor facility navigation for ${stationId.toUpperCase()}.`,
        suggested_action: 'show_facilities',
        matched_facilities: stationFacs.slice(0, 3),
        recommended_destination_node_id: null,
        requires_current_landmark: false,
        verification_status: 'prototype_data'
      },
      fallback: true
    };
  }
}

export async function submitFeedback(reportData) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Feedback API failed');
  } catch (err) {
    // Save to localStorage review queue if offline
    try {
      const existing = JSON.parse(localStorage.getItem('stationsathi_feedback_queue') || '[]');
      existing.push({
        ...reportData,
        report_id: `local_${Date.now()}`,
        status: 'saved_locally'
      });
      localStorage.setItem('stationsathi_feedback_queue', JSON.stringify(existing));
      return {
        success: true,
        message: 'Feedback saved locally and will sync when backend is available.',
        report_id: `local_${Date.now()}`
      };
    } catch (e) {
      return { success: false, message: 'Could not store feedback' };
    }
  }
}
