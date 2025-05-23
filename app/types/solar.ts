export interface PowerStatistics {
  id: null;
  systemId: number;
  year: number;
  month: number;
  day: number;
  generationValue: number;
  useValue: number | null;
  gridValue: number | null;
  buyValue: number | null;
  chargeValue: number | null;
  dischargeValue: number | null;
  incomeValue: number | null;
  gridRatio: number | null;
  useRatio: number | null;
  buyRatio: number | null;
  generationRatio: number | null;
  irradiate: number | null;
  pr: number | null;
  fullPowerHoursDay: number;
  irradiateIntensity: number | null;
  chargeRatio: number | null;
  useDischargeRatio: number | null;
  deviceData: any | null;
  acceptDay: string;
  cpr: number | null;
  theoreticalGeneration: number | null;
  loss: number | null;
  lossRatio: number | null;
  absorbedUseValue: number | null;
  genForGrid: number | null;
  useFromBuy: number | null;
  selfGenAndUseValue: number | null;
  selfSufficiencyValue: number | null;
  acCouplingGen: number | null;
  pvGen: number | null;
  dynamoGen: number | null;
  normalLoad: number | null;
  epsLoad: number | null;
}

export interface PowerRecord {
  systemId: number;
  acceptDay: number;
  acceptMonth: number;
  generationPower: number;
  usePower: number | null;
  gridPower: number | null;
  buyPower: number | null;
  chargePower: number | null;
  dischargePower: number | null;
  temperature: number | null;
  pr: number | null;
  irradiate: number | null;
  weather: string | null;
  useOffset: number | null;
  useOffsetIncome: number | null;
  dateTime: number;
  irradiateIntensity: number | null;
  wirePower: number | null;
  batterySoc: number | null;
  batteryPower: number | null;
  deviceData: any | null;
  generationRatio: number | null;
  generationCapacity: number;
  updateTime: number | null;
  upsPower: number | null;
  acCouplingGenPower: number | null;
  pvGenPower: number | null;
  dynamoGenPower: number | null;
  normalLoadPower: number | null;
  wireStatus: string | null;
  batteryStatus: string | null;
  timeZoneOffset: number;
}

export interface PowerHistoryResponse {
  statistics: PowerStatistics;
  records: PowerRecord[];
}

export interface MonthlyStatItem {
  id: null;
  systemId: number;
  year: number;
  month: number;
  day: number;
  generationValue: number;
  useValue: number | null;
  gridValue: number | null;
  buyValue: number | null;
  chargeValue: number | null;
  dischargeValue: number | null;
  incomeValue: number | null;
  gridRatio: number | null;
  useRatio: number | null;
  buyRatio: number | null;
  generationRatio: number | null;
  irradiate: number | null;
  pr: number | null;
  fullPowerHoursDay: number;
  irradiateIntensity: number | null;
  chargeRatio: number | null;
  useDischargeRatio: number | null;
  deviceData: any | null;
  acceptDay: string;
  cpr: number | null;
  theoreticalGeneration: number | null;
  loss: number | null;
  lossRatio: number | null;
  absorbedUseValue: number | null;
  genForGrid: number | null;
  useFromBuy: number | null;
  selfGenAndUseValue: number | null;
  selfSufficiencyValue: number | null;
  acCouplingGen: number | null;
  pvGen: number | null;
  dynamoGen: number | null;
  normalLoad: number | null;
  epsLoad: number | null;
}

export interface MonthlyStatistics {
  systemId: number;
  year: number;
  month: number;
  day: number; // 0 for monthly summary
  generationValue: number;
  useValue: number | null;
  gridValue: number | null;
  buyValue: number | null;
  chargeValue: number | null;
  dischargeValue: number | null;
  incomeValue: number | null;
  gridRatio: number | null;
  useRatio: number | null;
  buyRatio: number | null;
  generationRatio: number | null;
  irradiate: number | null;
  pr: number | null;
  fullPowerHoursDay: number;
  chargeRatio: number | null;
  useDischargeRatio: number | null;
  acceptDay: string | null;
  theoreticalGeneration: number | null;
  cpr: number | null;
  offsetDay: number | null;
  deviceData: any | null;
  loss: number | null;
  lossRatio: number | null;
  absorbedUseValue: number | null;
  genForGrid: number | null;
  useFromBuy: number | null;
  selfGenAndUseValue: number | null;
  selfSufficiencyValue: number | null;
  acCouplingGen: number | null;
  pvGen: number | null;
  dynamoGen: number | null;
  normalLoad: number | null;
  epsLoad: number | null;
}

export interface MonthlyStatsResponse {
  statistics: MonthlyStatistics;
  records: MonthlyStatItem[];
}

export interface DailyProduction {
  date: string;
  generation: number;
  fullPowerHours: number;
}

export interface ChartDataPoint {
  time: string;
  hour: string;
  power: number;
  timestamp: number;
}
