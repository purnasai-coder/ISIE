/**
 * ISIE Geographic & Tactical Intelligence Registry for India
 * Multiscale geographic and administrative dataset for zoom-dependent progressive disclosure
 */

export interface StateCentroid {
  name: string;
  code: string;
  coords: [number, number];
  capital: string;
  capitalCoords: [number, number];
  region: "Northern" | "Southern" | "Eastern" | "Western" | "Central" | "North-Eastern";
}

export interface RiverSystem {
  name: string;
  basin: string;
  labelCoord: [number, number];
  flowDirection: string;
  points: [number, number][];
}

export interface GeographicFeature {
  id: string;
  name: string;
  category: "MOUNTAIN_SYSTEM" | "PLAIN" | "PLATEAU" | "COASTAL" | "DELTA" | "DESERT";
  coords: [number, number];
  description: string;
  elevationBadge?: string;
}

export interface MountainPeakOrPass {
  id: string;
  name: string;
  type: "PEAK" | "PASS";
  coords: [number, number];
  elevation: string;
  state: string;
  strategicNote: string;
}

export interface WaterBodyOrDam {
  id: string;
  name: string;
  type: "DAM" | "LAGOON" | "GULF" | "LAKE";
  coords: [number, number];
  spec: string;
  riverOrCoast: string;
}

export interface DistrictCenter {
  id: string;
  name: string;
  district: string;
  state: string;
  coords: [number, number];
  role: string;
}

// 1. Comprehensive Indian States & Union Territories Centroids and Capitals
export const INDIAN_STATES: StateCentroid[] = [
  { name: "Ladakh", code: "LA", coords: [34.15, 77.58], capital: "Leh", capitalCoords: [34.152, 77.577], region: "Northern" },
  { name: "Jammu & Kashmir", code: "JK", coords: [33.77, 74.80], capital: "Srinagar", capitalCoords: [34.083, 74.797], region: "Northern" },
  { name: "Himachal Pradesh", code: "HP", coords: [31.90, 77.17], capital: "Shimla", capitalCoords: [31.104, 77.173], region: "Northern" },
  { name: "Punjab", code: "PB", coords: [31.14, 75.34], capital: "Chandigarh", capitalCoords: [30.733, 76.779], region: "Northern" },
  { name: "Haryana", code: "HR", coords: [29.05, 76.08], capital: "Chandigarh", capitalCoords: [30.733, 76.779], region: "Northern" },
  { name: "Uttarakhand", code: "UK", coords: [30.06, 79.06], capital: "Dehradun", capitalCoords: [30.316, 78.032], region: "Northern" },
  { name: "Delhi", code: "DL", coords: [28.61, 77.21], capital: "New Delhi", capitalCoords: [28.613, 77.209], region: "Northern" },
  { name: "Rajasthan", code: "RJ", coords: [26.58, 73.84], capital: "Jaipur", capitalCoords: [26.912, 75.787], region: "Western" },
  { name: "Uttar Pradesh", code: "UP", coords: [26.84, 80.94], capital: "Lucknow", capitalCoords: [26.846, 80.946], region: "Northern" },
  { name: "Bihar", code: "BR", coords: [25.60, 85.31], capital: "Patna", capitalCoords: [25.594, 85.137], region: "Eastern" },
  { name: "Sikkim", code: "SK", coords: [27.53, 88.51], capital: "Gangtok", capitalCoords: [27.338, 88.606], region: "North-Eastern" },
  { name: "Arunachal Pradesh", code: "AR", coords: [28.21, 94.72], capital: "Itanagar", capitalCoords: [27.084, 93.605], region: "North-Eastern" },
  { name: "Assam", code: "AS", coords: [26.20, 92.93], capital: "Dispur / Guwahati", capitalCoords: [26.144, 91.736], region: "North-Eastern" },
  { name: "Nagaland", code: "NL", coords: [26.15, 94.56], capital: "Kohima", capitalCoords: [25.675, 94.108], region: "North-Eastern" },
  { name: "Manipur", code: "MN", coords: [24.66, 93.90], capital: "Imphal", capitalCoords: [24.817, 93.936], region: "North-Eastern" },
  { name: "Mizoram", code: "MZ", coords: [23.16, 92.93], capital: "Aizawl", capitalCoords: [23.727, 92.717], region: "North-Eastern" },
  { name: "Tripura", code: "TR", coords: [23.94, 91.98], capital: "Agartala", capitalCoords: [23.831, 91.286], region: "North-Eastern" },
  { name: "Meghalaya", code: "ML", coords: [25.46, 91.36], capital: "Shillong", capitalCoords: [25.578, 91.893], region: "North-Eastern" },
  { name: "West Bengal", code: "WB", coords: [23.16, 87.85], capital: "Kolkata", capitalCoords: [22.572, 88.363], region: "Eastern" },
  { name: "Jharkhand", code: "JH", coords: [23.61, 85.33], capital: "Ranchi", capitalCoords: [23.344, 85.309], region: "Eastern" },
  { name: "Odisha", code: "OD", coords: [20.95, 85.09], capital: "Bhubaneswar", capitalCoords: [20.296, 85.824], region: "Eastern" },
  { name: "Chhattisgarh", code: "CG", coords: [21.27, 81.86], capital: "Raipur", capitalCoords: [21.251, 81.629], region: "Central" },
  { name: "Madhya Pradesh", code: "MP", coords: [23.25, 77.41], capital: "Bhopal", capitalCoords: [23.259, 77.412], region: "Central" },
  { name: "Gujarat", code: "GJ", coords: [22.25, 71.19], capital: "Gandhinagar", capitalCoords: [23.215, 72.636], region: "Western" },
  { name: "Maharashtra", code: "MH", coords: [19.75, 75.71], capital: "Mumbai", capitalCoords: [18.922, 72.834], region: "Western" },
  { name: "Goa", code: "GA", coords: [15.29, 74.12], capital: "Panaji", capitalCoords: [15.490, 73.827], region: "Western" },
  { name: "Karnataka", code: "KA", coords: [15.31, 75.71], capital: "Bengaluru", capitalCoords: [12.971, 77.594], region: "Southern" },
  { name: "Telangana", code: "TG", coords: [18.11, 79.01], capital: "Hyderabad", capitalCoords: [17.385, 78.486], region: "Southern" },
  { name: "Andhra Pradesh", code: "AP", coords: [15.91, 80.64], capital: "Amaravati", capitalCoords: [16.513, 80.515], region: "Southern" },
  { name: "Tamil Nadu", code: "TN", coords: [11.12, 78.65], capital: "Chennai", capitalCoords: [13.082, 80.270], region: "Southern" },
  { name: "Kerala", code: "KL", coords: [10.85, 76.27], capital: "Thiruvananthapuram", capitalCoords: [8.524, 76.936], region: "Southern" },
];

// 2. Major Indian River Paths & Hydrological Center Labels
export const RIVER_PATHS: RiverSystem[] = [
  {
    name: "Ganga River",
    basin: "Gangetic Plain Basin",
    labelCoord: [25.61, 83.50],
    flowDirection: "SE -> Bay of Bengal",
    points: [
      [30.98, 78.93], [30.15, 78.30], [29.95, 78.16], [28.40, 79.90],
      [27.15, 80.00], [26.46, 80.35], [25.43, 81.85], [25.32, 83.00],
      [25.61, 85.14], [25.25, 87.00], [24.80, 87.93], [23.20, 88.40],
      [22.20, 88.60],
    ],
  },
  {
    name: "Yamuna River",
    basin: "Northern Gangetic Tributary",
    labelCoord: [27.18, 77.80],
    flowDirection: "SE -> Prayagraj Confluence",
    points: [
      [31.01, 78.45], [30.30, 77.60], [28.65, 77.23], [27.50, 77.68],
      [27.18, 78.02], [26.47, 79.03], [25.43, 81.85],
    ],
  },
  {
    name: "Brahmaputra River",
    basin: "Assam Valley Watershed",
    labelCoord: [26.35, 92.50],
    flowDirection: "SW -> Bay of Bengal",
    points: [
      [28.25, 95.35], [27.48, 94.90], [26.90, 93.80], [26.65, 93.35],
      [26.18, 91.75], [26.05, 90.50], [25.80, 89.90], [25.20, 89.65],
    ],
  },
  {
    name: "Godavari River",
    basin: "Deccan Plateau Drainage",
    labelCoord: [18.80, 79.10],
    flowDirection: "SE -> Andhra Coast",
    points: [
      [19.93, 73.53], [19.88, 75.34], [19.15, 77.31], [18.80, 79.10],
      [17.75, 80.60], [17.00, 81.78], [16.70, 82.20],
    ],
  },
  {
    name: "Krishna River",
    basin: "Peninsular Basin",
    labelCoord: [16.50, 77.30],
    flowDirection: "E -> Hamsaladeevi",
    points: [
      [17.92, 73.65], [17.30, 74.18], [16.20, 75.80], [16.50, 77.30],
      [16.25, 79.50], [16.51, 80.63], [15.80, 80.90],
    ],
  },
  {
    name: "Narmada River",
    basin: "Central Rift Valley",
    labelCoord: [22.20, 76.00],
    flowDirection: "W -> Arabian Sea",
    points: [
      [22.67, 81.75], [23.18, 79.95], [22.80, 78.00], [22.20, 76.00],
      [21.80, 74.00], [21.65, 72.95],
    ],
  },
  {
    name: "Tapi River",
    basin: "Satpura Drainage",
    labelCoord: [21.40, 76.50],
    flowDirection: "W -> Gulf of Khambhat",
    points: [
      [21.80, 78.20], [21.40, 76.50], [21.10, 74.80], [21.17, 72.83],
    ],
  },
  {
    name: "Mahanadi River",
    basin: "Odisha Coastal Delta",
    labelCoord: [20.85, 85.10],
    flowDirection: "E -> False Point",
    points: [
      [20.55, 81.85], [21.45, 83.95], [20.85, 85.10], [20.46, 85.88],
      [20.31, 86.61],
    ],
  },
  {
    name: "Cauvery River",
    basin: "Southern Delta Basin",
    labelCoord: [11.35, 78.00],
    flowDirection: "SE -> Poompuhar",
    points: [
      [12.38, 75.50], [12.42, 75.73], [12.30, 76.60], [11.79, 77.80],
      [11.35, 78.00], [10.80, 78.70], [11.14, 79.85],
    ],
  },
];

// 3. Strategic Neighbouring Countries
export const NEIGHBOURING_COUNTRIES = [
  { name: "PAKISTAN", code: "PAK", coords: [30.375, 69.345] as [number, number] },
  { name: "CHINA", code: "CHN", coords: [33.8, 86.5] as [number, number] },
  { name: "NEPAL", code: "NPL", coords: [28.395, 84.124] as [number, number] },
  { name: "BHUTAN", code: "BTN", coords: [27.514, 90.434] as [number, number] },
  { name: "BANGLADESH", code: "BGD", coords: [23.685, 90.356] as [number, number] },
  { name: "MYANMAR", code: "MMR", coords: [21.916, 95.956] as [number, number] },
  { name: "SRI LANKA", code: "LKA", coords: [7.873, 80.772] as [number, number] },
];

// 4. Major Maritime & Oceanic Water Bodies
export const MAJOR_WATER_BODIES = [
  { name: "ARABIAN SEA", coords: [17.5, 66.5] as [number, number] },
  { name: "BAY OF BENGAL", coords: [15.5, 88.5] as [number, number] },
  { name: "INDIAN OCEAN", coords: [4.5, 78.5] as [number, number] },
];

// 5. Macro Physiographic Features & Landforms (Revealed at Zoom >= 5.8)
export const PHYSIOGRAPHIC_FEATURES: GeographicFeature[] = [
  {
    id: "GEO-HIMALAYA",
    name: "Himalayan High Arc",
    category: "MOUNTAIN_SYSTEM",
    coords: [31.5, 79.2],
    description: "Alpine glacial watershed & tectonically active collision ridge",
    elevationBadge: "6,000m - 8,848m",
  },
  {
    id: "GEO-GANGA-PLAIN",
    name: "Indo-Gangetic Alluvial Basin",
    category: "PLAIN",
    coords: [26.6, 81.5],
    description: "High-density fertile river plain fed by perennial glacial streams",
    elevationBadge: "100m - 300m",
  },
  {
    id: "GEO-DECCAN",
    name: "Deccan Basalt Plateau",
    category: "PLATEAU",
    coords: [17.5, 76.2],
    description: "Ancient volcanic trap formation bounded by Western & Eastern Ghats",
    elevationBadge: "500m - 900m",
  },
  {
    id: "GEO-WEST-GHATS",
    name: "Western Ghats (Sahyadri Ridge)",
    category: "MOUNTAIN_SYSTEM",
    coords: [14.2, 74.8],
    description: "Continuous escarpment trapping heavy Arabian Sea monsoonal rainfall",
    elevationBadge: "1,200m - 2,695m",
  },
  {
    id: "GEO-EAST-GHATS",
    name: "Eastern Ghats Uplands",
    category: "MOUNTAIN_SYSTEM",
    coords: [17.8, 82.8],
    description: "Discontinuous dissected highlands breached by major peninsular rivers",
    elevationBadge: "600m - 1,600m",
  },
  {
    id: "GEO-THAR",
    name: "Thar Great Arid Basin",
    category: "DESERT",
    coords: [26.5, 71.5],
    description: "Sub-tropical desert matrix subject to extreme seasonal thermal shifts",
    elevationBadge: "100m - 350m",
  },
  {
    id: "GEO-SUNDARBANS",
    name: "Sundarbans Mangrove Delta",
    category: "DELTA",
    coords: [21.8, 88.8],
    description: "World's largest tidal halophytic mangrove delta buffer against storms",
    elevationBadge: "0m - 10m",
  },
  {
    id: "GEO-KUTCH",
    name: "Great Rann of Kutch",
    category: "DESERT",
    coords: [23.9, 70.2],
    description: "Seasonal seasonal salt marsh desert matrix adjacent to Gulf of Kutch",
    elevationBadge: "0m - 15m",
  },
  {
    id: "GEO-MALABAR",
    name: "Malabar Monsoon Coast",
    category: "COASTAL",
    coords: [10.2, 75.9],
    description: "High precipitation Arabian Sea littoral strip with lagoons & backwaters",
    elevationBadge: "Sea Level",
  },
  {
    id: "GEO-COROMANDEL",
    name: "Coromandel Coastal Plain",
    category: "COASTAL",
    coords: [12.2, 80.1],
    description: "Bay of Bengal coastal strip vulnerable to post-monsoon tropical cyclones",
    elevationBadge: "Sea Level",
  },
];

// 6. Prominent Mountain Peaks & Strategic Passes (Revealed at Zoom >= 7.2)
export const MOUNTAIN_PEAKS_AND_PASSES: MountainPeakOrPass[] = [
  {
    id: "PEAK-NANDA-DEVI",
    name: "Nanda Devi",
    type: "PEAK",
    coords: [30.375, 79.970],
    elevation: "7,816 m",
    state: "Uttarakhand",
    strategicNote: "Second highest peak in India; core watershed monitoring beacon",
  },
  {
    id: "PEAK-KANCHENJUNGA",
    name: "Kanchenjunga",
    type: "PEAK",
    coords: [27.702, 88.147],
    elevation: "8,586 m",
    state: "Sikkim",
    strategicNote: "Highest peak in India; glacial moraine and transboundary ridge",
  },
  {
    id: "PEAK-TRISHUL",
    name: "Trishul Massif",
    type: "PEAK",
    coords: [30.309, 79.776],
    elevation: "7,120 m",
    state: "Uttarakhand",
    strategicNote: "Rishi Ganga glacier headwall; key Chamoli disaster trigger ridge",
  },
  {
    id: "PEAK-KAMET",
    name: "Kamet Peak",
    type: "PEAK",
    coords: [30.927, 79.594],
    elevation: "7,756 m",
    state: "Uttarakhand",
    strategicNote: "Zaskar Range summit near Tibetan border plateau",
  },
  {
    id: "PEAK-ANAMUDI",
    name: "Anamudi Peak",
    type: "PEAK",
    coords: [10.170, 77.065],
    elevation: "2,695 m",
    state: "Kerala",
    strategicNote: "Highest elevation point in Peninsular India (Western Ghats)",
  },
  {
    id: "PEAK-DODDABETTA",
    name: "Doddabetta Massif",
    type: "PEAK",
    coords: [11.401, 76.736],
    elevation: "2,637 m",
    state: "Tamil Nadu",
    strategicNote: "Highest summit in Nilgiri Hills; meteorological radar node",
  },
  {
    id: "PEAK-KALSUBAI",
    name: "Kalsubai Peak",
    type: "PEAK",
    coords: [19.601, 73.708],
    elevation: "1,646 m",
    state: "Maharashtra",
    strategicNote: "Highest peak in Western Sahyadri range overlooking Godavari basin",
  },
  {
    id: "PASS-ROHTANG",
    name: "Rohtang Pass",
    type: "PASS",
    coords: [32.371, 77.246],
    elevation: "3,978 m",
    state: "Himachal Pradesh",
    strategicNote: "Strategic high mountain pass connecting Kullu and Lahaul-Spiti",
  },
  {
    id: "PASS-ZOJILA",
    name: "Zoji La Pass",
    type: "PASS",
    coords: [34.280, 75.474],
    elevation: "3,528 m",
    state: "Ladakh / J&K",
    strategicNote: "Crucial strategic mountain pass bridging Kashmir valley to Ladakh",
  },
  {
    id: "PASS-NATHULA",
    name: "Nathu La Pass",
    type: "PASS",
    coords: [27.386, 88.832],
    elevation: "4,310 m",
    state: "Sikkim",
    strategicNote: "Historic trans-Himalayan corridor on ancient Silk Route",
  },
  {
    id: "PASS-MANA",
    name: "Mana Pass (Chirbitya)",
    type: "PASS",
    coords: [31.066, 79.418],
    elevation: "5,610 m",
    state: "Uttarakhand",
    strategicNote: "High elevation vehicle pass near source of Saraswati / Alaknanda",
  },
];

// 7. Strategic Dams, Reservoirs & Water Bodies (Revealed at Zoom >= 7.2)
export const STRATEGIC_WATER_AND_DAMS: WaterBodyOrDam[] = [
  {
    id: "DAM-TEHRI",
    name: "Tehri Dam & Reservoir",
    type: "DAM",
    coords: [30.378, 78.480],
    spec: "Height: 260.5m | Cap: 3,200 MCM | 2,400 MW",
    riverOrCoast: "Bhagirathi River (Uttarakhand)",
  },
  {
    id: "DAM-BHAKRA",
    name: "Bhakra Nangal Dam",
    type: "DAM",
    coords: [31.410, 76.435],
    spec: "Height: 226m | Cap: 9,621 MCM | Gobind Sagar",
    riverOrCoast: "Sutlej River (Himachal / Punjab)",
  },
  {
    id: "DAM-HIRAKUD",
    name: "Hirakud Dam",
    type: "DAM",
    coords: [21.570, 83.870],
    spec: "Length: 25.8km | Cap: 5,896 MCM | Major Flood Control",
    riverOrCoast: "Mahanadi River (Odisha)",
  },
  {
    id: "DAM-SARDAR-SAROVAR",
    name: "Sardar Sarovar Dam",
    type: "DAM",
    coords: [21.830, 73.749],
    spec: "Height: 163m | Cap: 9,500 MCM | Irrigation Matrix",
    riverOrCoast: "Narmada River (Gujarat)",
  },
  {
    id: "DAM-METTUR",
    name: "Mettur Stanley Dam",
    type: "DAM",
    coords: [11.802, 77.801],
    spec: "Height: 65m | Cap: 2,640 MCM | Delta Lifeline",
    riverOrCoast: "Cauvery River (Tamil Nadu)",
  },
  {
    id: "DAM-NAGARJUNA",
    name: "Nagarjuna Sagar Dam",
    type: "DAM",
    coords: [16.574, 79.313],
    spec: "Masonry: 124m | Cap: 11,560 MCM",
    riverOrCoast: "Krishna River (Telangana / AP)",
  },
  {
    id: "WATER-CHILIKA",
    name: "Chilika Tidal Lagoon",
    type: "LAGOON",
    coords: [19.70, 85.30],
    spec: "Area: 1,165 km² | Largest Brackish Lagoon in Asia",
    riverOrCoast: "Odisha Coastline / Bay of Bengal",
  },
  {
    id: "WATER-PULICAT",
    name: "Pulicat Barrier Lagoon",
    type: "LAGOON",
    coords: [13.60, 80.20],
    spec: "Area: 759 km² | Second Largest Brackish Lagoon",
    riverOrCoast: "Coromandel Coast / AP-Tamil Nadu",
  },
  {
    id: "WATER-GULF-KUTCH",
    name: "Gulf of Kutch",
    type: "GULF",
    coords: [22.60, 69.50],
    spec: "Depth: 60m | Marine National Park & Tidal Buffer",
    riverOrCoast: "Arabian Sea (Gujarat)",
  },
  {
    id: "WATER-GULF-KHAMBHAT",
    name: "Gulf of Khambhat",
    type: "GULF",
    coords: [21.20, 72.20],
    spec: "Estuarine Funnel: Narmada, Tapi, Mahi Confluences",
    riverOrCoast: "Arabian Sea (Gujarat)",
  },
];

// 8. Strategic District Centers & Critical Waypoints (Revealed at Zoom >= 7.2)
export const STRATEGIC_DISTRICT_HUBS: DistrictCenter[] = [
  { id: "DIST-CHAMOLI", name: "Chamoli / Gopeshwar", district: "Chamoli", state: "Uttarakhand", coords: [30.412, 79.330], role: "High-Altitude GLOF Command Post" },
  { id: "DIST-JOSHIMATH", name: "Joshimath Cantonment", district: "Chamoli", state: "Uttarakhand", coords: [30.556, 79.563], role: "Sub-surface Subsidence & Glacier Hub" },
  { id: "DIST-RISHIKESH", name: "Rishikesh Foothills", district: "Dehradun", state: "Uttarakhand", coords: [30.086, 78.267], role: "Evacuation Reception & Staging Depot" },
  { id: "DIST-PURI", name: "Puri Coastal Center", district: "Puri", state: "Odisha", coords: [19.813, 85.831], role: "Coastal Cyclone Defense Swath" },
  { id: "DIST-PARADIP", name: "Paradip Deepwater Port", district: "Jagatsinghpur", state: "Odisha", coords: [20.316, 86.611], role: "Maritime Relief Harbor & Petrochemical Hub" },
  { id: "DIST-TEZPUR", name: "Tezpur Air & River Depot", district: "Sonitpur", state: "Assam", coords: [26.652, 92.792], role: "Brahmaputra Flood Relief Bridgehead" },
  { id: "DIST-KAZIRANGA", name: "Kaziranga Corridor", district: "Golaghat", state: "Assam", coords: [26.600, 93.590], role: "Wildlife & Highlands Relocation Matrix" },
  { id: "DIST-SALEM", name: "Salem Strategic Junction", district: "Salem", state: "Tamil Nadu", coords: [11.664, 78.146], role: "Cauvery Basin Logistics & Dispatch" },
  { id: "DIST-SURAT", name: "Surat Estuary Terminal", district: "Surat", state: "Gujarat", coords: [21.170, 72.831], role: "Tapi Flood Barrier & Industrial Zone" },
  { id: "DIST-NASHIK", name: "Nashik Upper Godavari", district: "Nashik", state: "Maharashtra", coords: [19.997, 73.789], role: "Western Ghats Spillway Monitoring Node" },
];

// 9. Tactical Safe Shelters in Indian Sectors
export const SAFE_SHELTERS = [
  { id: "SHELTER-RISHIKESH", name: "Rishikesh High-Ground Base", coords: [30.086, 78.267] as [number, number], capacity: "12,500 Beds", radioFreq: "148.650 MHz" },
  { id: "SHELTER-PARADIP", name: "Paradip Cyclone Haven", coords: [20.316, 86.611] as [number, number], capacity: "24,000 Beds", radioFreq: "156.800 MHz (VHF Ch 16)" },
  { id: "SHELTER-TEZPUR", name: "Tezpur Flood Relocation Depot", coords: [26.652, 92.792] as [number, number], capacity: "8,000 Beds", radioFreq: "149.200 MHz" },
  { id: "SHELTER-BHUBANESWAR", name: "Kalinga Multi-Hazard Stadium", coords: [20.301, 85.820] as [number, number], capacity: "18,000 Beds", radioFreq: "152.100 MHz" },
  { id: "SHELTER-JOSHIMATH", name: "Auli Helipad Refuge Center", coords: [30.531, 79.569] as [number, number], capacity: "3,500 Beds", radioFreq: "146.520 MHz" },
];

// 10. Critical Evacuation Corridors
export interface EvacuationCorridor {
  id: string;
  name: string;
  highwayRef: string;
  sector: string;
  status: "OPEN" | "SEVERED" | "IMPEDED";
  points: [number, number][];
  clearanceNote: string;
  bottlenecks?: string[];
}

export const CRITICAL_EVACUATION_CORRIDORS: EvacuationCorridor[] = [
  {
    id: "EVAC-NH58-HELANG",
    name: "NH-58 Helang-Joshimath Corridor",
    highwayRef: "NH-58",
    sector: "Chamoli / Himalayan Belt",
    status: "SEVERED",
    points: [
      [30.556, 79.563],
      [30.525, 79.510],
      [30.485, 79.440],
      [30.412, 79.330],
    ],
    clearanceNote: "Severed at km 42 due to slope failure; detour via Helang bypass",
    bottlenecks: ["Single-lane debris choke at km 42", "Raini bridge approach washed out"],
  },
  {
    id: "EVAC-NH58-RISHIKESH",
    name: "NH-58 Chamoli-Rishikesh Arterial",
    highwayRef: "NH-58",
    sector: "Uttarakhand Lower Sector",
    status: "OPEN",
    points: [
      [30.412, 79.330],
      [30.285, 78.980],
      [30.150, 78.550],
      [30.086, 78.267],
    ],
    clearanceNote: "Primary open evacuation corridor toward Rishikesh Base Haven",
    bottlenecks: ["Heavy traffic load entering Rishikesh staging depot"],
  },
  {
    id: "EVAC-NH16-PURI",
    name: "NH-16 Puri-Bhubaneswar Coastal Arterial",
    highwayRef: "NH-16 / NH-316",
    sector: "Odisha Coastal Zone",
    status: "OPEN",
    points: [
      [19.813, 85.831],
      [19.950, 85.820],
      [20.150, 85.815],
      [20.301, 85.820],
    ],
    clearanceNote: "High-capacity dual-carriageway evac corridor toward Kalinga Stadium",
    bottlenecks: ["Tidal backwater surge monitoring at Pipili flyover"],
  },
  {
    id: "EVAC-NH715-TEZPUR",
    name: "NH-715 Tezpur-Kaziranga Highway",
    highwayRef: "NH-715",
    sector: "Assam Valley",
    status: "IMPEDED",
    points: [
      [26.600, 93.590],
      [26.620, 93.150],
      [26.652, 92.792],
    ],
    clearanceNote: "Impeded by waterlogging at km 18; restricted to high-clearance trucks",
    bottlenecks: ["Water 0.35m over road surface near Kaliabor bridgehead"],
  },
  {
    id: "EVAC-NH44-SALEM",
    name: "NH-44 Mettur-Salem Southern Corridor",
    highwayRef: "NH-44",
    sector: "Cauvery Basin",
    status: "OPEN",
    points: [
      [11.796, 77.801],
      [11.720, 77.950],
      [11.664, 78.146],
    ],
    clearanceNote: "Clear multi-lane evacuation route away from Mettur dam discharge channel",
  },
];

// 11. Road Cutoffs & Critical Infrastructure Chokepoints
export interface RoadChokepoint {
  id: string;
  name: string;
  highwayRef: string;
  status: "SEVERED" | "IMPEDED" | "CRITICAL_BOTTLENECK";
  coords: [number, number];
  description: string;
}

export const ROAD_CUTOFF_CHOKEPOINTS: RoadChokepoint[] = [
  {
    id: "CUT-CHAMOLI-KM42",
    name: "NH-58 Km 42 Landslide Cutoff",
    highwayRef: "NH-58",
    status: "SEVERED",
    coords: [30.485, 79.440],
    description: "180m slope collapse across carriage-way; road impassable to vehicles",
  },
  {
    id: "CUT-RAINI-BRIDGE",
    name: "Raini Bridge Washout",
    highwayRef: "Border Access Road",
    status: "SEVERED",
    coords: [30.491, 79.702],
    description: "Concrete abutment washed out by glacial debris surge",
  },
  {
    id: "CUT-PURI-MARINE",
    name: "Puri-Konark Marine Drive Inundation",
    highwayRef: "SH-60",
    status: "SEVERED",
    coords: [19.850, 85.950],
    description: "1.2m storm surge inundation blocking coastal access",
  },
  {
    id: "CUT-TEZPUR-EMBANKMENT",
    name: "Tezpur Embankment Waterlogging",
    highwayRef: "NH-715",
    status: "IMPEDED",
    coords: [26.635, 93.050],
    description: "Controlled one-way convoy movement under SDRF escort",
  },
];

// 12. Authoritative Hazard Red-Zones (Polygons)
export interface AuthoritativeHazardPolygon {
  id: string;
  name: string;
  classification: "RED_ZONE" | "WARNING_ZONE";
  hazardType: string;
  polygon: [number, number][];
  center: [number, number];
  radiusMeters?: number;
  description: string;
  populationExposed: number;
}

export const AUTHORITATIVE_HAZARD_ZONES: AuthoritativeHazardPolygon[] = [
  {
    id: "ZONE-CHAMOLI-GLOF",
    name: "Chamoli Dhauliganga High Relief Red Zone",
    classification: "RED_ZONE",
    hazardType: "GLOF & Flash Surge",
    center: [30.5541, 79.5663],
    polygon: [
      [30.68, 79.75],
      [30.62, 79.82],
      [30.45, 79.72],
      [30.38, 79.48],
      [30.42, 79.30],
      [30.58, 79.45],
    ],
    description: "Acute glacial outburst flood & mass wasting perimeter in Upper Dhauliganga Gorge",
    populationExposed: 42500,
  },
  {
    id: "ZONE-CYCLONE-SURGE",
    name: "Odisha-Andhra Cyclone Varun Surge Swath",
    classification: "RED_ZONE",
    hazardType: "Category 4 Storm Surge",
    center: [19.8135, 85.8312],
    polygon: [
      [20.45, 86.80],
      [20.10, 86.50],
      [19.60, 85.70],
      [19.25, 84.95],
      [19.10, 85.20],
      [19.55, 86.10],
      [20.20, 86.95],
    ],
    description: "3.8m storm surge inundation perimeter along low-lying coastal mangrove and delta",
    populationExposed: 230000,
  },
  {
    id: "ZONE-BRAHMAPUTRA-FLOOD",
    name: "Majuli & Kaziranga Basin Inundation Zone",
    classification: "WARNING_ZONE",
    hazardType: "Riverine Flood Embankment Breach",
    center: [26.6854, 93.3512],
    polygon: [
      [26.95, 94.20],
      [26.85, 94.40],
      [26.50, 93.70],
      [26.45, 93.10],
      [26.70, 92.95],
      [26.90, 93.60],
    ],
    description: "Surcharge buffer where river stage exceeds dangerous embankment breach limits",
    populationExposed: 118000,
  },
];

// 13. Central Command HQ
export const CENTRAL_COMMAND_HQ = {
  id: "HQ-DELHI",
  name: "National Situation Room // ISIE Central Command",
  coords: [28.6139, 77.2090] as [number, number],
  callsign: "ISIE-ACTUAL",
  status: "ACTIVE DEFCON-2 WATCH",
  organization: "National Disaster Management Authority (NDMA)",
};

