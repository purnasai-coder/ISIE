import { CarryingCapacityMetrics, HazardRedZone, RelocationIntelligence } from "@/lib/types/isie";

export const DEMO_RED_ZONES: HazardRedZone[] = [
  {
    id: "ZONE-HIM-01",
    zoneCode: "HZ-RED-01",
    name: "Upper Dhauliganga Gorge & Joshimath Flank",
    classification: "RED_ZONE",
    hazardType: "FLOOD",
    district: "Chamoli",
    state: "Uttarakhand",
    coordinates: { lat: 30.5541, lng: 79.5663 },
    populationExposed: 42500,
    carryingCapacityStatus: "CRITICAL",
    relocationPriorityScore: 94,
    lastAssessmentTimestamp: "2026-10-01 02:20 UTC",
    sourceAgencies: ["ISRO NDEM", "CWC Hydrology", "Copernicus Sentinel-1"],
  },
  {
    id: "ZONE-NOR-02",
    zoneCode: "HZ-WARN-02",
    name: "Majuli Island Low-Lying Embankment Zone",
    classification: "WARNING_ZONE",
    hazardType: "FLOOD",
    district: "Majuli",
    state: "Assam",
    coordinates: { lat: 26.6854, lng: 93.3512 },
    populationExposed: 118000,
    carryingCapacityStatus: "WARNING",
    relocationPriorityScore: 78,
    lastAssessmentTimestamp: "2026-10-01 01:50 UTC",
    sourceAgencies: ["CWC Hydrology", "IMD Mausam"],
  },
  {
    id: "ZONE-CST-03",
    zoneCode: "HZ-RED-03",
    name: "Ganjam Coastal Saline Inundation Corridor",
    classification: "RED_ZONE",
    hazardType: "CYCLONE",
    district: "Ganjam",
    state: "Odisha",
    coordinates: { lat: 19.8135, lng: 85.8312 },
    populationExposed: 230000,
    carryingCapacityStatus: "CRITICAL",
    relocationPriorityScore: 89,
    lastAssessmentTimestamp: "2026-10-01 00:45 UTC",
    sourceAgencies: ["IMD Cyclone Warning", "ISRO NDEM"],
  },
];

export const DEMO_CARRYING_CAPACITY: CarryingCapacityMetrics = {
  zoneId: "ZONE-HIM-01",
  populationExposure: {
    totalHabitationPopulation: 42500,
    vulnerablePopulation: 14800,
    currentShelterCapacity: 12000,
    capacityDeficitPercentage: 71.8,
  },
  infrastructureIntegrity: {
    criticalRoadsOperational: 35, // 65% severed
    bridgesAtRiskCount: 3,
    substationRiskStatus: "WARNING",
    telecomTowersOperational: 60,
  },
  healthcareAvailability: {
    districtHospitalBedOccupancy: 88,
    mobileMedicalUnitsActive: 4,
    criticalMedicineSupplyDays: 4.5,
  },
  resourceReserves: {
    potableWaterHoursRemaining: 28,
    emergencyRationPacks: 15400,
  },
  overallStatus: "CRITICAL",
};

export const DEMO_RELOCATION_PRIORITIES: RelocationIntelligence[] = [
  {
    zoneId: "ZONE-HIM-01",
    zoneName: "Dhauliganga Upper Gorge Sector",
    priorityRank: 1,
    relocationPriorityScore: 94,
    estimatedTransitTimeHours: 3.5,
    evacuationRoutesIdentified: [
      {
        routeId: "EVAC-R1",
        corridorName: "NH-58 Bypass via Helang Corridor",
        status: "OPEN",
        clearanceBottlenecks: ["Single-lane traffic bottleneck at km 42"],
      },
      {
        routeId: "EVAC-R2",
        corridorName: "Raini Bridge Old Track",
        status: "SEVERED",
        clearanceBottlenecks: ["Bridge abutment washed out"],
      },
    ],
    designatedShelters: [
      {
        shelterId: "SHELTER-P1",
        name: "Pipalkoti Intermediate College Haven",
        maxCapacity: 4500,
        currentLoad: 3700,
        distanceKm: 18.2,
      },
      {
        shelterId: "SHELTER-P2",
        name: "Chamoli Stadium Emergency Enclosure",
        maxCapacity: 7500,
        currentLoad: 2400,
        distanceKm: 28.5,
      },
    ],
  },
  {
    zoneId: "ZONE-CST-03",
    zoneName: "Ganjam Low-Lying Coastal Corridor",
    priorityRank: 2,
    relocationPriorityScore: 89,
    estimatedTransitTimeHours: 5.0,
    evacuationRoutesIdentified: [
      {
        routeId: "EVAC-R3",
        corridorName: "State Highway 32 Inward Corridor",
        status: "OPEN",
        clearanceBottlenecks: ["Low-lying causeway under 0.3m water"],
      },
    ],
    designatedShelters: [
      {
        shelterId: "SHELTER-C1",
        name: "Berhampur Cyclone Multi-Purpose Complex",
        maxCapacity: 15000,
        currentLoad: 11200,
        distanceKm: 14.0,
      },
    ],
  },
];
