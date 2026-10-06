import { Scenario, ScenarioParameter, SimulationResult } from "../types/isie";

export const DEFAULT_SIMULATION_PARAMETERS: ScenarioParameter[] = [
  {
    id: "param-rainfall",
    key: "rainfall_intensity",
    name: "Precipitation Surge Factor",
    category: "METEOROLOGICAL",
    unit: "%",
    min: 0,
    max: 200,
    step: 5,
    defaultValue: 50,
    currentValue: 50,
    description: "Multiplication coefficient above normal monsoon 24-hr threshold",
  },
  {
    id: "param-dam-discharge",
    key: "dam_discharge_cumecs",
    name: "Upstream Dam Outflow Surge",
    category: "HYDROLOGICAL",
    unit: "cumecs",
    min: 1000,
    max: 25000,
    step: 500,
    defaultValue: 5000,
    currentValue: 5000,
    description: "Peak volume discharge rate into downstream river channels",
  },
  {
    id: "param-road-breach",
    key: "road_cutoff_prob",
    name: "Arterial Road Cutoff Probability",
    category: "INFRASTRUCTURE",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 35,
    currentValue: 35,
    description: "Likelihood of bridges or low-lying road segments becoming impassable",
  },
  {
    id: "param-shelter-deficit",
    key: "shelter_capacity_buffer",
    name: "Safe Shelter Capacity Buffer",
    category: "CAPACITY",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 20,
    currentValue: 20,
    description: "Reserve space buffer in designated relief shelters prior to saturation",
  },
];

export interface IScenarioService {
  getAvailableScenarios(): Promise<Scenario[]>;
  runSimulation(scenarioId: string, parameters: ScenarioParameter[]): Promise<{
    connected: boolean;
    statusMessage: string;
    result?: SimulationResult;
  }>;
}

export class ScenarioService implements IScenarioService {
  async getAvailableScenarios(): Promise<Scenario[]> {
    return [
      {
        id: "scen-monsoon-surge",
        name: "Scenario A: Flash Flood & Upstream Reservoir Surcharge",
        targetRegion: "Northern Sector & Glacial Basin",
        description: "Simulates severe precipitation combined with sudden spillway release on vulnerable habitations.",
        horizonHours: 24,
        parameters: DEFAULT_SIMULATION_PARAMETERS,
        status: "ENGINE_UNAVAILABLE",
      },
      {
        id: "scen-landslide-cascade",
        name: "Scenario B: Slope Failure & Transport Corridor Severance",
        targetRegion: "Himalayan Belt",
        description: "Evaluates habitation isolation when arterial highway cutoffs exceed critical thresholds.",
        horizonHours: 48,
        parameters: DEFAULT_SIMULATION_PARAMETERS,
        status: "ENGINE_UNAVAILABLE",
      },
      {
        id: "scen-cyclone-surge",
        name: "Scenario C: Coastal Storm Surge & Saline Inundation",
        targetRegion: "Coastal & Cyclone Surge Corridor",
        description: "Calculates carrying capacity collapse and urgent relocation priority for low-lying coastal habitations.",
        horizonHours: 72,
        parameters: DEFAULT_SIMULATION_PARAMETERS,
        status: "ENGINE_UNAVAILABLE",
      },
    ];
  }

  async runSimulation(
    _scenarioId: string,
    _parameters: ScenarioParameter[]
  ): Promise<{ connected: boolean; statusMessage: string; result?: SimulationResult }> {
    // Per requirement: "Run Simulation should show: Simulation engine not connected rather than inventing results"
    return {
      connected: false,
      statusMessage: "Simulation engine not connected. Connect high-performance compute node or backend ML service.",
    };
  }
}

export const scenarioService = new ScenarioService();
