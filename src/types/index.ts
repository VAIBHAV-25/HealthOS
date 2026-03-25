export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
  doctor: string;
  ward: string;
  admitDate: string;
  avatar: string;
  bloodType: string;
  phone: string;
  diagnosis: string;
}

export interface KPICard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  admissions?: number;
  discharges?: number;
  occupancy?: number;
}

export type ViewMode = 'grid' | 'list';
export type FilterStatus = 'All' | 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
export type DateRange = '7d' | '30d' | '90d';
