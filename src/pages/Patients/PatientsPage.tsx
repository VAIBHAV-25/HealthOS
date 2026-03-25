import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, Plus, Bell } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { useUIStore } from '../../store/uiStore';
import { PatientCardGrid } from '../../components/PatientCard/PatientCardGrid';
import { PatientCardList } from '../../components/PatientCard/PatientCardList';
import { AddPatientModal } from '../../components/PatientCard/AddPatientModal';
import type { FilterStatus } from '../../types';

const STATUSES: FilterStatus[] = ['All', 'Stable', 'Critical', 'Recovering', 'Discharged'];

export const PatientsPage: React.FC = () => {
  const {
    viewMode, setViewMode, searchQuery, setSearchQuery,
    filterStatus, setFilterStatus, filteredPatients, patients
  } = usePatientStore();
  const { sendLocalNotification, requestNotificationPermission, notificationPermission } = useUIStore();
  const [adding, setAdding] = useState(false);

  const visible = filteredPatients();

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
    sendLocalNotification(
      '🔔 Notifications Enabled',
      'You will now receive HealthOS alerts and patient updates.',
      'info'
    );
  };

  const statusCounts: Record<string, number> = { All: patients.length };
  STATUSES.slice(1).forEach((s) => {
    statusCounts[s] = patients.filter((p) => p.status === s).length;
  });

  return (
    <div className="patients-page">
      {/* Toolbar */}
      <div className="patients-toolbar">
        <div className="patients-toolbar-left">
          <div className="search-box">
            <Search size={16} className="search-ic" />
            <input
              type="text"
              placeholder="Search patients, conditions, doctors..."
              className="patients-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              spellCheck="false"
              data-lpignore="true"
              data-form-type="other"
              name="patient-search-off"
            />
          </div>

          <div className="filter-dropdown-wrap">
            <Filter size={15} />
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s} ({statusCounts[s] ?? 0})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="patients-toolbar-right">
          {notificationPermission !== 'granted' && (
            <button className="enable-notif-btn" onClick={handleEnableNotifications} id="enable-notif-btn">
              <Bell size={15} />
              Enable Notifications
            </button>
          )}

          {/* View toggle */}
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              id="view-grid-btn"
            >
              <LayoutGrid size={17} />
              Grid
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              id="view-list-btn"
            >
              <List size={17} />
              List
            </button>
          </div>

          <button className="add-patient-btn" onClick={() => setAdding(true)} id="add-patient-btn">
            <Plus size={16} />
            Add Patient
          </button>
        </div>
      </div>

      {/* Status chips */}
      <div className="status-chips">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`status-chip ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s}
            <span className="chip-count">{statusCounts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Results info */}
      <div className="patients-meta">
        <span>Showing <strong>{visible.length}</strong> of <strong>{patients.length}</strong> patients</span>
      </div>

      {/* Patient views */}
      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No patients found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="patient-grid">
          {visible.map((p) => <PatientCardGrid key={p.id} patient={p} />)}
        </div>
      ) : (
        <PatientCardList patients={visible} />
      )}

      {/* Add Patient Modal */}
      {adding && <AddPatientModal onClose={() => setAdding(false)} />}
    </div>
  );
};
