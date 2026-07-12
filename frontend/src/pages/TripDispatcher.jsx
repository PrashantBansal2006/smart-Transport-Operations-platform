import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

// 1. Credentials/Auth Service (Simulation for logic integration)
const authService = {
  getToken: () => localStorage.getItem('authToken'),
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  })
};

export default function TripsDispatcher() {
  const { globalSearch } = useOutletContext() || {};
  const [trips, setTrips] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeightKg: '',
    plannedDistanceKm: ''
  });

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [completionData, setCompletionData] = useState({
    finalOdometer: '',
    fuelConsumedLiters: ''
  });
  
  const [actionError, setActionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- APPLICATION LOGIC: FETCH TRIPS ---
  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/trips';
      if (statusFilter !== 'All') {
        url += `?status=${statusFilter}`;
      }
      
      const res = await fetch(url, { headers: authService.getHeaders() });
      const data = await res.json();
      
      if (data.success) {
        let filteredData = data.data;
        if (globalSearch) {
          const query = globalSearch.toLowerCase();
          filteredData = filteredData.filter(trip => 
            trip.tripCode?.toLowerCase().includes(query) ||
            trip.source?.toLowerCase().includes(query) ||
            trip.destination?.toLowerCase().includes(query)
          );
        }
        setTrips(filteredData);
      } else {
        setError(data.error || data.message || 'Failed to fetch trips');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, globalSearch]);

  const fetchDropdownData = async () => {
    try {
      const [vehicleRes, driverRes] = await Promise.all([
        fetch('http://localhost:5000/api/vehicles', { headers: authService.getHeaders() }),
        fetch('http://localhost:5000/api/drivers', { headers: authService.getHeaders() })
      ]);
      
      const vehicleData = await vehicleRes.json();
      const driverData = await driverRes.json();
      
      if (vehicleData?.success) setVehicles(vehicleData.data || []);
      if (Array.isArray(driverData)) setDrivers(driverData);
    } catch (err) {
      console.error("Error loading dropdown lists", err);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchDropdownData();
  }, [fetchTrips]);

  // --- APPLICATION LOGIC: ACTIONS ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createData.vehicleId || !createData.driverId) {
      setActionError("Please select both a valid Vehicle and Driver from the list.");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: authService.getHeaders(),
        body: JSON.stringify({
          ...createData,
          cargoWeightKg: Number(createData.cargoWeightKg),
          plannedDistanceKm: Number(createData.plannedDistanceKm)
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsCreateModalOpen(false);
        setCreateData({ source: '', destination: '', vehicleId: '', driverId: '', cargoWeightKg: '', plannedDistanceKm: '' });
        fetchTrips();
      } else {
        setActionError(data.error || 'Failed to create trip');
      }
    } catch (err) {
      setActionError('Network error while scheduling trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispatch = async (id) => {
    if (!window.confirm('Are you sure you want to dispatch this trip?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}/dispatch`, {
        method: 'POST',
        headers: authService.getHeaders()
      });
      const data = await res.json();
      if (data.success) fetchTrips();
      else alert(data.error || 'Dispatch failed');
    } catch (err) { alert('Network error during dispatch'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}/cancel`, {
        method: 'POST',
        headers: authService.getHeaders()
      });
      const data = await res.json();
      if (data.success) fetchTrips();
      else alert(data.error || 'Cancellation failed');
    } catch (err) { alert('Network error during cancellation'); }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${selectedTripId}/complete`, {
        method: 'POST',
        headers: authService.getHeaders(),
        body: JSON.stringify({
          finalOdometer: Number(completionData.finalOdometer),
          fuelConsumedLiters: Number(completionData.fuelConsumedLiters)
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsCompleteModalOpen(false);
        fetchTrips();
      } else {
        setActionError(data.error || 'Failed to complete trip');
      }
    } catch (err) { setActionError('Network error'); }
    finally { setIsSubmitting(false); }
  };

  // ... [Return JSX same as before] ...
  return (
    <div className="p-6 bg-surface-container-lowest min-h-screen text-on-surface">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-headline-lg font-bold">Trip Dispatch Control</h2>

          <p className="text-text-secondary text-body-md mt-1">Monitor, dispatch, and close route manifests seamlessly.</p>

        </div>

        <button

          onClick={() => { setActionError(null); setIsCreateModalOpen(true); }}

          className="bg-primary hover:bg-primary-container text-on-primary font-medium px-4 py-2 rounded flex items-center gap-2 text-body-md transition-colors"

        >

          <span className="material-symbols-outlined text-[20px]">add</span>

          Schedule New Trip

        </button>

      </div>



      {/* Filter Tabs */}

      <div className="bg-bg-surface flex items-center justify-between p-4 rounded-lg border border-border-subtle mb-4">

        <div className="flex items-center gap-4">

          <span className="text-label-caps text-text-secondary uppercase tracking-widest text-xs">Filter Status</span>

          <div className="flex bg-surface-container-lowest rounded-md p-1 border border-border-subtle">

            {['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'].map((status) => (

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



      {/* Trips Table */}

      <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-sm">

        <table className="w-full text-left border-collapse">

          <thead className="bg-surface-container-low border-b border-border-subtle">

            <tr>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs">Trip Code</th>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs">Route (Source → Dest)</th>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs">Vehicle Reg</th>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs">Driver Assignment</th>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs text-right">Distance (km)</th>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs text-right">Cargo (kg)</th>

              <th className="py-3 px-4 text-label-caps text-text-secondary uppercase tracking-wider text-xs pl-8">Status</th>

              <th className="py-3 px-4 text-center text-label-caps text-text-secondary uppercase tracking-wider text-xs w-48">Actions</th>

            </tr>

          </thead>

          <tbody className="divide-y divide-border-subtle text-body-md">

            {loading ? (

              <tr>

                <td colSpan="8" className="py-8 text-center text-text-secondary">Loading manifests...</td>

              </tr>

            ) : error ? (

              <tr>

                <td colSpan="8" className="py-8 text-center text-status-danger">{error}</td>

              </tr>

            ) : trips.length === 0 ? (

              <tr>

                <td colSpan="8" className="py-8 text-center text-text-secondary">No matching trips found.</td>

              </tr>

            ) : (

              trips.map((trip) => (

                <tr key={trip._id} className="hover:bg-surface-container-high transition-colors group">

                  <td className="py-3 px-4 font-mono font-medium text-on-surface">{trip.tripCode}</td>

                  <td className="py-3 px-4 text-on-surface font-medium">

                    {trip.source} <span className="text-text-secondary font-normal mx-1">→</span> {trip.destination}

                  </td>

                  <td className="py-3 px-4 text-text-secondary font-mono">

                    {trip.vehicleId?.registrationNumber || '--'}

                  </td>

                  <td className="py-3 px-4 text-on-surface">

                    {trip.driverId?.name || '--'}

                  </td>

                  <td className="py-3 px-4 text-right font-mono text-on-surface">

                    {trip.plannedDistanceKm} km

                  </td>

                  <td className="py-3 px-4 text-right font-mono text-on-surface">

                    {trip.cargoWeightKg} kg

                  </td>

                  <td className="py-3 px-4 pl-8">

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${

                      trip.status === 'Draft' ? 'bg-amber-100 text-amber-800' :

                      trip.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :

                      trip.status === 'Completed' ? 'bg-green-100 text-green-800' :

                      'bg-red-100 text-red-800'

                    }`}>

                      {trip.status}

                    </span>

                  </td>

                  <td className="py-3 px-4 text-center">

                    <div className="flex justify-center gap-2">

                      {trip.status === 'Draft' && (

                        <>

                          <button

                            onClick={() => handleDispatch(trip._id)}

                            className="bg-green-100 hover:bg-green-600 text-green-700 hover:text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"

                          >

                            Dispatch

                          </button>

                          <button

                            onClick={() => handleCancel(trip._id)}

                            className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"

                          >

                            Cancel

                          </button>

                        </>

                      )}

                      {trip.status === 'Dispatched' && (

                        <>

                          <button

                            onClick={() => openCompleteModal(trip._id)}

                            className="bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"

                          >

                            Complete

                          </button>

                          <button

                            onClick={() => handleCancel(trip._id)}

                            className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"

                          >

                            Cancel

                          </button>

                        </>

                      )}

                      {(trip.status === 'Completed' || trip.status === 'Cancelled') && (

                        <span className="text-xs text-text-secondary italic">Archived</span>

                      )}

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>



      {/* Create Trip Modal */}

      {isCreateModalOpen && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-bg-surface border border-border-subtle rounded-lg w-full max-w-lg shadow-xl overflow-hidden">

            <div className="flex justify-between items-center p-4 border-b border-border-subtle">

              <h3 className="text-headline-md text-on-surface font-semibold">Schedule New Route Manifest</h3>

              <button onClick={() => setIsCreateModalOpen(false)} className="text-text-secondary hover:text-on-surface">

                <span className="material-symbols-outlined">close</span>

              </button>

            </div>

           

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">

              {actionError && (

                <div className="bg-red-100 border border-red-400 text-red-700 text-body-md p-3 rounded">

                  {actionError}

                </div>

              )}

             

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Source City</label>

                  <input

                    required

                    type="text"

                    value={createData.source}

                    onChange={e => setCreateData({...createData, source: e.target.value})}

                    className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface text-body-md"

                    placeholder="e.g. Mumbai"

                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Destination City</label>

                  <input

                    required

                    type="text"

                    value={createData.destination}

                    onChange={e => setCreateData({...createData, destination: e.target.value})}

                    className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface text-body-md"

                    placeholder="e.g. Delhi"

                  />

                </div>

              </div>



              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Assign Vehicle</label>

                  <select

                    required

                    value={createData.vehicleId}

                    onChange={e => setCreateData({...createData, vehicleId: e.target.value})}

                    className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface text-body-md"

                  >

                    <option value="">Select Fleet Truck</option>

                    {vehicles.map(v => (

                      <option key={v._id} value={v._id}>

                        {v.registrationNumber} {v.model ? `(${v.model})` : ''}

                      </option>

                    ))}

                  </select>

                </div>

                <div>

                  <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Assign Driver</label>

                  <select

                    required

                    value={createData.driverId}

                    onChange={e => setCreateData({...createData, driverId: e.target.value})}

                    className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface text-body-md"

                  >

                    <option value="">Select Pilot Driver</option>

                    {drivers.map(d => (

                      <option key={d._id} value={d._id}>

                        {d.name}

                      </option>

                    ))}

                  </select>

                </div>

              </div>



              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Planned Distance (km)</label>

                  <input

                    required

                    type="number"

                    min="1"

                    value={createData.plannedDistanceKm}

                    onChange={e => setCreateData({...createData, plannedDistanceKm: e.target.value})}

                    className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface font-mono"

                    placeholder="e.g. 1420"

                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Cargo Weight (kg)</label>

                  <input

                    required

                    type="number"

                    min="1"

                    value={createData.cargoWeightKg}

                    onChange={e => setCreateData({...createData, cargoWeightKg: e.target.value})}

                    className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface font-mono"

                    placeholder="e.g. 8500"

                  />

                </div>

              </div>



              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">

                <button

                  type="button"

                  onClick={() => setIsCreateModalOpen(false)}

                  className="px-4 py-2 bg-surface-bright border border-border-subtle text-on-surface rounded hover:bg-surface-container-high transition-colors text-body-md"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={isSubmitting}

                  className="px-4 py-2 bg-primary hover:bg-primary-container text-white bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors disabled:opacity-50 text-body-md"

                >

                  {isSubmitting ? 'Creating...' : 'Save Draft Trip'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* Completion Modal */}

      {isCompleteModalOpen && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-bg-surface border border-border-subtle rounded-lg w-full max-w-md shadow-xl">

            <div className="flex justify-between items-center p-4 border-b border-border-subtle">

              <h3 className="text-headline-md text-on-surface font-semibold">Finalize Fleet Logistics</h3>

              <button onClick={() => setIsCompleteModalOpen(false)} className="text-text-secondary hover:text-on-surface">

                <span className="material-symbols-outlined">close</span>

              </button>

            </div>

           

            <form onSubmit={handleCompleteSubmit} className="p-4 space-y-4">

              {actionError && (

                <div className="bg-red-100 border border-red-400 text-red-700 text-body-md p-3 rounded">

                  {actionError}

                </div>

              )}

             

              <div>

                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Final Odometer Reading (km)</label>

                <input

                  required

                  type="number"

                  value={completionData.finalOdometer}

                  onChange={e => setCompletionData({...completionData, finalOdometer: e.target.value})}

                  className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface font-mono"

                  placeholder="Final odometer value"

                />

              </div>



              <div>

                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase">Total Fuel Consumed (Liters)</label>

                <input

                  required

                  type="number"

                  step="0.01"

                  value={completionData.fuelConsumedLiters}

                  onChange={e => setCompletionData({...completionData, fuelConsumedLiters: e.target.value})}

                  className="w-full bg-surface-bright border border-border-subtle rounded py-2 px-3 text-on-surface font-mono"

                  placeholder="e.g. 145.50"

                />

              </div>



              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">

                <button

                  type="button"

                  onClick={() => setIsCompleteModalOpen(false)}

                  className="px-4 py-2 bg-surface-bright border border-border-subtle text-on-surface rounded hover:bg-surface-container-high transition-colors"

                >

                  Close

                </button>

                <button

                  type="submit"

                  disabled={isSubmitting}

                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors disabled:opacity-50"

                >

                  {isSubmitting ? 'Processing...' : 'Submit Realized Logs'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}