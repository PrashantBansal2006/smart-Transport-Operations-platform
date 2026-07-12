import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const API_BASE = 'http://localhost:5000/api';

export default function MaintenancePage() {
  const { globalSearch, setGlobalSearch } = useOutletContext();

  // Data state
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    notes: '',
  });
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed KPIs
  const vehiclesInShop = logs.filter((l) => l.status === 'Active').length;
  const openWorkOrders = logs.filter((l) => l.status === 'Active').length;
  const completedLogs = logs.filter((l) => l.status === 'Completed');
  const mtdCost = completedLogs.reduce((sum, l) => sum + (l.cost || 0), 0);

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, [statusFilter]);

  // Fetch maintenance logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE}/maintenance`;
      if (statusFilter) url += `?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        setError(data.message || 'Failed to fetch maintenance logs');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles for dropdown
  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (err) {
      // silently fail – the dropdown just won't populate
    }
  };

  // Create work order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        vehicleId: formData.vehicleId,
        serviceType: formData.serviceType,
        cost: Number(formData.cost) || 0,
        date: formData.date,
      };

      const res = await fetch(`${API_BASE}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitSuccess('Work order created successfully!');
        setFormData({
          vehicleId: '',
          serviceType: '',
          cost: '',
          date: new Date().toISOString().split('T')[0],
          odometer: '',
          notes: '',
        });
        fetchLogs();
        fetchVehicles();
        setTimeout(() => setSubmitSuccess(null), 3000);
      } else {
        setSubmitError(data.message || 'Failed to create work order');
      }
    } catch (err) {
      setSubmitError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close / complete a work order
  const handleClose = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/maintenance/${id}/close`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
        fetchVehicles();
      }
    } catch (err) {
      // silent
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format currency
  const formatCost = (cost) => {
    if (cost === undefined || cost === null) return '-';
    return `₹${Number(cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Generate work order ID from Mongo _id
  const workOrderId = (id) => {
    if (!id) return '#WO-0000';
    const short = id.slice(-4).toUpperCase();
    return `#WO-${short}`;
  };

  // Filter logs by search
  const filteredLogs = logs.filter((log) => {
    if (!globalSearch) return true;
    const q = globalSearch.toLowerCase();
    const regNum = log.vehicleId?.registrationNumber?.toLowerCase() || '';
    const serviceType = log.serviceType?.toLowerCase() || '';
    return regNum.includes(q) || serviceType.includes(q);
  });

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            Maintenance Operations
          </h2>
          <p className="text-body-md text-text-secondary mt-1">
            Manage fleet repairs, schedule services, and track maintenance costs.
          </p>
        </div>
        <button className="px-4 py-2 bg-surface-container-high border border-border-subtle rounded-lg text-on-surface font-body-md flex items-center gap-2 hover:bg-surface-variant transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Log
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vehicles In Shop */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 flex flex-col justify-between group hover:border-status-danger/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
              Vehicles In Shop
            </span>
            <div className="w-9 h-9 rounded-lg bg-status-danger/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-status-danger text-[20px]">build</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {vehiclesInShop}
            </span>
            {vehiclesInShop > 0 && (
              <span className="text-body-md text-status-danger flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                {vehiclesInShop}
              </span>
            )}
          </div>
        </div>

        {/* Open Work Orders */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 flex flex-col justify-between group hover:border-status-info/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
              Open Work Orders
            </span>
            <div className="w-9 h-9 rounded-lg bg-status-info/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-status-info text-[20px]">assignment</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {openWorkOrders}
            </span>
            <span className="text-body-md text-text-secondary">Active orders</span>
          </div>
        </div>

        {/* MTD Service Cost */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
                MTD Service Cost
              </span>
              <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-[20px]">payments</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-lg font-headline-lg text-on-surface">
                {formatCost(mtdCost)}
              </span>
              {mtdCost > 0 && (
                <span className="text-body-md text-status-success flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_down</span>
                  tracked
                </span>
              )}
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary-container/5 rounded-full blur-xl z-0"></div>
        </div>
      </div>

      {/* Layout: Table + Form */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Service Log Table */}
        <div className="xl:col-span-2 bg-bg-surface border border-border-subtle rounded-lg flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-container-low">
            <h3 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-text-secondary">history</span>
              Service Log
            </h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container border border-border-subtle rounded px-3 py-1.5 text-label-caps font-label-caps text-on-surface outline-none focus:border-primary-container transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-bg-surface z-10 shadow-sm shadow-background">
                <tr>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                    ID
                  </th>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                    Vehicle
                  </th>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                    Service Type
                  </th>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                    Date
                  </th>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle text-right">
                    Cost
                  </th>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                    Status
                  </th>
                  <th className="py-3 px-4 text-label-caps font-label-caps text-text-secondary uppercase tracking-wider border-b border-border-subtle text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="font-data-mono text-data-mono text-on-surface">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-text-secondary">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[32px] animate-spin">progress_activity</span>
                        Loading maintenance logs...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-status-danger">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[32px]">error</span>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-text-secondary">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                        No maintenance records found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isActive = log.status === 'Active';
                    const vehicleReg = log.vehicleId?.registrationNumber || 'N/A';
                    const vehicleStatus = log.vehicleId?.status;

                    return (
                      <tr
                        key={log._id}
                        className={`border-b border-border-subtle hover:bg-surface-container-high/50 transition-colors ${
                          isActive ? 'bg-status-info/[0.03]' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-text-secondary">
                          {workOrderId(log._id)}
                        </td>
                        <td
                          className={`py-3 px-4 font-medium ${
                            vehicleStatus === 'InShop'
                              ? 'text-status-danger'
                              : 'text-on-surface'
                          }`}
                        >
                          {vehicleReg}
                        </td>
                        <td className="py-3 px-4">{log.serviceType}</td>
                        <td className="py-3 px-4 text-text-secondary">
                          {formatDate(log.date)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isActive ? '--' : formatCost(log.cost)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={log.status} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isActive && (
                            <button
                              onClick={() => handleClose(log._id)}
                              className="px-3 py-1 bg-status-success/10 text-status-success border border-status-success/20 rounded text-[11px] font-label-caps uppercase tracking-wider hover:bg-status-success/20 transition-colors active:scale-95"
                              title="Mark as completed"
                            >
                              Complete
                            </button>
                          )}
                          {!isActive && (
                            <span className="text-text-secondary text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-surface-container-low px-4 py-3 border-t border-border-subtle flex items-center justify-between text-body-md text-text-secondary">
            <span>
              Showing {filteredLogs.length} of {logs.length} records
            </span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="px-3 py-1 bg-surface-container-highest rounded text-on-surface">
                1
              </span>
              <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* New Work Order Form */}
        <div className="xl:col-span-1 bg-surface-container-low border border-border-subtle rounded-lg flex flex-col h-fit">
          {/* Form Header */}
          <div className="p-4 border-b border-border-subtle bg-bg-surface rounded-t-lg">
            <h3 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">add_circle</span>
              Log New Service
            </h3>
            <p className="text-[13px] text-text-secondary mt-1">
              Automatically updates vehicle status to 'In Shop'.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            {/* Success message */}
            {submitSuccess && (
              <div className="bg-status-success/10 border border-status-success/30 text-status-success text-body-md p-3 rounded flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {submitSuccess}
              </div>
            )}

            {/* Error message */}
            {submitError && (
              <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger text-body-md p-3 rounded flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {submitError}
              </div>
            )}

            {/* Vehicle ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
                Vehicle
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                  directions_car
                </span>
                <select
                  required
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full bg-bg-surface border border-border-subtle rounded-md text-body-md text-on-surface pl-9 pr-8 py-2 appearance-none focus:border-primary-container focus:bg-surface-container-high outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>
                    Select vehicle...
                  </option>
                  {vehicles
                    .filter((v) => v.status !== 'Retired' && v.status !== 'OnTrip')
                    .map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.registrationNumber} — {v.model || v.type}
                      </option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Service Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
                Service Type
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-bg-surface border border-border-subtle rounded-md text-body-md text-on-surface px-3 py-2 appearance-none focus:border-primary-container focus:bg-surface-container-high outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>
                    Select service category...
                  </option>
                  <option>Oil Change &amp; Lube</option>
                  <option>Engine Repair / Diagnostics</option>
                  <option>Brake Service</option>
                  <option>Tire Replacement / Rotation</option>
                  <option>Transmission Service</option>
                  <option>AC System Service</option>
                  <option>General Inspection</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Odometer + Cost side-by-side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
                  Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-bg-surface border border-border-subtle rounded-md text-data-mono font-data-mono text-on-surface px-3 py-2 focus:border-primary-container outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
                  Est. Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-data-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full bg-bg-surface border border-border-subtle rounded-md text-data-mono font-data-mono text-on-surface pl-7 pr-3 py-2 focus:border-primary-container outline-none text-right transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps font-label-caps text-text-secondary uppercase tracking-widest">
                Technician Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-bg-surface border border-border-subtle rounded-md text-body-md text-on-surface px-3 py-2 focus:border-primary-container outline-none resize-none transition-colors"
                placeholder="Describe the issue or service required..."
                rows="3"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-primary-container hover:bg-primary text-on-primary-container font-headline-md text-[15px] py-2.5 rounded-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">build_circle</span>
              {isSubmitting ? 'Creating...' : 'Create Work Order'}
            </button>

            {/* Info Box */}
            <div className="flex items-start gap-2 mt-1 bg-surface-container border border-border-subtle p-3 rounded text-text-secondary text-[12px] leading-tight">
              <span className="material-symbols-outlined text-status-info text-[16px] shrink-0 mt-0.5">
                info
              </span>
              <p>
                Submitting this form will automatically change the vehicle's fleet status to{' '}
                <strong className="text-status-danger">In Shop</strong>, preventing it from being
                dispatched.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
