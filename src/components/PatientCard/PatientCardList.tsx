import React from 'react';
import type { Patient } from '../../types';

interface Props {
  patients: Patient[];
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  Stable: { color: '#059669', bg: '#D1FAE5' },
  Critical: { color: '#DC2626', bg: '#FEE2E2' },
  Recovering: { color: '#D97706', bg: '#FEF3C7' },
  Discharged: { color: '#6B7280', bg: '#F3F4F6' },
};

const genderColors: Record<string, string> = {
  Male: '#2563EB',
  Female: '#DB2777',
  Other: '#7C3AED',
};

export const PatientCardList: React.FC<Props> = ({ patients }) => {
  return (
    <div className="patient-list-table-wrapper">
      <table className="patient-list-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Age / Gender</th>
            <th>Condition</th>
            <th>Doctor</th>
            <th>Ward</th>
            <th>Admit Date</th>
            <th>Blood</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => {
            const status = statusConfig[p.status] || statusConfig.Stable;
            return (
              <tr key={p.id} className="patient-list-row">
                <td>
                  <div className="plr-patient-cell">
                    <div
                      className="plr-avatar"
                      style={{ background: `${genderColors[p.gender]}18`, color: genderColors[p.gender] }}
                    >
                      {p.avatar}
                    </div>
                    <div>
                      <p className="plr-name">{p.name}</p>
                      <p className="plr-id">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td>{p.age} / {p.gender}</td>
                <td>
                  <span className="condition-tag">{p.condition}</span>
                </td>
                <td>{p.doctor}</td>
                <td>{p.ward}</td>
                <td>{p.admitDate}</td>
                <td>{p.bloodType}</td>
                <td>
                  <span className="status-pill" style={{ color: status.color, background: status.bg }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
