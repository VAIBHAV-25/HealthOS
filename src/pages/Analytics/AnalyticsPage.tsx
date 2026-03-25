import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import type { DateRange } from '../../types';

import { usePatientStore } from '../../store/patientStore';

const RANGES: { label: string; value: DateRange }[] = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
];

export const AnalyticsPage: React.FC = () => {
  const { patients } = usePatientStore();
  const [range, setRange] = useState<DateRange>('7d');

  // Dynamic Patient Condition Data
  const condMap: Record<string, number> = {};
  patients.forEach((p) => {
    const c = p.condition || 'Other';
    condMap[c] = (condMap[c] || 0) + 1;
  });
  const colors = ['#2563EB', '#7C3AED', '#DB2777', '#0891B2', '#D97706', '#6B7280'];
  const conditionData = Object.keys(condMap).map((k, i) => ({
    name: k,
    value: condMap[k],
    color: colors[i % colors.length],
  }));

  if (conditionData.length === 0) {
    conditionData.push({ name: 'No Patients', value: 1, color: '#E5E7EB' });
  }

  // Dynamic Date Range Data
  const getRangeData = (daysCount: number) => {
    const arr = Array.from({ length: daysCount }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (daysCount - 1 - i));
      const dayLabel = daysCount === 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] : `Day ${i + 1}`;
      return {
        day: dayLabel,
        dateStr: d.toISOString().split('T')[0],
        admissions: 0,
        discharges: 0,
        occupancy: 0,
      };
    });

    patients.forEach((p) => {
      if (!p.admitDate) return;
      const match = arr.find((d) => d.dateStr === p.admitDate);
      if (match) {
        if (p.status === 'Discharged') match.discharges++;
        else match.admissions++;
      }
    });

    arr.forEach((a, idx) => {
      a.occupancy = patients.length > 0 ? Math.min(100, 50 + a.admissions * 2 + (idx % 10)) : 0;
    });

    return arr;
  };

  const dataByRange = {
    '7d': getRangeData(7),
    '30d': getRangeData(30),
    '90d': getRangeData(90),
  };

  const data = dataByRange[range];

  const totalAdmissions = data.reduce((s, d) => s + d.admissions, 0);
  const totalDischarges = data.reduce((s, d) => s + d.discharges, 0);
  const avgOccupancy = Math.round(data.reduce((s, d) => s + d.occupancy, 0) / data.length);

  const stats = [
    { label: 'Total Admissions', value: totalAdmissions, change: +8.3, icon: <Users size={20} />, color: '#2563EB' },
    { label: 'Total Discharges', value: totalDischarges, change: +5.1, icon: <Activity size={20} />, color: '#059669' },
    { label: 'Avg Bed Occupancy', value: `${avgOccupancy}%`, change: -1.2, icon: <TrendingUp size={20} />, color: '#7C3AED' },
    { label: 'Net Occupancy Δ', value: totalAdmissions - totalDischarges, change: +2.4, icon: <TrendingDown size={20} />, color: '#D97706' },
  ];

  return (
    <div className="analytics-page">
      {/* Range filter */}
      <div className="analytics-toolbar">
        <div className="range-selector">
          {RANGES.map((r) => (
            <button
              key={r.value}
              className={`range-btn ${range === r.value ? 'active' : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="analytics-stats">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ color: s.color, background: `${s.color}18` }}>
              {s.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
            <span className={`stat-change ${s.change >= 0 ? 'up' : 'down'}`}>
              {s.change >= 0 ? '↑' : '↓'} {Math.abs(s.change)}%
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        {/* Admissions trend */}
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Admission & Discharge Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="adm2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="admissions" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Admissions" />
              <Line type="monotone" dataKey="discharges" stroke="#059669" strokeWidth={2.5} dot={false} name="Discharges" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bed occupancy */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Bed Occupancy %</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="occupancy" stroke="#7C3AED" strokeWidth={2.5} fill="url(#occGrad)" name="Occupancy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Condition breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Patient Condition Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={conditionData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {conditionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart by admissions */}
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Daily Admissions Volume</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Bar dataKey="admissions" fill="#2563EB" radius={[4, 4, 0, 0]} name="Admissions" />
              <Bar dataKey="discharges" fill="#059669" radius={[4, 4, 0, 0]} name="Discharges" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
