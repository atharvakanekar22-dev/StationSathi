// Client-side fallback dataset ensuring 100% resilient demonstration mode
export const FALLBACK_STATIONS = [
  {
    station_id: "dadar",
    name: "Dadar Central",
    code: "DR",
    network: "Central Railway",
    description: "Critical multimodal interchange in central Mumbai bridging Central Railway (Suburban & Outstation) and Western Railway. High footfall station featuring three major Foot Overbridges (North, Central, South), dedicated elevated escalators, accessible elevators, and multiple concourses.",
    coverage: "detailed_prototype",
    coverage_label: "Detailed navigation prototype",
    map_type: "interactive_svg",
    platforms_count: 8,
    entrances: [
      "East Entrance (Swami Gyan Jivandas Marg / Dadar TT)",
      "West Entrance (Senapati Bapat Marg / Flower Market)",
      "North Foot Overbridge Direct Access (Kabutarkhana Side)",
      "Central Foot Overbridge Concourse Gate"
    ],
    facilities_summary: [
      "8 Platforms (Suburban & Express)",
      "Central Accessible Elevators (Concourse to Platforms)",
      "Divyangjan Accessible Washrooms",
      "Shoe-Polishing Kiosks (East Concourse & Platform 2)",
      "Water Vending Units & Potable Taps",
      "IRCTC Ahaar Food Counters",
      "RPF & Station Sahayata Help Desks",
      "ATVMs & Manual Ticket Booking Counters"
    ],
    verification_status: "prototype_data",
    is_official: false,
    source_method: "Prototype mapping based on OpenStreetMap nodes and surveyed concourse layout",
    last_updated: "2025-02-15"
  },
  {
    station_id: "csmt",
    name: "Chhatrapati Shivaji Maharaj Terminus",
    code: "CSMT",
    network: "Central Railway",
    description: "Historic UNESCO World Heritage railway terminus serving Central Railway suburban harbor/main line and long-distance outstation trains. Station features Star concourse, suburban concourses, and extensive heritage corridors.",
    coverage: "basic_station_info",
    coverage_label: "Basic station information",
    map_type: "schematic_overview",
    platforms_count: 18,
    entrances: [
      "Main Heritage Concourse Gate (Dr. D.N. Road)",
      "Suburban Concourse Gate (Walchand Hirachand Marg)",
      "Subway Link to Fort Commercial District",
      "P. D'Mello Road East Gate"
    ],
    facilities_summary: [
      "Suburban Platforms 1-7 (Slow, Fast, Harbour)",
      "Mainline Terminus Platforms 8-18",
      "Tourist & Commuter Help Desk",
      "Executive Waiting Lounges & Cloak Rooms",
      "Suburban Booking Offices & Digital ATVMs"
    ],
    verification_status: "publicly_sourced",
    is_official: false,
    source_method: "Government open-data portal & OpenStreetMap public infrastructure tags",
    last_updated: "2025-01-20"
  },
  {
    station_id: "byculla",
    name: "Byculla",
    code: "BY",
    network: "Central Railway",
    description: "Heritage suburban station on the Central Line serving South-Central Mumbai, the Jijamata Udyan (Byculla Zoo), and textile mill residential redevelopment corridors.",
    coverage: "basic_station_info",
    coverage_label: "Basic station information",
    map_type: "schematic_overview",
    platforms_count: 4,
    entrances: [
      "East Entrance (Dr. Babasaheb Ambedkar Road)",
      "West Entrance (Jijamata Udyan / Khada Parsi Side)"
    ],
    facilities_summary: [
      "Platforms 1-4 (Central Mainline Suburban)",
      "Heritage Concourse Booking Windows",
      "Passenger Foot Overbridges with Stairways",
      "Public Conveniences & Drinking Water Points"
    ],
    verification_status: "publicly_sourced",
    is_official: false,
    source_method: "Public railway timetables & OpenStreetMap station boundaries",
    last_updated: "2025-01-15"
  },
  {
    station_id: "ghatkopar",
    name: "Ghatkopar",
    code: "GC",
    network: "Central Railway",
    description: "Major multimodal transit hub providing direct elevated concourse interchange between Central Railway suburban trains and Mumbai Metro Line 1 (Versova-Andheri-Ghatkopar).",
    coverage: "basic_station_info",
    coverage_label: "Basic station information",
    map_type: "schematic_overview",
    platforms_count: 5,
    entrances: [
      "West Concourse Link (Direct Metro 1 Interchange)",
      "East Entrance (LBS Marg / Station Road)",
      "Skywalk Concourse"
    ],
    facilities_summary: [
      "Platforms 1-5 (Suburban Slow & Fast lines)",
      "Direct Metro Line 1 Turnstiles and Skywalk",
      "UTS Booking Windows & ATVM kiosks",
      "High-capacity Foot Overbridges and Escalators"
    ],
    verification_status: "publicly_sourced",
    is_official: false,
    source_method: "OpenStreetMap public tags & Mumbai Metro transit maps",
    last_updated: "2025-01-10"
  },
  {
    station_id: "thane",
    name: "Thane",
    code: "TNA",
    network: "Central Railway",
    description: "One of Indian Railways' highest-footfall junction stations, serving suburban main line, trans-harbour link to Navi Mumbai, and long-distance trains.",
    coverage: "basic_station_info",
    coverage_label: "Basic station information",
    map_type: "schematic_overview",
    platforms_count: 10,
    entrances: [
      "East Entrance (Kopri / CIDCO Bus Terminal side)",
      "West Entrance (Gokhale Road / Talao Pali side)",
      "Elevated SATIS Deck Entrance"
    ],
    facilities_summary: [
      "Platforms 1-10 (Mainline, Trans-Harbour & Express)",
      "Elevated Bus-Terminal Deck (SATIS system)",
      "Multiple North, Central, South Overbridges",
      "Passenger Refreshment Counters & Waiting Rooms"
    ],
    verification_status: "publicly_sourced",
    is_official: false,
    source_method: "OpenRailwayMap & Central Railway public documents",
    last_updated: "2025-01-05"
  },
  {
    station_id: "kalyan",
    name: "Kalyan Junction",
    code: "KYN",
    network: "Central Railway",
    description: "Crucial junction where Central Railway splits into the northeastern line (to Kasara, Nashik, North/East India) and southeastern line (to Karjat, Pune, South India).",
    coverage: "basic_station_info",
    coverage_label: "Basic station information",
    map_type: "schematic_overview",
    platforms_count: 8,
    entrances: [
      "West Entrance (Kalyan Bus Depot / Market area)",
      "East Entrance (Waldhuni / Kolsewadi side)",
      "South Concourse Foot Overbridge Gate"
    ],
    facilities_summary: [
      "Platforms 1-8 (Suburban Terminal & Express Junction)",
      "Extensive Concourse with IRCTC Food Court",
      "Express Rake Water and Parcel Facilities",
      "Waiting Rooms & Divyangjan Ramps"
    ],
    verification_status: "publicly_sourced",
    is_official: false,
    source_method: "OpenRailwayMap & Central Railway public portal",
    last_updated: "2025-01-05"
  }
];

export const FALLBACK_DADAR_FACILITIES = [
  {
    facility_id: "dadar_washroom_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "East Concourse Washroom Complex",
    category: "washroom",
    floor_level: "Ground Concourse",
    svg_coords: { x: 850, y: 420 },
    node_id: "node_washroom_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Prototype mapping based on OpenStreetMap nodes and surveyed concourse layout",
    notes: "Includes Men's, Women's, and dedicated Divyangjan accessible cubicles."
  },
  {
    facility_id: "dadar_shoepolish_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Shoe-Polishing Kiosk (East Concourse)",
    category: "shoepolish",
    floor_level: "Ground Concourse",
    svg_coords: { x: 820, y: 290 },
    node_id: "node_shoepolish_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Field verified prototype record (Railway licensed vendor kiosk under East FOB stairwell)",
    notes: "Traditional station shoe-shine stand with fixed pricing regulated by Central Railway."
  },
  {
    facility_id: "dadar_shoepolish_02",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Shoe-Polishing Stand (Platform 2 Mid-Section)",
    category: "shoepolish",
    floor_level: "Platform Level",
    svg_coords: { x: 270, y: 380 },
    node_id: "node_shoepolish_pf2",
    availability_status: "operational",
    verification_status: "needs_verification",
    is_official: false,
    last_updated: "2025-01-20",
    source_method: "Prototype commuter observation record",
    notes: "Located on Slow Line Platform 2 near south-bound coach indicators."
  },
  {
    facility_id: "dadar_ticket_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "East Booking Windows & ATVM Zone",
    category: "ticket_counter",
    floor_level: "Ground Concourse",
    svg_coords: { x: 850, y: 250 },
    node_id: "node_ticket_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "OSM Overpass extraction & manual survey",
    notes: "UTS suburban ticket windows, season pass renewal, and 4 Automatic Ticket Vending Machines (ATVM)."
  },
  {
    facility_id: "dadar_ticket_02",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "West Booking Office",
    category: "ticket_counter",
    floor_level: "Ground Concourse",
    svg_coords: { x: 100, y: 270 },
    node_id: "node_ticket_west",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "OSM Overpass extraction",
    notes: "Serving passengers arriving from Senapati Bapat Marg."
  },
  {
    facility_id: "dadar_elevator_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Central FOB Accessible Elevator (East Concourse)",
    category: "elevator",
    floor_level: "Ground / FOB Level 1",
    svg_coords: { x: 780, y: 330 },
    node_id: "node_elevator_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Surveyed accessible infrastructure dataset",
    notes: "Direct elevator connect between East Ground Concourse and Central FOB deck. Braille buttons & audio chime."
  },
  {
    facility_id: "dadar_elevator_02",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 4 Accessible Elevator",
    category: "elevator",
    floor_level: "FOB / Platform Level",
    svg_coords: { x: 440, y: 380 },
    node_id: "node_elevator_pf4",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Surveyed accessible infrastructure dataset",
    notes: "Connects Central FOB directly down to Platform 4 (Fast Southbound to CSMT)."
  },
  {
    facility_id: "dadar_elevator_03",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 5 Accessible Elevator",
    category: "elevator",
    floor_level: "FOB / Platform Level",
    svg_coords: { x: 610, y: 370 },
    node_id: "node_elevator_pf5",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Surveyed accessible infrastructure dataset",
    notes: "Connects Central FOB down to Platform 5."
  },
  {
    facility_id: "dadar_food_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "IRCTC Ahaar Food Stall",
    category: "food_stall",
    floor_level: "Ground Concourse",
    svg_coords: { x: 850, y: 200 },
    node_id: "node_food_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Prototype mapping based on concourse survey",
    notes: "Hot breakfast (Vada Pav, Idli, Tea), packaged snacks, and Rail Neer."
  },
  {
    facility_id: "dadar_water_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Potable Drinking Water Point",
    category: "drinking_water",
    floor_level: "Ground Concourse",
    svg_coords: { x: 850, y: 460 },
    node_id: "node_water_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Prototype mapping based on concourse survey",
    notes: "Free filtered municipal drinking water station with stainless steel taps."
  },
  {
    facility_id: "dadar_helpdesk_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "RPF & Station Sahayata Help Desk",
    category: "help_desk",
    floor_level: "Ground Concourse",
    svg_coords: { x: 850, y: 370 },
    node_id: "node_helpdesk_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Prototype survey",
    notes: "Railway Police assistance, Senior Citizen support, wheelchair requests, and Lost & Found assistance."
  },
  {
    facility_id: "dadar_entrance_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "East Entrance (Dadar TT / Swami Gyan Jivandas Marg)",
    category: "entrance_exit",
    floor_level: "Ground Concourse",
    svg_coords: { x: 890, y: 330 },
    node_id: "node_entrance_east",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "OSM Overpass extraction & ground survey",
    notes: "Major vehicular drop-off, BEST bus connectivity to Dadar TT circle."
  },
  {
    facility_id: "dadar_entrance_02",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "West Entrance (Senapati Bapat Marg / Flower Market)",
    category: "entrance_exit",
    floor_level: "Ground Concourse",
    svg_coords: { x: 60, y: 330 },
    node_id: "node_entrance_west",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "OSM Overpass extraction",
    notes: "Access to Western Dadar, flower market, and Plaza cinema lane."
  },
  {
    facility_id: "dadar_pf_04",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 4 (Central Fast Southbound to CSMT)",
    category: "platform",
    floor_level: "Platform Level",
    svg_coords: { x: 440, y: 330 },
    node_id: "node_pf4",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Official railway track layout & OSM alignment",
    notes: "Fast local trains towards Byculla & CSMT. Equipped with elevator to Central FOB."
  },
  {
    facility_id: "dadar_pf_05",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 5 (Mainline & Express Terminal)",
    category: "platform",
    floor_level: "Platform Level",
    svg_coords: { x: 610, y: 330 },
    node_id: "node_pf5",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Official railway track layout & OSM alignment",
    notes: "Accommodates 24-coach long-distance Express and suburban terminates."
  },
  {
    facility_id: "dadar_pf_02",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 2 (Central Slow Southbound to CSMT)",
    category: "platform",
    floor_level: "Platform Level",
    svg_coords: { x: 270, y: 330 },
    node_id: "node_pf2",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Official railway track layout & OSM alignment",
    notes: "Slow local trains to CSMT stopping at Currey Road, Chinchpokli, Byculla, Sandhurst Road, Masjid."
  },
  {
    facility_id: "dadar_pf_03",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 3 (Central Fast Northbound to Thane / Kalyan)",
    category: "platform",
    floor_level: "Platform Level",
    svg_coords: { x: 410, y: 330 },
    node_id: "node_pf3",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Official railway track layout & OSM alignment",
    notes: "Fast services to Kurla, Ghatkopar, Thane, Dombivli, Kalyan."
  },
  {
    facility_id: "dadar_pf_01",
    station_id: "dadar",
    station_name: "Dadar Central",
    station_code: "DR",
    name: "Platform 1 (Central Slow Northbound)",
    category: "platform",
    floor_level: "Platform Level",
    svg_coords: { x: 240, y: 330 },
    node_id: "node_pf1",
    availability_status: "operational",
    verification_status: "prototype_data",
    is_official: false,
    last_updated: "2025-02-15",
    source_method: "Official railway track layout & OSM alignment",
    notes: "Slow services north towards Matunga and Sion."
  }
];

export const FALLBACK_OTHER_FACILITIES = {
  csmt: [
    {
      facility_id: "csmt_ticket_01",
      station_id: "csmt",
      station_name: "Chhatrapati Shivaji Maharaj Terminus",
      name: "Suburban Star Concourse Booking Windows",
      category: "ticket_counter",
      floor_level: "Ground Concourse",
      verification_status: "publicly_sourced",
      notes: "Main ticket hall facing DN Road."
    },
    {
      facility_id: "csmt_washroom_01",
      station_id: "csmt",
      station_name: "Chhatrapati Shivaji Maharaj Terminus",
      name: "Platform 1 Suburban Concourse Restrooms",
      category: "washroom",
      floor_level: "Ground Concourse",
      verification_status: "publicly_sourced",
      notes: "Restrooms near Harbor Line platform."
    },
    {
      facility_id: "csmt_shoepolish_01",
      station_id: "csmt",
      station_name: "Chhatrapati Shivaji Maharaj Terminus",
      name: "Mainline Concourse Shoe-Polishing Kiosk",
      category: "shoepolish",
      floor_level: "Ground Concourse",
      verification_status: "needs_verification",
      notes: "Near outstation reservation enquiry counter."
    }
  ],
  byculla: [
    {
      facility_id: "byculla_ticket_01",
      station_id: "byculla",
      station_name: "Byculla",
      name: "East Concourse Booking Office (Ambedkar Road)",
      category: "ticket_counter",
      floor_level: "Ground Concourse",
      verification_status: "publicly_sourced",
      notes: "East entrance facing Ambedkar Road."
    },
    {
      facility_id: "byculla_washroom_01",
      station_id: "byculla",
      station_name: "Byculla",
      name: "Platform 1 Public Restrooms",
      category: "washroom",
      floor_level: "Platform Level",
      verification_status: "publicly_sourced",
      notes: "Slow Northbound Platform 1."
    }
  ],
  ghatkopar: [
    {
      facility_id: "ghatkopar_ticket_01",
      station_id: "ghatkopar",
      station_name: "Ghatkopar",
      name: "Metro Interchange Concourse Booking Windows",
      category: "ticket_counter",
      floor_level: "Elevated Concourse",
      verification_status: "publicly_sourced",
      notes: "Ticketing at Metro Line 1 gate."
    }
  ],
  thane: [
    {
      facility_id: "thane_ticket_01",
      station_id: "thane",
      station_name: "Thane",
      name: "East Concourse Booking Office (Kopri Side)",
      category: "ticket_counter",
      floor_level: "Ground Concourse",
      verification_status: "publicly_sourced",
      notes: "Near CIDCO bus stop and auto stand."
    },
    {
      facility_id: "thane_washroom_01",
      station_id: "thane",
      station_name: "Thane",
      name: "Platform 2/3 Island Washroom",
      category: "washroom",
      floor_level: "Platform Level",
      verification_status: "publicly_sourced",
      notes: "Slow local platform."
    },
    {
      facility_id: "thane_helpdesk_01",
      station_id: "thane",
      station_name: "Thane",
      name: "Central Railway Sahayata Help Desk (West Gate)",
      category: "help_desk",
      floor_level: "Ground Concourse",
      verification_status: "publicly_sourced",
      notes: "Assistance near Gokhale Road gate."
    }
  ],
  kalyan: [
    {
      facility_id: "kalyan_ticket_01",
      station_id: "kalyan",
      station_name: "Kalyan Junction",
      name: "West Concourse Main Booking Windows",
      category: "ticket_counter",
      floor_level: "Ground Concourse",
      verification_status: "publicly_sourced",
      notes: "Main ticket counter near Kalyan bus depot."
    }
  ]
};

export const FALLBACK_DADAR_GRAPH = {
  station_id: "dadar",
  nodes: {
    node_entrance_east: { id: "node_entrance_east", name: "East Entrance (Dadar TT / Swami Gyan Jivandas Marg)", type: "entrance", x: 890, y: 330, level: "Ground Concourse" },
    node_concourse_east: { id: "node_concourse_east", name: "East Main Concourse", type: "concourse", x: 850, y: 330, level: "Ground Concourse" },
    node_ticket_east: { id: "node_ticket_east", name: "East Booking Windows & ATVM Zone", type: "facility", x: 850, y: 250, level: "Ground Concourse" },
    node_washroom_east: { id: "node_washroom_east", name: "East Concourse Washroom Complex (Divyangjan Accessible)", type: "facility", x: 850, y: 420, level: "Ground Concourse" },
    node_shoepolish_east: { id: "node_shoepolish_east", name: "Shoe-Polishing Kiosk (East Concourse)", type: "facility", x: 820, y: 290, level: "Ground Concourse" },
    node_food_east: { id: "node_food_east", name: "IRCTC Ahaar Food Stall (East Concourse)", type: "facility", x: 850, y: 200, level: "Ground Concourse" },
    node_water_east: { id: "node_water_east", name: "Potable Drinking Water Point (East Concourse)", type: "facility", x: 850, y: 460, level: "Ground Concourse" },
    node_helpdesk_east: { id: "node_helpdesk_east", name: "RPF & Station Sahayata Help Desk", type: "facility", x: 850, y: 370, level: "Ground Concourse" },
    node_elevator_east: { id: "node_elevator_east", name: "Central FOB Accessible Elevator (East Concourse)", type: "elevator", x: 780, y: 330, level: "Ground / FOB Level 1" },
    node_stairs_fob_east: { id: "node_stairs_fob_east", name: "Central FOB East Staircase", type: "stairs", x: 780, y: 290, level: "Stair Landing" },
    node_fob_central_span_east: { id: "node_fob_central_span_east", name: "Central FOB East Junction", type: "fob", x: 740, y: 330, level: "FOB Level 1" },
    node_fob_central_span_pf5: { id: "node_fob_central_span_pf5", name: "Central FOB Junction (above Platform 5/6)", type: "fob", x: 610, y: 330, level: "FOB Level 1" },
    node_stairs_pf5: { id: "node_stairs_pf5", name: "Platform 5 Stairway from Central FOB", type: "stairs", x: 610, y: 290, level: "Stairs" },
    node_elevator_pf5: { id: "node_elevator_pf5", name: "Platform 5 Accessible Elevator", type: "elevator", x: 610, y: 370, level: "FOB / Platform Level" },
    node_pf5: { id: "node_pf5", name: "Platform 5 (Mainline & Express)", type: "platform", x: 610, y: 330, level: "Platform Level" },
    node_fob_central_span_pf4: { id: "node_fob_central_span_pf4", name: "Central FOB Junction (above Platform 3/4)", type: "fob", x: 440, y: 330, level: "FOB Level 1" },
    node_stairs_pf4: { id: "node_stairs_pf4", name: "Platform 4 Stairway from Central FOB", type: "stairs", x: 440, y: 280, level: "Stairs" },
    node_elevator_pf4: { id: "node_elevator_pf4", name: "Platform 4 Accessible Elevator", type: "elevator", x: 440, y: 380, level: "FOB / Platform Level" },
    node_pf4: { id: "node_pf4", name: "Platform 4 (Central Fast Southbound to CSMT)", type: "platform", x: 440, y: 330, level: "Platform Level" },
    node_pf3: { id: "node_pf3", name: "Platform 3 (Central Fast Northbound to Thane/Kalyan)", type: "platform", x: 410, y: 330, level: "Platform Level" },
    node_fob_central_span_pf2: { id: "node_fob_central_span_pf2", name: "Central FOB Junction (above Platform 1/2)", type: "fob", x: 270, y: 330, level: "FOB Level 1" },
    node_stairs_pf2: { id: "node_stairs_pf2", name: "Platform 2 Stairway from Central FOB", type: "stairs", x: 270, y: 290, level: "Stairs" },
    node_pf2: { id: "node_pf2", name: "Platform 2 (Central Slow Southbound to CSMT)", type: "platform", x: 270, y: 330, level: "Platform Level" },
    node_shoepolish_pf2: { id: "node_shoepolish_pf2", name: "Shoe-Polishing Service (Platform 2 Mid-Section)", type: "facility", x: 270, y: 380, level: "Platform Level" },
    node_pf1: { id: "node_pf1", name: "Platform 1 (Central Slow Northbound)", type: "platform", x: 240, y: 330, level: "Platform Level" },
    node_fob_central_west: { id: "node_fob_central_west", name: "Central FOB West Junction", type: "fob", x: 170, y: 330, level: "FOB Level 1" },
    node_stairs_fob_west: { id: "node_stairs_fob_west", name: "West Concourse Staircase", type: "stairs", x: 140, y: 330, level: "Stairs" },
    node_concourse_west: { id: "node_concourse_west", name: "West Concourse (Ground)", type: "concourse", x: 100, y: 330, level: "Ground Concourse" },
    node_entrance_west: { id: "node_entrance_west", name: "West Entrance (Senapati Bapat Marg / Flower Market)", type: "entrance", x: 60, y: 330, level: "Ground Concourse" },
    node_ticket_west: { id: "node_ticket_west", name: "West Booking Windows", type: "facility", x: 100, y: 270, level: "Ground Concourse" }
  },
  edges: []
};

// Precomputed demo scenario answers for client fallback
export const DEMO_FALLBACK_ROUTES = {
  // Scenario 3: East Entrance -> Platform 5
  "node_entrance_east-node_pf5-shortest": {
    success: true,
    station_id: "dadar",
    preference_applied: "shortest",
    explanation: "Shortest direct indoor route calculated via Dijkstra's algorithm (127m).",
    total_distance_m: 127.0,
    estimated_steps: 169,
    estimated_time_seconds: 115,
    is_step_free: false,
    path_node_ids: [
      "node_entrance_east",
      "node_concourse_east",
      "node_stairs_fob_east",
      "node_fob_central_span_east",
      "node_fob_central_span_pf5",
      "node_stairs_pf5",
      "node_pf5"
    ],
    steps: [
      { step_number: 1, instruction: "Start at East Entrance (Ground Concourse).", edge_type: "walkway", distance_m: 0, is_accessible: true },
      { step_number: 2, instruction: "Walk straight into East Main Concourse (approx. 25m)", edge_type: "walkway", distance_m: 25, is_accessible: true },
      { step_number: 3, instruction: "Approach the East staircase ascending to Central FOB (approx. 20m)", edge_type: "walkway", distance_m: 20, is_accessible: true },
      { step_number: 4, instruction: "Climb Central FOB East Staircase to the bridge level (approx. 15m)", edge_type: "stairs", distance_m: 15, is_accessible: false },
      { step_number: 5, instruction: "Walk west along Central FOB deck over tracks towards Platform 5 (approx. 45m)", edge_type: "fob", distance_m: 45, is_accessible: true },
      { step_number: 6, instruction: "Approach Platform 5 stairway landing on the bridge (approx. 10m)", edge_type: "walkway", distance_m: 10, is_accessible: true },
      { step_number: 7, instruction: "Descend stairs from Central FOB down onto Platform 5 (approx. 18m)", edge_type: "stairs", distance_m: 18, is_accessible: false },
      { step_number: 8, instruction: "Arrive at destination: Platform 5 (Mainline & Express).", edge_type: "walkway", distance_m: 0, is_accessible: true }
    ],
    verification_status: "prototype_data"
  },
  // Scenario 4: East Entrance -> Platform 4 (Avoid stairs)
  "node_entrance_east-node_pf4-avoid_stairs": {
    success: true,
    station_id: "dadar",
    preference_applied: "avoid_stairs",
    explanation: "Route calculated avoiding all staircases using accessible elevators and level concourses.",
    total_distance_m: 188.0,
    estimated_steps: 251,
    estimated_time_seconds: 221,
    is_step_free: true,
    path_node_ids: [
      "node_entrance_east",
      "node_concourse_east",
      "node_elevator_east",
      "node_fob_central_span_east",
      "node_fob_central_span_pf5",
      "node_fob_central_span_pf4",
      "node_elevator_pf4",
      "node_pf4"
    ],
    steps: [
      { step_number: 1, instruction: "Start at East Entrance (Ground Concourse).", edge_type: "walkway", distance_m: 0, is_accessible: true },
      { step_number: 2, instruction: "Walk straight into East Main Concourse (approx. 25m)", edge_type: "walkway", distance_m: 25, is_accessible: true },
      { step_number: 3, instruction: "Proceed directly to Central FOB Accessible Elevator (East side) (approx. 22m)", edge_type: "walkway", distance_m: 22, is_accessible: true },
      { step_number: 4, instruction: "Take the Accessible Elevator up to Central FOB Bridge Level (approx. 12m)", edge_type: "elevator", distance_m: 12, is_accessible: true },
      { step_number: 5, instruction: "Walk west along Central FOB deck over tracks towards Platform 5 (approx. 45m)", edge_type: "fob", distance_m: 45, is_accessible: true },
      { step_number: 6, instruction: "Continue walking west along Central FOB crossway above tracks towards Platform 3/4 (approx. 50m)", edge_type: "fob", distance_m: 50, is_accessible: true },
      { step_number: 7, instruction: "Proceed to the Platform 4 Accessible Elevator shaft on the bridge (approx. 12m)", edge_type: "walkway", distance_m: 12, is_accessible: true },
      { step_number: 8, instruction: "Take Accessible Elevator down directly onto Platform 4 (approx. 12m)", edge_type: "elevator", distance_m: 12, is_accessible: true },
      { step_number: 9, instruction: "Arrive at destination: Platform 4 (Central Fast Southbound to CSMT).", edge_type: "walkway", distance_m: 0, is_accessible: true }
    ],
    verification_status: "prototype_data"
  }
};
