import React from 'react';
import type { Patient } from '../../types';
import { User, Calendar, Stethoscope, Building2 } from 'lucide-react';

interface Props {
  patient: Patient;
}

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Stable: { color: '#059669', bg: '#D1FAE5', dot: '#059669' },
  Critical: { color: '#DC2626', bg: '#FEE2E2', dot: '#DC2626' },
  Recovering: { color: '#D97706', bg: '#FEF3C7', dot: '#D97706' },
  Discharged: { color: '#6B7280', bg: '#F3F4F6', dot: '#6B7280' },
};

const genderColors: Record<string, string> = {
  Male: '#2563EB',
  Female: '#DB2777',
  Other: '#7C3AED',
};

export const PatientCardGrid: React.FC<Props> = ({ patient }) => {
  const status = statusConfig[patient.status] || statusConfig.Stable;

  return (
    <div className="patient-grid-card">
      <div className="pgc-header">
        <div className="pgc-avatar" style={{ background: `${genderColors[patient.gender]}18`, color: genderColors[patient.gender] }}>
          {patient.avatar}
        </div>
        <div className="pgc-badge" style={{ color: status.color, background: status.bg }}>
          <span className="pgc-dot" style={{ background: status.dot }} />
          {patient.status}
        </div>
      </div>

      <div className="pgc-body">
        <h3 className="pgc-name">{patient.name}</h3>
        <p className="pgc-id">{patient.id}</p>

        <div className="pgc-condition">
          <span className="condition-chip">{patient.condition}</span>
        </div>

        <div className="pgc-meta">
          <div className="meta-row">
            <User size={12} />
            <span>{patient.age} yrs · {patient.gender}</span>
          </div>
          <div className="meta-row">
            <Stethoscope size={12} />
            <span>{patient.doctor}</span>
          </div>
          <div className="meta-row">
            <Building2 size={12} />
            <span>{patient.ward}</span>
          </div>
          <div className="meta-row">
            <Calendar size={12} />
            <span>Admitted {patient.admitDate}</span>
          </div>
        </div>
      </div>

      <div className="pgc-footer">
        <span className="blood-type" title="Blood Type">🩸 {patient.bloodType}</span>
        <span className="pgc-phone">{patient.phone}</span>
      </div>
    </div>
  );
};
