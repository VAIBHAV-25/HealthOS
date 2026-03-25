import React from 'react';
import {
  Users, CalendarCheck, TrendingUp,
  ArrowUp, ArrowDown, Clock, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { usePatientStore } from '../../store/patientStore';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { patients } = usePatientStore();
  const navigate = useNavigate();

  // Dynamically compute Department Data
  const deptMap: Record<string, number> = {};
  patients.forEach((p) => {
    const w = p.ward || 'Other';
    deptMap[w] = (deptMap[w] || 0) + 1;
  });
  const deptData = Object.keys(deptMap).map((k) => ({ dept: k, patients: deptMap[k] }));

  // Dynamically compute Admissions Data (Last 7 days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const admissionsData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return { day: days[d.getDay()], dateStr, admissions: 0, discharges: 0 };
  });

  patients.forEach((p) => {
    if (!p.admitDate) return;
    const match = admissionsData.find((d) => d.dateStr === p.admitDate);
    if (match) {
      if (p.status === 'Discharged') match.discharges += 1;
      else match.admissions += 1;
    }
  });

  // Dynamically compute Appointments
  const appointments = patients
    .filter((p) => p.status !== 'Discharged')
    .slice(0, 5)
    .map((p, i) => ({
      time: `${9 + i}:00 AM`,
      patient: p.name,
      type: 'Follow-up',
      doctor: p.doctor,
    }));

  const critical = patients.filter((p) => p.status === 'Critical').length;
  const recovering = patients.filter((p) => p.status === 'Recovering').length;

  const recoveryRate = patients.length > 0 ? Math.round((recovering / patients.length) * 100) : 0;

  const kpis = [
    { title: 'Total Patients', value: patients.length, change: +5.2, icon: <Users size={22} />, color: '#2563EB', bg: '#EFF6FF' },
    { title: 'Critical Cases', value: critical, change: -2.1, icon: <AlertTriangle size={22} />, color: '#DC2626', bg: '#FEF2F2' },
    { title: 'Appointments Today', value: appointments.length, change: +12.0, icon: <CalendarCheck size={22} />, color: '#7C3AED', bg: '#F5F3FF' },
    { title: 'Recovery Rate', value: `${recoveryRate}%`, change: +3.4, icon: <TrendingUp size={22} />, color: '#059669', bg: '#ECFDF5' },
  ];

  const recentPatients = patients.slice(0, 5);

  const statusColors: Record<string, string> = {
    Stable: '#059669',
    Critical: '#DC2626',
    Recovering: '#D97706',
    Discharged: '#6B7280',
  };

  return (
    <div className="dashboard-page">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div className="kpi-card" key={kpi.title}>
            <div className="kpi-header">
              <div className="kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                {kpi.icon}
              </div>
              <span className={`kpi-change ${kpi.change >= 0 ? 'positive' : 'negative'}`}>
                {kpi.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(kpi.change)}%
              </span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-title">{kpi.title}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Patient Admissions & Discharges</h3>
            <span className="chart-period">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={admissionsData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Legend />
              <Area type="monotone" dataKey="admissions" stroke="#2563EB" strokeWidth={2} fill="url(#admGrad)" name="Admissions" />
              <Area type="monotone" dataKey="discharges" stroke="#059669" strokeWidth={2} fill="url(#disGrad)" name="Discharges" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>By Department</h3>
            <span className="chart-period">Current</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Bar dataKey="patients" fill="#2563EB" radius={[0, 4, 4, 0]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="bottom-row">
        {/* Recent Patients */}
        <div className="table-card">
          <div className="card-header">
            <h3>Recent Patients</h3>
            <button className="view-all-btn" onClick={() => navigate('/patients')}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Ward</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state small">
                        <div className="empty-icon">🏥</div>
                        <h3>No patients yet</h3>
                        <p>Go to the Patients page to add your first patient.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentPatients.map((p) => (
                    <tr key={p.id} onClick={() => navigate('/patients')} className="table-row-clickable">
                      <td>
                        <div className="patient-cell">
                          <div className="avatar-sm">{p.avatar}</div>
                          <div>
                            <p className="patient-name-sm">{p.name}</p>
                            <p className="patient-id-sm">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>{p.condition}</td>
                      <td>{p.ward}</td>
                      <td>
                        <span className="status-badge" style={{ color: statusColors[p.status], background: `${statusColors[p.status]}18` }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointments */}
        <div className="appointments-card">
          <div className="card-header">
            <h3>Today's Appointments</h3>
            <span className="appt-count">{appointments.length}</span>
          </div>
          <div className="appt-list">
            {appointments.map((appt, i) => (
              <div key={i} className="appt-item">
                <div className="appt-time">
                  <Clock size={12} />
                  <span>{appt.time}</span>
                </div>
                <div className="appt-details">
                  <p className="appt-patient">{appt.patient}</p>
                  <p className="appt-meta">{appt.type} · {appt.doctor}</p>
                </div>
                <div className="appt-dot" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
