import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

export default function DriversPage() {
  const { globalSearch, setGlobalSearch } = useOutletContext();
  const [drivers, setDrivers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'LMV',
    licenseExpiry: '',
    contactNumber: '',
    safetyScore: 100
  });
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Add a slight debounce to search to avoid spamming the backend
    const timeoutId = setTimeout(() => {
      fetchDrivers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [statusFilter, globalSearch]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/drivers?';
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (globalSearch) url += `search=${encodeURIComponent(globalSearch)}&`;
        
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setDrivers(data.data);
      } else {
        setError(data.message || 'Failed to fetch drivers');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ name: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', contactNumber: '', safetyScore: 100 });
        fetchDrivers(); // refresh list
      } else {
        setSubmitError(data.message || 'Failed to add driver');
      }
    } catch (err) {
      setSubmitError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatExpiry = (dateStr) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${yyyy}`;
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Drivers & Safety Profiles</h2>
          <p className="text-text-secondary text-body-md mt-1">Manage driver assignments, credentials, and safety performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-container text-on-primary font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Driver
        </button>
      </div>

      <div className="bg-bg-surface flex items-center justify-between p-4 rounded-lg border border-border-subtle">
        <div className="flex items-center gap-4">
          <span className="text-label-caps text-text-secondary uppercase tracking-widest">Toggle Status</span>
          <div className="flex bg-surface-container-lowest rounded-md p-1 border border-border-subtle">
            {['All', 'Available', 'On Trip', 'Suspended'].map((status) => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded text-body-md font-medium transition-all ${
                  statusFilter === status 
                    ? 'bg-secondary-container text-on-surface shadow-sm' 
                    : 'text-text-secondary hover:text-on-surface'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Driver Data Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-border-subtle">
            <tr>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider">Driver Name</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider">License No.</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider">Category</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider">Expiry</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider">Contact</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider text-right">Trip Compl.</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider text-right">Safety Score</th>
              <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider pl-8">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-body-md font-body-md">
            {loading ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-text-secondary">Loading drivers...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-status-danger">{error}</td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-text-secondary">No drivers found.</td>
              </tr>
            ) : (
              drivers.map((driver) => {
                const expired = isExpired(driver.licenseExpiryDate);
                const isSuspended = driver.status === 'Suspended';
                
                return (
                  <tr 
                    key={driver._id} 
                    className={`${isSuspended ? 'bg-status-danger/5 border-l-2 border-l-status-danger hover:bg-status-danger/10' : 'hover:bg-surface-container-high'} transition-colors group cursor-pointer`}
                  >
                    <td className={`py-3 px-4 font-medium flex items-center gap-3 ${isSuspended ? 'text-status-danger' : 'text-on-surface'}`}>
                      <div className={`w-8 h-8 rounded border flex items-center justify-center ${
                        isSuspended 
                          ? 'bg-status-danger/20 border-status-danger/30 text-status-danger' 
                          : 'bg-surface-bright border-border-subtle text-text-secondary'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {isSuspended ? 'warning' : 'person'}
                        </span>
                      </div>
                      {driver.name}
                    </td>
                    <td className="py-3 px-4 text-text-secondary font-data-mono">{driver.licenseNumber}</td>
                    <td className="py-3 px-4 text-on-surface">{driver.licenseCategory}</td>
                    <td className={`py-3 px-4 ${expired ? 'text-status-danger font-medium' : 'text-on-surface'}`}>
                      {formatExpiry(driver.licenseExpiryDate)} {expired && 'EXPIRED'}
                    </td>
                    <td className="py-3 px-4 text-text-secondary font-data-mono">{driver.contactNumber}</td>
                    <td className="py-3 px-4 text-right font-data-mono text-on-surface">{driver.tripsCompleted || 0}</td>
                    <td className={`py-3 px-4 text-right font-data-mono ${driver.safetyScore < 60 ? 'text-status-danger' : 'text-status-success'}`}>
                      {driver.safetyScore}/100
                    </td>
                    <td className="py-3 px-4 pl-8">
                      <StatusBadge status={driver.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="bg-surface-container-low px-4 py-3 border-t border-border-subtle flex items-center justify-between text-body-md text-text-secondary">
          <span>Showing {drivers.length} drivers</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="px-3 py-1 bg-surface-container-highest rounded text-on-surface">1</span>
            <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-label-caps text-status-danger/80">
        <span className="material-symbols-outlined text-[16px]">info</span>
        <span>Note: Expired license or Suspended status -&gt; blocked from trip assignment</span>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border-subtle rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-border-subtle">
              <h3 className="text-headline-md text-on-surface">Add New Driver</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
              {submitError && (
                <div className="bg-status-danger/10 border border-status-danger text-status-danger text-body-md p-3 rounded">
                  {submitError}
                </div>
              )}
              
              <div>
                <label className="block text-label-caps text-text-secondary mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface focus:outline-none focus:border-primary" placeholder="e.g. Jane Doe" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-caps text-text-secondary mb-1">License No.</label>
                  <input required type="text" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface focus:outline-none focus:border-primary" placeholder="DL-12345" />
                </div>
                <div>
                  <label className="block text-label-caps text-text-secondary mb-1">Category</label>
                  <select value={formData.licenseCategory} onChange={e => setFormData({...formData, licenseCategory: e.target.value})} className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface focus:outline-none focus:border-primary">
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-caps text-text-secondary mb-1">Expiry Date</label>
                  <input required type="date" value={formData.licenseExpiry} onChange={e => setFormData({...formData, licenseExpiry: e.target.value})} className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-label-caps text-text-secondary mb-1">Contact No.</label>
                  <input required type="text" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface focus:outline-none focus:border-primary" placeholder="+1..." />
                </div>
              </div>

              <div>
                <label className="block text-label-caps text-text-secondary mb-1">Initial Safety Score (0-100)</label>
                <input required type="number" min="0" max="100" value={formData.safetyScore} onChange={e => setFormData({...formData, safetyScore: Number(e.target.value)})} className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface focus:outline-none focus:border-primary" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surface-bright border border-border-subtle text-on-surface rounded hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
