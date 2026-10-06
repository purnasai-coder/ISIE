// ISIE Geospatial Intelligence Data Architecture
// Real-world geographic vectors, regional boundaries, hydrological features, and tactical incident telemetry

export interface GeoPoint {
  name: string;
  code: string;
  lat: number;
  lon: number;
  type: "CONTINENT" | "COUNTRY" | "STATE" | "CITY" | "WATER" | "INCIDENT";
  minDist?: number; // Minimum camera distance to display (LOD)
  maxDist?: number; // Maximum camera distance to display (LOD)
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SECURE";
}

// 1. GLOBAL CONTINENTS (Visible at high altitudes / Global View)
export const CONTINENTS: GeoPoint[] = [
  { name: "ASIA", code: "AS", lat: 34.0, lon: 100.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
  { name: "EUROPE", code: "EU", lat: 54.0, lon: 15.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
  { name: "AFRICA", code: "AF", lat: 2.0, lon: 20.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
  { name: "NORTH AMERICA", code: "NA", lat: 40.0, lon: -100.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
  { name: "SOUTH AMERICA", code: "SA", lat: -15.0, lon: -60.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
  { name: "AUSTRALIA", code: "OC", lat: -25.0, lon: 135.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
  { name: "ANTARCTICA", code: "AN", lat: -80.0, lon: 0.0, type: "CONTINENT", minDist: 130, maxDist: 350 },
];

// 2. MAJOR GLOBAL COUNTRIES & STRATEGIC NEIGHBORS (Visible at Mid Altitudes)
export const COUNTRIES: GeoPoint[] = [
  { name: "INDIA", code: "IND", lat: 22.5, lon: 78.9, type: "COUNTRY", minDist: 65, maxDist: 220 },
  { name: "CHINA", code: "CHN", lat: 35.0, lon: 104.0, type: "COUNTRY", minDist: 95, maxDist: 220 },
  { name: "PAKISTAN", code: "PAK", lat: 30.3, lon: 69.3, type: "COUNTRY", minDist: 80, maxDist: 190 },
  { name: "BANGLADESH", code: "BGD", lat: 23.7, lon: 90.3, type: "COUNTRY", minDist: 75, maxDist: 175 },
  { name: "NEPAL", code: "NPL", lat: 28.4, lon: 84.1, type: "COUNTRY", minDist: 70, maxDist: 170 },
  { name: "BHUTAN", code: "BTN", lat: 27.5, lon: 90.4, type: "COUNTRY", minDist: 70, maxDist: 160 },
  { name: "MYANMAR", code: "MMR", lat: 21.9, lon: 96.0, type: "COUNTRY", minDist: 80, maxDist: 185 },
  { name: "SRI LANKA", code: "LKA", lat: 7.8, lon: 80.7, type: "COUNTRY", minDist: 75, maxDist: 175 },
  { name: "RUSSIA", code: "RUS", lat: 60.0, lon: 90.0, type: "COUNTRY", minDist: 110, maxDist: 250 },
  { name: "UNITED STATES", code: "USA", lat: 38.0, lon: -97.0, type: "COUNTRY", minDist: 110, maxDist: 250 },
  { name: "JAPAN", code: "JPN", lat: 36.0, lon: 138.0, type: "COUNTRY", minDist: 95, maxDist: 210 },
  { name: "UNITED KINGDOM", code: "GBR", lat: 55.0, lon: -3.0, type: "COUNTRY", minDist: 95, maxDist: 210 },
  { name: "GERMANY", code: "DEU", lat: 51.0, lon: 10.0, type: "COUNTRY", minDist: 95, maxDist: 200 },
  { name: "FRANCE", code: "FRA", lat: 46.0, lon: 2.0, type: "COUNTRY", minDist: 95, maxDist: 200 },
  { name: "SAUDI ARABIA", code: "SAU", lat: 24.0, lon: 45.0, type: "COUNTRY", minDist: 95, maxDist: 210 },
  { name: "IRAN", code: "IRN", lat: 32.0, lon: 53.0, type: "COUNTRY", minDist: 90, maxDist: 200 },
  { name: "INDONESIA", code: "IDN", lat: -0.8, lon: 113.9, type: "COUNTRY", minDist: 95, maxDist: 210 },
];

// 3. INDIAN STATES & UNION TERRITORIES (Visible at India & Regional Zoom)
export const INDIAN_STATES: GeoPoint[] = [
  { name: "JAMMU & KASHMIR", code: "JK", lat: 33.77, lon: 74.80, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "LADAKH", code: "LA", lat: 34.15, lon: 77.58, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "HIMACHAL PRADESH", code: "HP", lat: 31.90, lon: 77.17, type: "STATE", minDist: 45, maxDist: 130 },
  { name: "PUNJAB", code: "PB", lat: 31.14, lon: 75.34, type: "STATE", minDist: 45, maxDist: 130 },
  { name: "HARYANA", code: "HR", lat: 29.05, lon: 76.08, type: "STATE", minDist: 45, maxDist: 125 },
  { name: "UTTARAKHAND", code: "UK", lat: 30.06, lon: 79.06, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "DELHI // NCR", code: "DL", lat: 28.61, lon: 77.21, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "RAJASTHAN", code: "RJ", lat: 26.58, lon: 73.84, type: "STATE", minDist: 45, maxDist: 140 },
  { name: "UTTAR PRADESH", code: "UP", lat: 26.84, lon: 80.94, type: "STATE", minDist: 45, maxDist: 140 },
  { name: "BIHAR", code: "BR", lat: 25.60, lon: 85.31, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "SIKKIM", code: "SK", lat: 27.53, lon: 88.51, type: "STATE", minDist: 45, maxDist: 120 },
  { name: "ARUNACHAL PRADESH", code: "AR", lat: 28.21, lon: 94.72, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "ASSAM", code: "AS", lat: 26.20, lon: 92.93, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "NAGALAND", code: "NL", lat: 26.15, lon: 94.56, type: "STATE", minDist: 45, maxDist: 120 },
  { name: "MANIPUR", code: "MN", lat: 24.66, lon: 93.90, type: "STATE", minDist: 45, maxDist: 120 },
  { name: "MIZORAM", code: "MZ", lat: 23.16, lon: 92.93, type: "STATE", minDist: 45, maxDist: 120 },
  { name: "TRIPURA", code: "TR", lat: 23.94, lon: 91.98, type: "STATE", minDist: 45, maxDist: 120 },
  { name: "MEGHALAYA", code: "ML", lat: 25.46, lon: 91.36, type: "STATE", minDist: 45, maxDist: 120 },
  { name: "WEST BENGAL", code: "WB", lat: 23.16, lon: 87.85, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "JHARKHAND", code: "JH", lat: 23.61, lon: 85.33, type: "STATE", minDist: 45, maxDist: 130 },
  { name: "ODISHA", code: "OD", lat: 20.95, lon: 85.09, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "CHHATTISGARH", code: "CG", lat: 21.27, lon: 81.86, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "MADHYA PRADESH", code: "MP", lat: 23.25, lon: 77.41, type: "STATE", minDist: 45, maxDist: 140 },
  { name: "GUJARAT", code: "GJ", lat: 22.25, lon: 71.19, type: "STATE", minDist: 45, maxDist: 140 },
  { name: "MAHARASHTRA", code: "MH", lat: 19.75, lon: 75.71, type: "STATE", minDist: 45, maxDist: 140 },
  { name: "GOA", code: "GA", lat: 15.29, lon: 74.12, type: "STATE", minDist: 45, maxDist: 110 },
  { name: "KARNATAKA", code: "KA", lat: 15.31, lon: 75.71, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "TELANGANA", code: "TG", lat: 18.11, lon: 79.01, type: "STATE", minDist: 45, maxDist: 130 },
  { name: "ANDHRA PRADESH", code: "AP", lat: 15.91, lon: 80.64, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "TAMIL NADU", code: "TN", lat: 11.12, lon: 78.65, type: "STATE", minDist: 45, maxDist: 135 },
  { name: "KERALA", code: "KL", lat: 10.85, lon: 76.27, type: "STATE", minDist: 45, maxDist: 130 },
];

// 4. STRATEGIC METROPOLITAN & COMMAND CITIES (Visible at Close Zoom)
export const STRATEGIC_CITIES: GeoPoint[] = [
  { name: "NEW DELHI", code: "HQ", lat: 28.6139, lon: 77.2090, type: "CITY", minDist: 40, maxDist: 115 },
  { name: "MUMBAI", code: "BOM", lat: 19.0760, lon: 72.8777, type: "CITY", minDist: 40, maxDist: 110 },
  { name: "KOLKATA", code: "CCU", lat: 22.5726, lon: 88.3639, type: "CITY", minDist: 40, maxDist: 110 },
  { name: "CHENNAI", code: "MAA", lat: 13.0827, lon: 80.2707, type: "CITY", minDist: 40, maxDist: 110 },
  { name: "BENGALURU", code: "BLR", lat: 12.9716, lon: 77.5946, type: "CITY", minDist: 40, maxDist: 110 },
  { name: "HYDERABAD", code: "HYD", lat: 17.3850, lon: 78.4867, type: "CITY", minDist: 40, maxDist: 105 },
  { name: "AHMEDABAD", code: "AMD", lat: 23.0225, lon: 72.5714, type: "CITY", minDist: 40, maxDist: 105 },
  { name: "DEHRADUN", code: "DED", lat: 30.3165, lon: 78.0322, type: "CITY", minDist: 40, maxDist: 95 },
  { name: "GUWAHATI", code: "GAU", lat: 26.1445, lon: 91.7362, type: "CITY", minDist: 40, maxDist: 100 },
  { name: "BHUBANESWAR", code: "BBI", lat: 20.2961, lon: 85.8245, type: "CITY", minDist: 40, maxDist: 100 },
  { name: "SRINAGAR", code: "SXR", lat: 34.0837, lon: 74.7973, type: "CITY", minDist: 40, maxDist: 95 },
];

// 5. MAJOR WATER BODIES
export const WATER_BODIES: GeoPoint[] = [
  { name: "ARABIAN SEA", code: "AS", lat: 17.0, lon: 66.0, type: "WATER", minDist: 85, maxDist: 240 },
  { name: "BAY OF BENGAL", code: "BOB", lat: 15.0, lon: 88.0, type: "WATER", minDist: 85, maxDist: 240 },
  { name: "INDIAN OCEAN", code: "IO", lat: 3.5, lon: 78.5, type: "WATER", minDist: 95, maxDist: 260 },
];

// 6. MAJOR INDIAN RIVERS (Coordinates along river courses)
export const RIVERS_DATA: { name: string; points: [number, number][] }[] = [
  {
    name: "Ganga",
    points: [
      [30.98, 78.93], [30.15, 78.30], [29.95, 78.16], [28.40, 79.90],
      [27.15, 80.00], [26.46, 80.35], [25.43, 81.85], [25.32, 83.00],
      [25.61, 85.14], [25.25, 87.00], [24.80, 87.93], [23.20, 88.40],
      [22.20, 88.60],
    ],
  },
  {
    name: "Yamuna",
    points: [
      [31.01, 78.45], [30.30, 77.60], [28.65, 77.23], [27.50, 77.68],
      [27.18, 78.02], [26.47, 79.03], [25.43, 81.85],
    ],
  },
  {
    name: "Brahmaputra",
    points: [
      [28.25, 95.35], [27.48, 94.90], [26.90, 93.80], [26.65, 93.35],
      [26.18, 91.75], [26.05, 90.50], [25.80, 89.90], [25.20, 89.65],
    ],
  },
  {
    name: "Godavari",
    points: [
      [19.93, 73.53], [19.88, 75.34], [19.15, 77.31], [18.80, 79.10],
      [17.75, 80.60], [17.00, 81.78], [16.70, 82.20],
    ],
  },
  {
    name: "Krishna",
    points: [
      [17.92, 73.65], [17.30, 74.18], [16.20, 75.80], [16.50, 77.30],
      [16.25, 79.50], [16.51, 80.63], [15.80, 80.90],
    ],
  },
  {
    name: "Narmada",
    points: [
      [22.67, 81.75], [23.18, 79.95], [22.80, 78.00], [22.20, 76.00],
      [21.80, 74.00], [21.65, 72.95],
    ],
  },
  {
    name: "Cauvery",
    points: [
      [12.38, 75.50], [12.42, 75.73], [12.30, 76.60], [11.79, 77.80],
      [11.35, 78.00], [10.80, 78.70], [11.14, 79.85],
    ],
  },
];

// 7. REALISTIC VECTOR BOUNDARY OF INDIA (Key perimeter coordinates)
export const INDIA_BORDER_COORDINATES: [number, number][] = [
  // Gujarat / Rann of Kutch
  [23.5, 68.3], [24.0, 68.8], [24.5, 70.8], [24.8, 71.3],
  // Rajasthan Western Border
  [25.5, 70.5], [26.8, 70.2], [27.8, 71.0], [28.5, 72.0], [29.5, 73.2],
  // Punjab / J&K Border
  [30.5, 74.5], [31.6, 74.8], [32.5, 74.2], [33.5, 74.0],
  // Northern Ladakh / Karakoram
  [34.8, 76.2], [35.5, 77.5], [35.0, 79.0], [33.5, 79.2], [32.5, 78.8],
  // Himachal / Uttarakhand / Nepal Northern Border
  [31.2, 79.5], [30.4, 80.5], [29.5, 81.0], [28.2, 83.5], [27.5, 85.5], [26.8, 88.0],
  // Sikkim
  [27.3, 88.3], [28.0, 88.6], [27.7, 89.0],
  // Bhutan Northern Border to Arunachal
  [27.0, 91.5], [27.5, 92.0], [28.2, 94.0], [29.0, 95.5], [28.5, 96.5], [27.8, 97.2],
  // Myanmar Border (Nagaland, Manipur, Mizoram)
  [26.5, 95.0], [25.0, 94.5], [24.0, 93.5], [22.5, 93.2], [21.8, 92.8],
  // Bangladesh Border & Tripura / Meghalaya
  [23.5, 92.0], [24.5, 92.2], [25.2, 91.5], [25.5, 90.0], [26.0, 89.8],
  // West Bengal Sundarbans
  [24.5, 88.5], [23.5, 88.8], [22.2, 88.5], [21.8, 87.8],
  // Eastern Coastline (Odisha, AP, Tamil Nadu)
  [20.5, 86.8], [19.8, 85.8], [18.2, 84.0], [16.5, 82.0], [15.5, 80.2],
  [13.5, 80.3], [11.8, 79.8], [10.2, 79.2], [9.2, 79.0],
  // Southern Tip (Kanyakumari)
  [8.08, 77.55],
  // Western Coastline (Kerala, Karnataka, Goa, Maharashtra, Gujarat)
  [8.8, 76.5], [10.5, 75.8], [12.5, 74.8], [15.0, 73.8], [16.5, 73.3],
  [19.0, 72.8], [20.5, 72.8], [21.5, 72.5], [21.2, 71.0], [22.2, 69.5],
  [23.0, 68.5], [23.5, 68.3],
];

// 8. GLOBAL CONTINENTAL COASTLINE VECTOR OUTLINES (For realistic global geography)
export const GLOBAL_COASTLINE_SEGS: [number, number][][] = [
  // Eurasia / Africa outline sample segments
  [
    [70, 30], [68, 45], [72, 75], [75, 110], [70, 140], [65, 170],
    [55, 160], [45, 145], [35, 130], [25, 120], [15, 105], [5, 100],
    [10, 95], [20, 88], [15, 80], [10, 76], [22, 70], [25, 60],
    [12, 45], [20, 38], [30, 32], [35, 25], [40, 15], [45, 5],
    [55, 8], [60, 20], [70, 30],
  ],
  // Africa
  [
    [35, -5], [37, 10], [32, 30], [20, 40], [12, 50], [0, 42],
    [-12, 40], [-25, 32], [-34, 25], [-34, 18], [-20, 12], [-5, 10],
    [4, 8], [5, 2], [6, -5], [15, -17], [25, -15], [35, -5],
  ],
  // North America
  [
    [70, -160], [72, -130], [60, -90], [55, -60], [45, -65], [35, -75],
    [25, -80], [28, -95], [20, -100], [15, -90], [22, -105], [30, -115],
    [38, -122], [50, -125], [60, -145], [65, -165], [70, -160],
  ],
  // South America
  [
    [12, -75], [8, -60], [-5, -35], [-20, -40], [-35, -55], [-55, -68],
    [-45, -75], [-30, -72], [-15, -75], [0, -80], [12, -75],
  ],
  // Australia
  [
    [-12, 130], [-15, 140], [-25, 150], [-38, 145], [-35, 135],
    [-32, 120], [-22, 114], [-15, 122], [-12, 130],
  ],
];

// Helper: Convert lat/lon on sphere of radius R into Three.js Cartesian Vector3
export function geoToVector3(lat: number, lon: number, radius: number): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}
