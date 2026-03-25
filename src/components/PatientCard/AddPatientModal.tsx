import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { useUIStore } from '../../store/uiStore';
import type { Patient } from '../../types';

interface Props {
  onClose: () => void;
}

export const AddPatientModal: React.FC<Props> = ({ onClose }) => {
  const { addPatient, patients } = usePatientStore();
  const { sendLocalNotification } = useUIStore();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    condition: '',
    status: 'Stable',
    doctor: '',
    ward: '',
    bloodType: '',
    phone: '',
    diagnosis: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a simple ID
    const newId = `P${String(patients.length + 1).padStart(3, '0')}`;
    
    // Generate initials for avatar
    const avatar = formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'P';

    const newPatient: Patient = {
      id: newId,
      name: formData.name,
      age: parseInt(formData.age, 10) || 0,
      gender: formData.gender as Patient['gender'],
      condition: formData.condition,
      status: formData.status as Patient['status'],
      doctor: formData.doctor,
      ward: formData.ward,
      admitDate: new Date().toISOString().split('T')[0],
      avatar,
      bloodType: formData.bloodType,
      phone: formData.phone,
      diagnosis: formData.diagnosis,
    };

    addPatient(newPatient);

    sendLocalNotification(
      '🆕 New Patient Admitted',
      `Patient ${newPatient.name} (${newId}) has been admitted to ${newPatient.ward}.`,
      'success'
    );

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Patient</h2>
          <button className="icon-btn close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input required name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input required type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} placeholder="45" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Condition</label>
              <input required name="condition" className="form-input" value={formData.condition} onChange={handleChange} placeholder="e.g. Hypertension" />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                  <option value="Stable">Stable</option>
                  <option value="Critical">Critical</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type</label>
                <input name="bloodType" className="form-input" value={formData.bloodType} onChange={handleChange} placeholder="O+" />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Attending Doctor</label>
                <input required name="doctor" className="form-input" value={formData.doctor} onChange={handleChange} placeholder="Dr. Smith" />
              </div>
              <div className="form-group">
                <label className="form-label">Ward / Department</label>
                <input required name="ward" className="form-input" value={formData.ward} onChange={handleChange} placeholder="Cardiology" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input required name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Diagnosis / Notes</label>
              <textarea name="diagnosis" className="form-textarea" value={formData.diagnosis} onChange={handleChange} rows={3} placeholder="Patient notes..." />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="login-btn submit-modal-btn">Add Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};
