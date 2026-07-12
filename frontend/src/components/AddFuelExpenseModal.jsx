import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddFuelExpenseModal({ isOpen, onClose, onSuccess }) {
  const [entryType, setEntryType] = useState('fuel'); // 'fuel' or 'expense'
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [vehicleId, setVehicleId] = useState('');
  const [tripId, setTripId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Fuel specific
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  
  // Expense specific
  const [expenseType, setExpenseType] = useState('Toll');
  const [amount, setAmount] = useState('');

  // Fetch vehicles and trips for the dropdowns
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:5000/api/vehicles', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => {
          if (res.data.success) {
            setVehicles(res.data.data);
            if (res.data.data.length > 0) {
              setVehicleId(res.data.data[0]._id);
            }
          }
        })
        .catch(err => console.error("Error fetching vehicles for modal", err));
        
      axios.get('http://localhost:5000/api/trips', { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            setTrips(res.data.data);
          }
        })
        .catch(err => console.error("Error fetching trips for modal", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (entryType === 'fuel') {
        const payload = {
          vehicleId,
          liters: Number(liters),
          cost: Number(cost),
          date
        };
        if (tripId) payload.tripId = tripId;

        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/fuel-logs', payload, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.data.success) {
          onSuccess();
          resetForm();
        }
      } else {
        const payload = {
          vehicleId,
          type: expenseType,
          amount: Number(amount),
          date
        };
        if (tripId) payload.tripId = tripId;

        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/expenses', payload, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.data.success) {
          onSuccess();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create record. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLiters('');
    setCost('');
    setAmount('');
    setTripId('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-surface w-full max-w-md rounded-xl border border-border-subtle shadow-2xl p-6 relative">
        <button 
          onClick={resetForm}
          className="absolute top-4 right-4 text-text-secondary hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-6">Log Record</h3>

        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              className="accent-primary"
              checked={entryType === 'fuel'} 
              onChange={() => setEntryType('fuel')} 
            />
            <span className="text-body-md text-on-surface">Fuel Log</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              className="accent-primary"
              checked={entryType === 'expense'} 
              onChange={() => setEntryType('expense')} 
            />
            <span className="text-body-md text-on-surface">Other Expense</span>
          </label>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-status-danger/10 border border-status-danger text-status-danger text-body-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-label-caps text-text-secondary mb-1">Vehicle</label>
            <div className="relative">
              <select 
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full bg-surface-container-low border border-border-subtle rounded py-2 pl-3 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary appearance-none"
              >
                {vehicles.map(v => (
                  <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-caps text-text-secondary mb-1">Date</label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container-low border border-border-subtle rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-label-caps text-text-secondary mb-1">Trip ID (Optional)</label>
              <div className="relative">
                <select 
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded py-2 pl-3 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="">None</option>
                  {trips.map(t => (
                    <option key={t._id} value={t._id}>{t.tripCode} - {t.source} to {t.destination}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          {entryType === 'fuel' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-caps text-text-secondary mb-1">Liters</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  placeholder="e.g. 50"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-label-caps text-text-secondary mb-1">Total Cost (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  placeholder="e.g. 85.50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary placeholder:text-text-muted"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-caps text-text-secondary mb-1">Expense Type</label>
                <div className="relative">
                  <select 
                    value={expenseType}
                    onChange={(e) => setExpenseType(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded py-2 pl-3 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary appearance-none"
                  >
                    <option value="Toll">Toll</option>
                    <option value="Misc">Misc</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block text-label-caps text-text-secondary mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  placeholder="e.g. 15.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary placeholder:text-text-muted"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
            <button 
              type="button" 
              onClick={resetForm}
              className="px-4 py-2 text-body-md font-medium text-text-primary hover:bg-surface-container transition-colors rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-on-primary font-medium text-body-md py-2 px-5 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
